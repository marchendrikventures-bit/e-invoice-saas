import re

with open('src/app/[locale]/register/page.tsx', 'r') as f:
    content = f.read()

# Add imports
content = content.replace("import { useState } from 'react';", "import { useState } from 'react';\nimport { useTranslations } from 'next-intl';")
content = re.sub(r'export default function Register\(\) {', "export default function Register() {\n  const t = useTranslations('Auth');", content)

replacements = {
    ">Create your account<": ">{t('reg_title')}<",
    'label="Email address"': 'label={t("login_email")}',
    'label="Password"': 'label={t("login_pass")}',
    ">Ich akzeptiere die ": ">{t('reg_agree')} ",
    ">Allgemeinen Geschäftsbedingungen (AGB)<": ">{t('reg_terms')}<",
    ">Ich habe die ": ">{t('reg_privacy_read')} ",
    ">Datenschutzerklärung<": ">{t('reg_privacy')}<",
    "> gelesen und stimme ihr zu.<": "> {t('reg_privacy_agree')}<",
    ">Ich schließe hiermit den ": ">{t('reg_avv_agree')} ",
    ">Auftragsverarbeitungsvertrag (AVV)<": ">{t('reg_avv')}<",
    "> gemäß Art. 28 DSGVO mit dem Anbieter ab.<": "> {t('reg_avv_end')}<",
    ">Sign up<": ">{t('reg_btn')}<",
    ">Sign in with Google<": ">{t('login_google')}<",
    ">Already have an account? <": ">{t('reg_has_account')} <",
    ">Sign in<": ">{t('login_btn')}<",
    "'Passwort muss mindestens 8 Zeichen lang sein.'": "t('reg_error')",
    "'Bitte akzeptieren Sie alle rechtlichen Vereinbarungen, bevor Sie sich mit Google anmelden.'": "t('google_error')",
    "'Sie müssen allen rechtlichen Vereinbarungen zustimmen, um sich zu registrieren.'": "t('google_error')"
}

for k, v in replacements.items():
    content = content.replace(k, v)

with open('src/app/[locale]/register/page.tsx', 'w') as f:
    f.write(content)
