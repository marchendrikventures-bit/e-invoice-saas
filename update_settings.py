import re

def update_file(path, replacements, namespace):
    with open(path, 'r') as f:
        content = f.read()
    
    if 'useTranslations' not in content:
        content = content.replace("import { useState, useEffect } from 'react';", "import { useState, useEffect } from 'react';\nimport { useTranslations } from 'next-intl';")
        content = re.sub(r'export default function \w+\(\) {', lambda m: f"{m.group(0)}\n  const t = useTranslations('{namespace}');", content)
    
    for k, v in replacements.items():
        content = content.replace(k, v)
        
    with open(path, 'w') as f:
        f.write(content)

settings_replacements = {
    "Settings": "{t('title')}",
    "Company Information": "{t('company_info')}",
    "Company Name": "{t('company_name')}",
    "Street": "{t('street')}",
    "City": "{t('city')}",
    "ZIP": "{t('zip')}",
    "Country": "{t('country')}",
    "VAT ID": "{t('vat')}",
    "Bank Details": "{t('bank_details')}",
    "IBAN": "{t('iban')}",
    "BIC": "{t('bic')}",
    "Bank Name": "{t('bank_name')}",
    "Invoice Branding (PRO)": "{t('branding')}",
    "Only available on PRO plan": "{t('pro_only')}",
    "Brand Color (Hex)": "{t('brand_color')}",
    "Base64 Logo (Optional)": "{t('logo')}",
    "API Key (PRO)": "{t('api_key')}",
    "API keys allow you to integrate e-invoicing directly into your backend.": "{t('api_desc')}",
    "Your API Key:": "{t('api_key_label')}",
    "Generate API Key": "{t('api_btn')}",
    "Save Settings": "{t('save')}",
    "Saving...": "{t('saving')}",
    "Settings saved successfully!": "t('success')",
    "Failed to save settings": "t('error')"
}
update_file('src/app/[locale]/settings/page.tsx', settings_replacements, 'Settings')
