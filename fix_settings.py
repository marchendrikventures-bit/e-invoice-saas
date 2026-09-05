import re

with open('src/app/[locale]/settings/page.tsx', 'r') as f:
    content = f.read()

content = content.replace("import { useState, useEffect } from 'react';", "import { useState, useEffect } from 'react';\nimport { useTranslations } from 'next-intl';")
content = re.sub(r'export default function Settings\(\) {', "export default function Settings() {\n  const t = useTranslations('Settings');", content)

replacements = {
    ">Account Settings<": ">Account {t('title')}<",
    ">Your Details (Seller)<": ">{t('company_info')}<",
    'label="Company Name *"': 'label={`${t("company_name")} *`}',
    'label="Street"': 'label={t("street")}',
    'label="City"': 'label={t("city")}',
    'label="ZIP Code"': 'label={t("zip")}',
    'label="Country Code (e.g. DE)"': 'label={t("country")}',
    'label="VAT ID (Umsatzsteuer-ID)"': 'label={t("vat")}',
    ">Bank Details<": ">{t('bank_details')}<",
    'label="IBAN"': 'label={t("iban")}',
    'label="BIC"': 'label={t("bic")}',
    'label="Bank Name"': 'label={t("bank_name")}',
    ">Invoice Branding (PRO)<": ">{t('branding')}<",
    ">Only available on PRO plan<": ">{t('pro_only')}<",
    ">Brand Color<": ">{t('brand_color')}<",
    ">Logo (Image)<": ">{t('logo')}<",
    ">API Key (PRO)<": ">{t('api_key')}<",
    ">API keys allow you to integrate e-invoicing directly into your backend.<": ">{t('api_desc')}<",
    ">Your API Key:<": ">{t('api_key_label')}<",
    ">Generate API Key<": ">{t('api_btn')}<",
    ">Save Settings<": ">{t('save')}<",
    "Saving...": "{t('saving')}",
    "'Settings saved successfully!'": "t('success')",
    "'Failed to save settings.'": "t('error')"
}

for k, v in replacements.items():
    content = content.replace(k, v)

with open('src/app/[locale]/settings/page.tsx', 'w') as f:
    f.write(content)
