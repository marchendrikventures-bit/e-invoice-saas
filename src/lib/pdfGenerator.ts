import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

function hexToRgbStr(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255
  } : { r: 0.2, g: 0.2, b: 0.2 };
}

export async function generatePdfFromXml(xml: string, invoiceData: any, options?: { brandColor?: string, logoBase64?: string, isFreeTier?: boolean }): Promise<Buffer> {
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
  const invoiceId = inv['cbc:ID'] || 'UNKNOWN';
  const issueDate = inv['cbc:IssueDate'] || '';
  
  const supParty = inv['cac:AccountingSupplierParty']?.['cac:Party'] || {};
  const supplierName = supParty['cac:PartyName']?.['cbc:Name'] || 'Unbekannt';
  const supAddr = supParty['cac:PostalAddress'] || {};
  
  const custParty = inv['cac:AccountingCustomerParty']?.['cac:Party'] || {};
  const customerName = custParty['cac:PartyName']?.['cbc:Name'] || 'Unbekannt';
  const custAddr = custParty['cac:PostalAddress'] || {};

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
  
  lines.forEach((line: any, index: number) => {
    if (y < 100) {
      y = height - 50; 
    }
    const name = line['cac:Item']?.['cbc:Name'] || 'Artikel';
    const qty = line['cbc:InvoicedQuantity'] || '1';
    const price = line['cac:Price']?.['cbc:PriceAmount'] || '0.00';
    const rowTotal = line['cbc:LineExtensionAmount'] || '0.00';

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


  // Attach the XML file to create a Basic ZUGFeRD / Factur-X compatible file
  await pdfDoc.attach(Buffer.from(xml, 'utf-8'), 'factur-x.xml', {
    mimeType: 'application/xml',
    description: 'ZUGFeRD/Factur-X Invoice XML',
    creationDate: new Date(),
    modificationDate: new Date(),
  });

  // Save the PDF
  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
