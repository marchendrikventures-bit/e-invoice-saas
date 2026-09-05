import JSZip from 'jszip';
import { generatePdfFromXml } from '@/lib/pdfGenerator';
import { NextRequest, NextResponse } from 'next/server';
import { InvoiceService, invoiceSchema } from '@e-invoice-eu/core';
import { parse } from 'csv-parse/sync';
import * as xlsx from 'xlsx';
import Ajv from 'ajv/dist/2019';
import addFormats from 'ajv-formats';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const ajv = new Ajv({ strict: false, allErrors: true });
addFormats(ajv);
const validateInvoice = ajv.compile(invoiceSchema);

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

    // 2. Output Format (xml or pdf)
    const { searchParams } = new URL(req.url);
    const outputFormat = searchParams.get('output') === 'xml' ? 'xml' : 'pdf';

    const contentType = req.headers.get('content-type') || '';
    
    let customer = { name: '', street: '', city: '', zip: '', country: 'DE', vat: '' };
    let invoiceMeta = { invoiceNumber: '', issueDate: '' };
    let supplier = { name: '', street: '', city: '', zip: '', country: 'DE', vat: '', iban: '', bic: '', bankName: '' };
    let records: any[] = [];
    let invoiceData: any = null;

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
        } catch (err) {
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

      // Compute calculations rigorously
      let totalTaxExclusive = 0;
      let totalTaxInclusive = 0;
      let lineCounter = 1;
      
      const invoiceLines = records.map((record) => {
        const quantity = parseFloat(record.Quantity || record.Qty || '1');
        const price = parseFloat(record.Price || record.UnitPrice || '0');
        const taxPercent = parseFloat(record.TaxPercent || record.TaxRate || record.VAT || '19');
        
        const lineExtensionAmount = parseFloat((quantity * price).toFixed(2));
        const taxAmount = parseFloat((lineExtensionAmount * (taxPercent / 100)).toFixed(2));
        
        totalTaxExclusive += lineExtensionAmount;
        totalTaxInclusive += (lineExtensionAmount + taxAmount);
        
        const taxCategoryId = taxPercent === 0 ? 'Z' : 'S';

        return {
          "cbc:ID": (lineCounter++).toString(),
          "cbc:InvoicedQuantity": quantity.toString(),
          "cbc:InvoicedQuantity@unitCode": "C62",
          "cbc:LineExtensionAmount": lineExtensionAmount.toFixed(2),
          "cbc:LineExtensionAmount@currencyID": "EUR",
          "cac:Item": {
            "cbc:Name": record.ItemName || record.Name || record.Description || 'Item',
            "cac:ClassifiedTaxCategory": {
              "cbc:ID": taxCategoryId,
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

      const taxTotalAmount = (totalTaxInclusive - totalTaxExclusive).toFixed(2);
      
      const taxSubtotalsMap = new Map<string, any>();
      records.forEach(record => {
        const quantity = parseFloat(record.Quantity || record.Qty || '1');
        const price = parseFloat(record.Price || record.UnitPrice || '0');
        const taxPercent = parseFloat(record.TaxPercent || record.TaxRate || record.VAT || '19');
        
        const lineExtensionAmount = parseFloat((quantity * price).toFixed(2));
        const taxAmount = parseFloat((lineExtensionAmount * (taxPercent / 100)).toFixed(2));
        const taxCategoryId = taxPercent === 0 ? 'Z' : 'S';
        const key = `${taxCategoryId}_${taxPercent}`;
        
        if (!taxSubtotalsMap.has(key)) {
          taxSubtotalsMap.set(key, { taxableAmount: 0, taxAmount: 0, categoryId: taxCategoryId, percent: taxPercent });
        }
        const st = taxSubtotalsMap.get(key);
        st.taxableAmount += lineExtensionAmount;
        st.taxAmount += taxAmount;
      });

      const taxSubtotals = Array.from(taxSubtotalsMap.values()).map(st => ({
        "cbc:TaxableAmount": st.taxableAmount.toFixed(2),
        "cbc:TaxableAmount@currencyID": "EUR",
        "cbc:TaxAmount": st.taxAmount.toFixed(2),
        "cbc:TaxAmount@currencyID": "EUR",
        "cac:TaxCategory": {
          "cbc:ID": st.categoryId,
          "cbc:Percent": st.percent.toString(),
          "cac:TaxScheme": { "cbc:ID": "VAT" }
        }
      }));

      const dateStr = invoiceMeta.issueDate || new Date().toISOString().split('T')[0];
      const dueDateStr = new Date(new Date(dateStr).getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const invoiceId = invoiceMeta.invoiceNumber || `INV-${Date.now()}`;
      
      const supplierTaxScheme: any[] = [];
      if (supplier.vat) supplierTaxScheme.push({ "cbc:CompanyID": supplier.vat, "cac:TaxScheme": { "cbc:ID": "VAT" } });

      const customerTaxScheme: any = customer.vat ? { "cbc:CompanyID": customer.vat, "cac:TaxScheme": { "cbc:ID": "VAT" } } : undefined;

      invoiceData = {
        "ubl:Invoice": {
          "cbc:CustomizationID": "urn:cen.eu:en16931:2017",
          "cbc:ProfileID": "urn:fdc:peppol.eu:2017:poacc:billing:01:1.0",
          "cbc:ID": invoiceId,
          "cbc:IssueDate": dateStr,
          "cbc:DueDate": dueDateStr,
          "cbc:InvoiceTypeCode": "380",
          "cbc:DocumentCurrencyCode": "EUR",
          "cbc:BuyerReference": customer.name.substring(0, 10).toUpperCase(),
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
          "cac:PaymentMeans": [
            { 
              "cbc:PaymentMeansCode": "30", 
              "cbc:PaymentID": invoiceId, 
              "cac:PayeeFinancialAccount": { 
                "cbc:ID": supplier.iban || "DE00000000000000000000",
                ...(supplier.bankName ? { "cbc:Name": supplier.bankName } : {}),
                ...(supplier.bic ? { "cac:FinancialInstitutionBranch": { "cbc:ID": supplier.bic } } : {})
              } 
            }
          ],
          "cac:TaxTotal": [
            { "cbc:TaxAmount": taxTotalAmount, "cbc:TaxAmount@currencyID": "EUR", "cac:TaxSubtotal": taxSubtotals }
          ],
          "cac:LegalMonetaryTotal": {
            "cbc:LineExtensionAmount": totalTaxExclusive.toFixed(2),
            "cbc:LineExtensionAmount@currencyID": "EUR",
            "cbc:TaxExclusiveAmount": totalTaxExclusive.toFixed(2),
            "cbc:TaxExclusiveAmount@currencyID": "EUR",
            "cbc:TaxInclusiveAmount": totalTaxInclusive.toFixed(2),
            "cbc:TaxInclusiveAmount@currencyID": "EUR",
            "cbc:PayableAmount": totalTaxInclusive.toFixed(2),
            "cbc:PayableAmount@currencyID": "EUR"
          },
          "cac:InvoiceLine": invoiceLines
        }
      };
    }

    // Enforce limits
    let grandTotal = 0;
    if (invoiceData?.['ubl:Invoice']?.['cac:LegalMonetaryTotal']) {
      grandTotal = parseFloat(invoiceData['ubl:Invoice']['cac:LegalMonetaryTotal']['cbc:TaxInclusiveAmount'] || "0");
    } else if (invoiceData?.legalMonetaryTotal?.taxInclusiveAmount) {
      grandTotal = parseFloat(invoiceData.legalMonetaryTotal.taxInclusiveAmount || "0");
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

    // Generate XML
    const invoiceService = new InvoiceService(console);
    const renderedInvoice = await invoiceService.generate(invoiceData, { format: 'Factur-X-EN16931', embedPDF: false, lang: 'de' }) as string;
    
    // Post-Validation sanity check
    if (!renderedInvoice.includes('<rsm:CrossIndustryInvoice') && !renderedInvoice.includes('<Invoice')) {
      throw new Error('Generated XML is missing root invoice elements. Validation failed.');
    }
    if (!renderedInvoice.includes('<cbc:ID>')) {
      throw new Error('Generated XML is missing mandatory Invoice ID. Validation failed.');
    }

    // Increment usage
    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: { invoicesCount: { increment: 1 } },
      });
    }

    // Output raw XML if requested
    if (outputFormat === 'xml') {
      return new NextResponse(renderedInvoice, {
        status: 200,
        headers: {
          'Content-Type': 'application/xml',
          'Content-Disposition': 'attachment; filename="xrechnung.xml"',
        },
      });
    }

    // Generate PDF via our microservice architecture pattern
    const pdfBuffer = await generatePdfFromXml(renderedInvoice, invoiceData, {
      brandColor: user?.brandColor,
      logoBase64: user?.logoBase64 || undefined
    });

    return new NextResponse(pdfBuffer as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="e-invoice-zugferd.pdf"',
      },
    });

  } catch (error: any) {
    console.error('Invoice generation error:', error);
    return NextResponse.json({ error: 'Error generating invoice. Please check your input data.' }, { status: 500 });
  }
}
