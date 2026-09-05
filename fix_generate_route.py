import re

with open('src/app/api/generate/route.ts', 'r') as f:
    content = f.read()

# Pass isFreeTier to generatePdfFromXml
content = content.replace(
    "const pdfBuffer = await generatePdfFromXml(xml, invoiceData, { brandColor, logoBase64 });",
    "const pdfBuffer = await generatePdfFromXml(xml, invoiceData, { brandColor, logoBase64, isFreeTier: user?.tier !== 'PRO' });"
)

with open('src/app/api/generate/route.ts', 'w') as f:
    f.write(content)
