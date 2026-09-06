import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

// The standard Helvetica font only supports WinAnsi (Latin-1-ish) encoding.
// Any character outside that range (Cyrillic, CJK, emoji, etc. — all
// plausible in customer/item names for an EU-wide tool) makes pdf-lib throw
// and crashes the whole request. Replace unsupported characters instead.
function toWinAnsiSafe(text: string): string {
  return Array.from(text).map(ch => (ch.codePointAt(0)! <= 0xff ? ch : '?')).join('');
}

function hexToRgbStr(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255
  } : { r: 0.2, g: 0.2, b: 0.2 };
}

// Renders the visual invoice page only. This is *not* itself a valid
// Factur-X/ZUGFeRD file — it's handed to @e-invoice-eu/core's InvoiceService
// as the `pdf` option, which wraps it into a proper PDF/A-3 package with the
// correct XMP metadata, /OutputIntent, and embedded factur-x.xml. Producing
// that packaging by hand with a generic PDF library isn't realistic; the
// library already implements it correctly, so we let it do that part.
// `invoiceData` is deeply, dynamically traversed below (chained optional
// bracket access into nested, possibly-absent objects) — the same object
// route.ts already validated against invoiceSchema at runtime. Modeling
// that traversal in the type system would mean inventing a fake-precise
// type that doesn't actually catch anything; `any` is the honest choice
// here, not an oversight.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function generateInvoicePdf(invoiceData: any, options?: { brandColor?: string, logoBase64?: string, isFreeTier?: boolean }): Promise<Buffer> {
  // Create a new PDFDocument
  const pdfDoc = await PDFDocument.create();

  // Add a blank A4 page
  const page = pdfDoc.addPage([595.28, 841.89]);
  const { height, width } = page.getSize();

  // Embed standard fonts
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Helper to extract data safely
  const inv = invoiceData['ubl:Invoice'] || invoiceData;
  const invoiceId = toWinAnsiSafe(String(inv['cbc:ID'] || 'UNKNOWN'));
  const issueDate = toWinAnsiSafe(String(inv['cbc:IssueDate'] || ''));

  const supParty = inv['cac:AccountingSupplierParty']?.['cac:Party'] || {};
  const supplierName = toWinAnsiSafe(String(supParty['cac:PartyName']?.['cbc:Name'] || 'Unbekannt'));
  const supAddrRaw = supParty['cac:PostalAddress'] || {};
  const supAddr = {
    'cbc:StreetName': toWinAnsiSafe(String(supAddrRaw['cbc:StreetName'] || '')),
    'cbc:PostalZone': toWinAnsiSafe(String(supAddrRaw['cbc:PostalZone'] || '')),
    'cbc:CityName': toWinAnsiSafe(String(supAddrRaw['cbc:CityName'] || '')),
  };

  const custParty = inv['cac:AccountingCustomerParty']?.['cac:Party'] || {};
  const customerName = toWinAnsiSafe(String(custParty['cac:PartyName']?.['cbc:Name'] || 'Unbekannt'));
  const custAddrRaw = custParty['cac:PostalAddress'] || {};
  const custAddr = {
    'cbc:StreetName': toWinAnsiSafe(String(custAddrRaw['cbc:StreetName'] || '')),
    'cbc:PostalZone': toWinAnsiSafe(String(custAddrRaw['cbc:PostalZone'] || '')),
    'cbc:CityName': toWinAnsiSafe(String(custAddrRaw['cbc:CityName'] || '')),
  };

  const totals = inv['cac:LegalMonetaryTotal'] || {};
  const totalAmount = totals['cbc:TaxInclusiveAmount'] || '0.00';

  // Branding Color
  const brandRgb = hexToRgbStr(options?.brandColor || '#333333');
  const mainColor = rgb(brandRgb.r, brandRgb.g, brandRgb.b);

  // --- Draw Content ---
  let y = height - 50;

  // Header
  page.drawText('RECHNUNG', { x: 50, y, size: 24, font: boldFont, color: mainColor });
  
  // Logo
  if (options?.logoBase64) {
    try {
      const isJpeg = options.logoBase64.includes('image/jpeg') || options.logoBase64.includes('image/jpg');
      const base64Data = options.logoBase64.split(',')[1] || options.logoBase64;
      const imageBytes = Buffer.from(base64Data, 'base64');
      
      const image = isJpeg ? await pdfDoc.embedJpg(imageBytes) : await pdfDoc.embedPng(imageBytes);
      const scaled = image.scaleToFit(150, 50);
      page.drawImage(image, {
        x: width - 50 - scaled.width,
        y: height - 50 - scaled.height,
        width: scaled.width,
        height: scaled.height,
      });
    } catch (e) {
      console.error('Failed to embed logo', e);
    }
  }

  y -= 40;

  // Invoice Meta
  page.drawText(`Rechnungsnummer: ${invoiceId}`, { x: 50, y, size: 10, font });
  page.drawText(`Datum: ${issueDate}`, { x: 50, y: y - 15, size: 10, font });
  
  y -= 50;

  // Addresses
  page.drawText('Absender:', { x: 50, y, size: 10, font: boldFont, color: mainColor });
  page.drawText(supplierName, { x: 50, y: y - 15, size: 10, font });
  page.drawText(`${supAddr['cbc:StreetName'] || ''}`, { x: 50, y: y - 30, size: 10, font });
  page.drawText(`${supAddr['cbc:PostalZone'] || ''} ${supAddr['cbc:CityName'] || ''}`, { x: 50, y: y - 45, size: 10, font });

  page.drawText('Empfänger:', { x: 300, y, size: 10, font: boldFont, color: mainColor });
  page.drawText(customerName, { x: 300, y: y - 15, size: 10, font });
  page.drawText(`${custAddr['cbc:StreetName'] || ''}`, { x: 300, y: y - 30, size: 10, font });
  page.drawText(`${custAddr['cbc:PostalZone'] || ''} ${custAddr['cbc:CityName'] || ''}`, { x: 300, y: y - 45, size: 10, font });

  y -= 100;

  // Line Items Table Header
  page.drawText('Pos', { x: 50, y, size: 10, font: boldFont, color: mainColor });
  page.drawText('Bezeichnung', { x: 100, y, size: 10, font: boldFont, color: mainColor });
  page.drawText('Menge', { x: 350, y, size: 10, font: boldFont, color: mainColor });
  page.drawText('Preis', { x: 420, y, size: 10, font: boldFont, color: mainColor });
  page.drawText('Gesamt', { x: 490, y, size: 10, font: boldFont, color: mainColor });

  // Draw line
  page.drawLine({
    start: { x: 50, y: y - 5 },
    end: { x: 545, y: y - 5 },
    thickness: 1,
    color: mainColor,
  });

  y -= 25;

  // Line Items
  const lines = Array.isArray(inv['cac:InvoiceLine']) ? inv['cac:InvoiceLine'] : [inv['cac:InvoiceLine']].filter(Boolean);
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- same rationale as `invoiceData` above
  lines.forEach((line: any, index: number) => {
    if (y < 100) {
      y = height - 50; 
    }
    const name = toWinAnsiSafe(String(line['cac:Item']?.['cbc:Name'] || 'Artikel'));
    const qty = toWinAnsiSafe(String(line['cbc:InvoicedQuantity'] || '1'));
    const price = toWinAnsiSafe(String(line['cac:Price']?.['cbc:PriceAmount'] || '0.00'));
    const rowTotal = toWinAnsiSafe(String(line['cbc:LineExtensionAmount'] || '0.00'));

    page.drawText(`${index + 1}`, { x: 50, y, size: 10, font });
    page.drawText(name.substring(0, 40), { x: 100, y, size: 10, font });
    page.drawText(qty, { x: 350, y, size: 10, font });
    page.drawText(`${price} EUR`, { x: 420, y, size: 10, font });
    page.drawText(`${rowTotal} EUR`, { x: 490, y, size: 10, font });
    y -= 20;
  });

  y -= 20;

  // Draw line
  page.drawLine({
    start: { x: 300, y: y + 10 },
    end: { x: 545, y: y + 10 },
    thickness: 1,
    color: mainColor,
  });


  // Totals
  page.drawText(`Gesamtbetrag (inkl. MwSt):`, { x: 300, y, size: 12, font: boldFont, color: mainColor });
  page.drawText(`${totalAmount} EUR`, { x: 490, y, size: 12, font: boldFont, color: mainColor });

  if (options?.isFreeTier) {
    page.drawText('Generated for free by eu-invoice.app. Upgrade to PRO to remove this watermark.', {
      x: 50,
      y: 30,
      size: 8,
      font: font,
      color: rgb(0.5, 0.5, 0.5),
    });
  }


  // Save the PDF
  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
