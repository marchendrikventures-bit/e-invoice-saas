import re

def update_file(path, replacements, namespace):
    with open(path, 'r') as f:
        content = f.read()
    
    if 'useTranslations' not in content:
        content = content.replace("import { useState }", "import { useState } from 'react';\nimport { useTranslations }")
        if "from 'react';" in content and "import { useState } from 'react';\nimport { useTranslations } from 'next-intl';" not in content:
            content = content.replace("from 'react';", "from 'react';\nimport { useTranslations } from 'next-intl';")
            
        content = re.sub(r'export default function \w+\(\) {', lambda m: f"{m.group(0)}\n  const t = useTranslations('{namespace}');", content)
    
    for k, v in replacements.items():
        content = content.replace(k, v)
        
    with open(path, 'w') as f:
        f.write(content)

# LOGIN
login_replacements = {
    "Sign in to your account": "{t('login_title')}",
    "Email address": "{t('login_email')}",
    "Password": "{t('login_pass')}",
    "Forgot password?": "{t('login_forgot')}",
    "Sign in": "{t('login_btn')}",
    "Sign in with Google": "{t('login_google')}",
    "Don't have an account?": "{t('login_no_account')}",
    "Sign up": "{t('login_register')}"
}
update_file('src/app/[locale]/login/page.tsx', login_replacements, 'Auth')

# REGISTER
register_replacements = {
    "Create your account": "{t('reg_title')}",
    "Email address": "{t('login_email')}",
    "Password": "{t('login_pass')}",
    "Ich akzeptiere die": "{t('reg_agree')}",
    "Allgemeinen Geschäftsbedingungen (AGB)": "{t('reg_terms')}",
    "Ich habe die": "{t('reg_privacy_read')}",
    "Datenschutzerklärung": "{t('reg_privacy')}",
    "gelesen und stimme ihr zu.": "{t('reg_privacy_agree')}",
    "Ich schließe hiermit den": "{t('reg_avv_agree')}",
    "Auftragsverarbeitungsvertrag (AVV)": "{t('reg_avv')}",
    "gemäß Art. 28 DSGVO mit dem Anbieter.": "{t('reg_avv_end')}",
    "Sign up": "{t('reg_btn')}",
    "Sign in with Google": "{t('login_google')}",
    "Already have an account?": "{t('reg_has_account')}",
    "Sign in": "{t('login_btn')}",
    "Passwort muss mindestens 8 Zeichen lang sein.": "t('reg_error')",
    "Bitte akzeptieren Sie alle rechtlichen Vereinbarungen, bevor Sie sich mit Google anmelden.": "t('google_error')",
    "Sie müssen allen rechtlichen Vereinbarungen zustimmen, um sich zu registrieren.": "t('google_error')"
}
update_file('src/app/[locale]/register/page.tsx', register_replacements, 'Auth')

# FORGOT PASSWORD
forgot_replacements = {
    "Reset your password": "{t('forgot_title')}",
    "Enter your email address and we'll send you a link to reset your password.": "{t('forgot_desc')}",
    "Email address": "{t('login_email')}",
    "Send reset link": "{t('forgot_btn')}",
    "Email sent!": "{t('forgot_success')}",
    "Check your inbox for the reset link.": ""
}
update_file('src/app/[locale]/forgot-password/page.tsx', forgot_replacements, 'Auth')

