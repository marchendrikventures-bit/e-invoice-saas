import { generateInvoicePdf } from '@/lib/pdfGenerator';
import { NextRequest, NextResponse } from 'next/server';
import { InvoiceService, invoiceSchema, type Invoice } from '@e-invoice-eu/core';
import { parse } from 'csv-parse/sync';
import * as xlsx from 'xlsx';
import Ajv from 'ajv/dist/2019';
import addFormats from 'ajv-formats';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { isRateLimited, getClientIp } from '@/lib/rateLimit';

const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const GUEST_MAX_ATTEMPTS = 15; // unauthenticated, keyed by IP
const USER_MAX_ATTEMPTS = 60;  // authenticated, keyed by user id (generous for legit bulk use)

const ajv = new Ajv({ strict: false, allErrors: true });
addFormats(ajv);
const validateInvoice = ajv.compile(invoiceSchema);

// Money is accumulated in integer cents throughout so summing many rounded
// line amounts can't drift by a cent from floating-point addition error.
const toCents = (n: number) => Math.round(n * 100);
const fromCents = (cents: number) => (cents / 100).toFixed(2);

type Party = { name: string; country: string; vat: string };

// A CSV/XLSX row or a JSON line item — column names vary by source, and
// spreadsheet cells can come back as either strings or numbers, so this
// stays loose by design rather than pretending to be a precise schema.
type InvoiceRecord = Record<string, string | number | undefined>;

// The caller-supplied "full EN16931 JSON" (`body.invoiceData`, an uploaded
// .json file, or the object this route builds itself) is validated at
// runtime against `invoiceSchema` (see `validateInvoice` below), not by the
// type system — that's what actually guarantees it matches the shape
// @e-invoice-eu/core's `Invoice` type expects. This type only models the
// handful of fields this route reads directly before that validation runs;
// everything else stays open via the index signature.
type InvoiceData = {
  'ubl:Invoice'?: {
    'cac:LegalMonetaryTotal'?: {
      'cbc:TaxInclusiveAmount'?: string;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
  legalMonetaryTotal?: {
    taxInclusiveAmount?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

// EN16931 has distinct VAT categories for a 0% line depending on *why* it's
// zero — treating every 0% line as "Z" (zero-rated goods) is only correct
// for an actual zero-rated supply, which is rare. The two common real cases
// for this app's audience are: an EU cross-border B2B reverse-charge supply
// (category "AE", buyer has a VAT ID in a different country), or a VAT
// exemption such as the German small-business rule, §19 UStG (category
// "E"). Both require a human-readable reason (BT-120), which some
// validators (BR-E-1 etc.) treat as mandatory for these categories.
function resolveZeroRateCategory(supplier: Party, customer: Party): { id: string; reason: string } {
  const crossBorderReverseCharge =
    !!customer.vat && !!customer.country && !!supplier.country && customer.country !== supplier.country;
  if (crossBorderReverseCharge) {
    return {
      id: 'AE',
      reason: 'Steuerschuldnerschaft des Leistungsempfängers (Reverse Charge, Art. 194/196 RL 2006/112/EG)',
    };
  }
  return { id: 'E', reason: 'Von der Umsatzsteuer befreite Leistung' };
}

export async function POST(req: NextRequest) {
  try {
    let userTier = 'GUEST';
    let user = null;

    // 1. Auth: API Key or Session
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const apiKey = authHeader.split(' ')[1];
      user = await prisma.user.findUnique({ where: { apiKey } });
    } else {
      const session = await getServerSession(authOptions);
      if (session && session.user?.email) {
        user = await prisma.user.findUnique({
          where: { email: session.user.email },
        });
      }
    }

    if (user) {
      userTier = user.tier; // 'FREE' or 'PRO'
    }

    // SECURITY: This endpoint parses uploaded files and renders PDFs, and
    // explicitly allows anonymous GUEST calls — without a limiter it's an
    // open cost-abuse/DoS surface (unlike register/forgot-password, which
    // are already throttled).
    const rateLimitKey = user ? `generate:user:${user.id}` : `generate:ip:${getClientIp(req)}`;
    const rateLimitMax = user ? USER_MAX_ATTEMPTS : GUEST_MAX_ATTEMPTS;
    if (isRateLimited(rateLimitKey, RATE_LIMIT_WINDOW, rateLimitMax)) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    // 2. Output Format (xml or pdf)
    const { searchParams } = new URL(req.url);
    const outputFormat = searchParams.get('output') === 'xml' ? 'xml' : 'pdf';

    const contentType = req.headers.get('content-type') || '';
    
    let customer = { name: '', street: '', city: '', zip: '', country: 'DE', vat: '' };
    let invoiceMeta = { invoiceNumber: '', issueDate: '' };
    let supplier = { name: '', street: '', city: '', zip: '', country: 'DE', vat: '', iban: '', bic: '', bankName: '' };
    let records: InvoiceRecord[] = [];
    let invoiceData: InvoiceData | null = null;

    if (user) {
      supplier = {
        name: user.companyName || '',
        street: user.street || '',
        city: user.city || '',
        zip: user.zip || '',
        country: user.country || 'DE',
        vat: user.vat || '',
        iban: user.iban || '',
        bic: user.bic || '',
        bankName: user.bankName || ''
      };
    }

    // 3. Parse Payload
    if (contentType.includes('application/json')) {
      const body = await req.json();
      if (body.customer) customer = { ...customer, ...body.customer };
      if (body.invoiceMeta) invoiceMeta = { ...invoiceMeta, ...body.invoiceMeta };
      if (!user && body.supplier) supplier = { ...supplier, ...body.supplier };
      
      if (body.invoiceData) {
        invoiceData = body.invoiceData; // Full EN16931 JSON
      } else if (body.items && Array.isArray(body.items)) {
        records = body.items;
      } else {
        return NextResponse.json({ error: 'JSON body must contain either "invoiceData" or "items" array.' }, { status: 400 });
      }
    } else {
      // Form-Data (File Upload)
      const formData = await req.formData();
      const file = formData.get('file') as File;
      if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });

      // SECURITY: Enforce 10MB file size limit
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json({ error: 'File size exceeds 10MB limit' }, { status: 413 });
      }

      const customerStr = formData.get('customer') as string;
      if (customerStr) customer = JSON.parse(customerStr);

      const invoiceMetaStr = formData.get('invoiceMeta') as string;
      if (invoiceMetaStr) invoiceMeta = JSON.parse(invoiceMetaStr);

      if (!user) {
        const supplierStr = formData.get('supplier') as string;
        if (supplierStr) supplier = JSON.parse(supplierStr);
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const filename = file.name.toLowerCase();

      if (filename.endsWith('.json')) {
        try {
          invoiceData = JSON.parse(buffer.toString('utf-8'));
        } catch {
          return NextResponse.json({ error: 'Invalid JSON format' }, { status: 400 });
        }
      } else if (filename.endsWith('.csv')) {
        records = parse(buffer, { columns: true, skip_empty_lines: true });
      } else if (filename.endsWith('.xlsx') || filename.endsWith('.xls')) {
        const workbook = xlsx.read(buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        records = xlsx.utils.sheet_to_json(sheet);
      } else {
        return NextResponse.json({ error: 'Unsupported file format.' }, { status: 400 });
      }
    }

    if (!invoiceData) {
      if (records.length === 0) {
        return NextResponse.json({ error: 'Empty file or invalid format' }, { status: 400 });
      }
      
      if (!supplier.name) {
        if (userTier === 'GUEST') {
            return NextResponse.json({ error: 'Seller Company Name is missing. Please provide your details.' }, { status: 400 });
        } else {
            return NextResponse.json({ error: 'Seller Company Name is missing. Please configure your details in Account Settings.' }, { status: 400 });
        }
      }

      if (!customer.name) {
        return NextResponse.json({ error: 'Customer Name is required for CSV/Excel uploads.' }, { status: 400 });
      }

      // Compute calculations rigorously — accumulated in integer cents (see
      // toCents/fromCents) so summing many lines can't drift from the sum
      // of the individually-rounded amounts shown on those lines.
      let totalTaxExclusiveCents = 0;
      let totalTaxInclusiveCents = 0;
      let lineCounter = 1;
      const zeroRateCategory = resolveZeroRateCategory(supplier, customer);

      type TaxSubtotal = { taxableCents: number; taxCents: number; categoryId: string; percent: number; reason?: string };
      const taxSubtotalsMap = new Map<string, TaxSubtotal>();

      const invoiceLines = records.map((record) => {
        const quantity = parseFloat(String(record.Quantity || record.Qty || '1'));
        const price = parseFloat(String(record.Price || record.UnitPrice || '0'));
        const taxPercent = parseFloat(String(record.TaxPercent || record.TaxRate || record.VAT || '19'));

        const lineExtensionCents = toCents(quantity * price);
        const taxCents = Math.round(lineExtensionCents * (taxPercent / 100));

        totalTaxExclusiveCents += lineExtensionCents;
        totalTaxInclusiveCents += lineExtensionCents + taxCents;

        const category = taxPercent === 0 ? zeroRateCategory : { id: 'S', reason: undefined };

        const key = `${category.id}_${taxPercent}`;
        if (!taxSubtotalsMap.has(key)) {
          taxSubtotalsMap.set(key, { taxableCents: 0, taxCents: 0, categoryId: category.id, percent: taxPercent, reason: category.reason });
        }
        const st = taxSubtotalsMap.get(key)!;
        st.taxableCents += lineExtensionCents;
        st.taxCents += taxCents;

        return {
          "cbc:ID": (lineCounter++).toString(),
          "cbc:InvoicedQuantity": quantity.toString(),
          "cbc:InvoicedQuantity@unitCode": "C62",
          "cbc:LineExtensionAmount": fromCents(lineExtensionCents),
          "cbc:LineExtensionAmount@currencyID": "EUR",
          "cac:Item": {
            "cbc:Name": String(record.ItemName || record.Name || record.Description || 'Item'),
            "cac:ClassifiedTaxCategory": {
              "cbc:ID": category.id,
              "cbc:Percent": taxPercent.toString(),
              "cac:TaxScheme": { "cbc:ID": "VAT" }
            }
          },
          "cac:Price": {
            "cbc:PriceAmount": price.toFixed(2),
            "cbc:PriceAmount@currencyID": "EUR"
          }
        };
      });

      const taxTotalAmount = fromCents(totalTaxInclusiveCents - totalTaxExclusiveCents);

      const taxSubtotals = Array.from(taxSubtotalsMap.values()).map(st => ({
        "cbc:TaxableAmount": fromCents(st.taxableCents),
        "cbc:TaxableAmount@currencyID": "EUR",
        "cbc:TaxAmount": fromCents(st.taxCents),
        "cbc:TaxAmount@currencyID": "EUR",
        "cac:TaxCategory": {
          "cbc:ID": st.categoryId,
          "cbc:Percent": st.percent.toString(),
          ...(st.reason ? { "cbc:TaxExemptionReason": st.reason } : {}),
          "cac:TaxScheme": { "cbc:ID": "VAT" }
        }
      }));

      const dateStr = invoiceMeta.issueDate || new Date().toISOString().split('T')[0];
      const dueDateStr = new Date(new Date(dateStr).getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const invoiceId = invoiceMeta.invoiceNumber || `INV-${Date.now()}`;
      
      type VatTaxScheme = { "cbc:CompanyID": string; "cac:TaxScheme": { "cbc:ID": string } };
      const supplierTaxScheme: VatTaxScheme[] = [];
      if (supplier.vat) supplierTaxScheme.push({ "cbc:CompanyID": supplier.vat, "cac:TaxScheme": { "cbc:ID": "VAT" } });

      const customerTaxScheme: VatTaxScheme | undefined = customer.vat ? { "cbc:CompanyID": customer.vat, "cac:TaxScheme": { "cbc:ID": "VAT" } } : undefined;

      invoiceData = {
        "ubl:Invoice": {
          "cbc:CustomizationID": "urn:cen.eu:en16931:2017",
          "cbc:ProfileID": "urn:fdc:peppol.eu:2017:poacc:billing:01:1.0",
          "cbc:ID": invoiceId,
          "cbc:IssueDate": dateStr,
          "cbc:DueDate": dueDateStr,
          "cbc:InvoiceTypeCode": "380",
          "cbc:DocumentCurrencyCode": "EUR",
          "cac:AccountingSupplierParty": {
            "cac:Party": {
              "cac:PartyName": { "cbc:Name": supplier.name },
              "cac:PostalAddress": {
                "cbc:StreetName": supplier.street || '-',
                "cbc:CityName": supplier.city || '-',
                "cbc:PostalZone": supplier.zip || '-',
                "cac:Country": { "cbc:IdentificationCode": supplier.country || 'DE' }
              },
              ...(supplierTaxScheme.length > 0 && { "cac:PartyTaxScheme": supplierTaxScheme }),
              "cac:PartyLegalEntity": { "cbc:RegistrationName": supplier.name }
            }
          },
          "cac:AccountingCustomerParty": {
            "cac:Party": {
              "cac:PartyName": { "cbc:Name": customer.name },
              "cac:PostalAddress": {
                "cbc:StreetName": customer.street || '-',
                "cbc:CityName": customer.city || '-',
                "cbc:PostalZone": customer.zip || '-',
                "cac:Country": { "cbc:IdentificationCode": customer.country || 'DE' }
              },
              ...(customerTaxScheme && { "cac:PartyTaxScheme": customerTaxScheme }),
              "cac:PartyLegalEntity": { "cbc:RegistrationName": customer.name }
            }
          },
          ...(supplier.iban && {
            "cac:PaymentMeans": [
              {
                "cbc:PaymentMeansCode": "30",
                "cbc:PaymentID": invoiceId,
                "cac:PayeeFinancialAccount": {
                  "cbc:ID": supplier.iban,
                  ...(supplier.bankName ? { "cbc:Name": supplier.bankName } : {}),
                  ...(supplier.bic ? { "cac:FinancialInstitutionBranch": { "cbc:ID": supplier.bic } } : {})
                }
              }
            ]
          }),
          "cac:TaxTotal": [
            { "cbc:TaxAmount": taxTotalAmount, "cbc:TaxAmount@currencyID": "EUR", "cac:TaxSubtotal": taxSubtotals }
          ],
          "cac:LegalMonetaryTotal": {
            "cbc:LineExtensionAmount": fromCents(totalTaxExclusiveCents),
            "cbc:LineExtensionAmount@currencyID": "EUR",
            "cbc:TaxExclusiveAmount": fromCents(totalTaxExclusiveCents),
            "cbc:TaxExclusiveAmount@currencyID": "EUR",
            "cbc:TaxInclusiveAmount": fromCents(totalTaxInclusiveCents),
            "cbc:TaxInclusiveAmount@currencyID": "EUR",
            "cbc:PayableAmount": fromCents(totalTaxInclusiveCents),
            "cbc:PayableAmount@currencyID": "EUR"
          },
          "cac:InvoiceLine": invoiceLines
        }
      };
    }

    // Enforce limits
    let grandTotal = 0;
    let totalWasResolved = false;
    if (invoiceData?.['ubl:Invoice']?.['cac:LegalMonetaryTotal']?.['cbc:TaxInclusiveAmount'] !== undefined) {
      grandTotal = parseFloat(invoiceData['ubl:Invoice']['cac:LegalMonetaryTotal']['cbc:TaxInclusiveAmount']);
      totalWasResolved = !isNaN(grandTotal);
    } else if (invoiceData?.legalMonetaryTotal?.taxInclusiveAmount !== undefined) {
      grandTotal = parseFloat(invoiceData.legalMonetaryTotal.taxInclusiveAmount);
      totalWasResolved = !isNaN(grandTotal);
    }

    // SECURITY: A caller submitting a raw `invoiceData` payload controls its
    // shape entirely. If we can't find/parse a total, silently defaulting to
    // 0 would let non-PRO callers bypass the plan's amount cap outright.
    if (!totalWasResolved && userTier !== 'PRO') {
      return NextResponse.json({ error: 'Unable to determine invoice total for plan limit check. Please include a valid LegalMonetaryTotal.' }, { status: 400 });
    }

    if (userTier === 'GUEST' && grandTotal > 100) {
      return NextResponse.json({ error: 'Unregistrierte Nutzer können nur Rechnungen bis maximal 100 € generieren. Bitte kostenlos registrieren.' }, { status: 403 });
    }
    if (userTier === 'FREE' && grandTotal > 500) {
      return NextResponse.json({ error: 'Kostenlose Konten können nur Rechnungen bis maximal 500 € generieren. Bitte auf Business upgraden.' }, { status: 403 });
    }

    // Pre-Validation of Data
    const isValid = validateInvoice(invoiceData);
    if (!isValid) {
      console.error('Validation errors:', validateInvoice.errors);
      return NextResponse.json({ 
        error: 'Data validation failed against EN16931 schema.',
        details: validateInvoice.errors 
      }, { status: 400 });
    }

    const invoiceService = new InvoiceService(console);

    if (outputFormat === 'xml') {
      // XRechnung is its own CIUS profile (CII syntax) with its own business
      // rules — distinct from Factur-X/ZUGFeRD. It's a pure-XML format, so
      // no `pdf`/`data` option is needed for it (unlike Factur-X, below).
      // `invoiceData` is loosely typed above and validated at runtime by
      // `validateInvoice` (just above) against the library's own JSON
      // schema — that's the real guarantee it matches `Invoice`, not this
      // cast.
      const renderedXml = await invoiceService.generate(invoiceData as unknown as Invoice, {
        format: 'XRechnung-CII',
        lang: 'de',
      }) as string;

      // Post-Validation sanity check
      if (!renderedXml.includes('<rsm:CrossIndustryInvoice')) {
        throw new Error('Generated XML is missing root invoice elements. Validation failed.');
      }

      // Increment usage
      if (user) {
        await prisma.user.update({
          where: { id: user.id },
          data: { invoicesCount: { increment: 1 } },
        });
      }

      return new NextResponse(renderedXml, {
        status: 200,
        headers: {
          'Content-Type': 'application/xml',
          'Content-Disposition': 'attachment; filename="xrechnung.xml"',
        },
      });
    }

    // ZUGFeRD/Factur-X: render the branded visual PDF first, then hand its
    // bytes to the library as the `pdf` option so it can wrap them into a
    // real PDF/A-3 Factur-X package (XMP metadata, /OutputIntent, embedded
    // factur-x.xml) — that packaging isn't something a generic PDF library
    // can produce by hand, so we defer to the library's own implementation.
    // Branding is a PRO perk — apply it only while the user is currently
    // PRO, so a downgraded (canceled subscription) user's stored logo/color
    // from their previous PRO period doesn't keep showing up on FREE
    // invoices.
    const brandedPdf = await generateInvoicePdf(invoiceData, {
      brandColor: userTier === 'PRO' ? user?.brandColor : undefined,
      logoBase64: userTier === 'PRO' ? (user?.logoBase64 || undefined) : undefined,
      isFreeTier: userTier !== 'PRO'
    });

    const facturXPdf = await invoiceService.generate(invoiceData as unknown as Invoice, {
      format: 'Factur-X-EN16931',
      lang: 'de',
      pdf: { buffer: brandedPdf, filename: 'invoice.pdf', mimetype: 'application/pdf' },
    }) as Uint8Array;

    // Post-Validation sanity check
    if (!facturXPdf || facturXPdf.byteLength < 100) {
      throw new Error('Generated Factur-X PDF looks invalid. Validation failed.');
    }

    // Increment usage
    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: { invoicesCount: { increment: 1 } },
      });
    }

    return new NextResponse(Buffer.from(facturXPdf), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="e-invoice-zugferd.pdf"',
      },
    });

  } catch (error) {
    console.error('Invoice generation error:', error);
    return NextResponse.json({ error: 'Error generating invoice. Please check your input data.' }, { status: 500 });
  }
}
