import re

# pdfGenerator.ts
with open('src/lib/pdfGenerator.ts', 'r') as f:
    content = f.read()
content = content.replace("Generated for free by E-Invoice SaaS", "Generated for free by eu-invoice.app")
with open('src/lib/pdfGenerator.ts', 'w') as f:
    f.write(content)

# Navbar.tsx
with open('src/components/Navbar.tsx', 'r') as f:
    content = f.read()
content = content.replace("E-Invoice EU", "eu-invoice.app")
with open('src/components/Navbar.tsx', 'w') as f:
    f.write(content)

# layout.tsx
with open('src/app/[locale]/layout.tsx', 'r') as f:
    content = f.read()
content = content.replace("European E-Invoice Generator", "eu-invoice.app")
with open('src/app/[locale]/layout.tsx', 'w') as f:
    f.write(content)

# email.ts
with open('src/lib/email.ts', 'r') as f:
    content = f.read()
content = content.replace("support@e-invoice-saas.com", "support@eu-invoice.app")
with open('src/lib/email.ts', 'w') as f:
    f.write(content)

# billing upgrade
with open('src/app/api/billing/upgrade/route.ts', 'r') as f:
    content = f.read()
content = content.replace("E-Invoice PRO Subscription", "eu-invoice.app PRO Subscription")
with open('src/app/api/billing/upgrade/route.ts', 'w') as f:
    f.write(content)
