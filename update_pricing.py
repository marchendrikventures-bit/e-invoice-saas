import re

with open('src/app/[locale]/pricing/page.tsx', 'r') as f:
    content = f.read()

# Make sure useTranslations is imported and used
if 'useTranslations' not in content:
    content = content.replace("import { useState } from 'react';", "import { useState } from 'react';\nimport { useTranslations } from 'next-intl';")
    content = content.replace("export default function Pricing() {", "export default function Pricing() {\n  const t = useTranslations('Pricing');")

replacements = {
    "Einfache und transparente Preise": "{t('title')}",
    "Wählen Sie den passenden Tarif für Ihr Unternehmen.": "{t('subtitle')}",
    "Kostenlos": "{t('free')}",
    "Für Einzelunternehmer und kleine Projekte": "{t('free_desc')}",
    "0 €": "{t('free_price')}",
    "PRO": "{t('pro')}",
    "Für wachsende Unternehmen mit API-Bedarf": "{t('pro_desc')}",
    "12,95 €": "{t('pro_price')}",
    "/ Monat": "{t('month')}",
    "Jetzt starten": "{t('get_started')}",
    "Auf PRO upgraden": "{t('upgrade')}",
    "Aktueller Tarif": "{t('current')}",
    "Max 500€ pro Rechnung": "{t('feat1')}",
    "Unbegrenzte Rechnungen": "{t('feat2')}",
    "Standard ZUGFeRD PDF": "{t('feat3')}",
    "Basic E-Mail Support": "{t('feat4')}",
    "Kein Limit pro Rechnung": "{t('feat5')}",
    "API-Zugang & Custom Branding": "{t('feat6')}",
    "Priority Support": "{t('feat7')}"
}

for k, v in replacements.items():
    content = content.replace(k, v)

with open('src/app/[locale]/pricing/page.tsx', 'w') as f:
    f.write(content)
