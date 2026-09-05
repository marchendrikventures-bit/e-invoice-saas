import re

with open('src/lib/pdfGenerator.ts', 'r') as f:
    content = f.read()

content = content.replace(
    "export async function generatePdfFromXml(xml: string, invoiceData: any, options?: { brandColor?: string, logoBase64?: string }): Promise<Buffer> {",
    "export async function generatePdfFromXml(xml: string, invoiceData: any, options?: { brandColor?: string, logoBase64?: string, isFreeTier?: boolean }): Promise<Buffer> {"
)

watermark_code = """
  // Totals
  page.drawText(`Gesamtbetrag (inkl. MwSt):`, { x: 300, y, size: 12, font: boldFont, color: mainColor });
  page.drawText(`${totalAmount} EUR`, { x: 490, y, size: 12, font: boldFont, color: mainColor });

  if (options?.isFreeTier) {
    page.drawText('Generated for free by E-Invoice SaaS. Upgrade to PRO to remove this watermark.', {
      x: 50,
      y: 30,
      size: 8,
      font: font,
      color: rgb(0.5, 0.5, 0.5),
    });
  }
"""

content = content.replace(
    "  // Totals\n  page.drawText(`Gesamtbetrag (inkl. MwSt):`, { x: 300, y, size: 12, font: boldFont, color: mainColor });\n  page.drawText(`${totalAmount} EUR`, { x: 490, y, size: 12, font: boldFont, color: mainColor });",
    watermark_code
)

with open('src/lib/pdfGenerator.ts', 'w') as f:
    f.write(content)

