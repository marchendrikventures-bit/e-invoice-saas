import re

with open('src/app/[locale]/login/page.tsx', 'r') as f:
    content = f.read()

content = content.replace("import { useState } from 'react';", "import { useState } from 'react';\nimport { useTranslations } from 'next-intl';")
content = re.sub(r'export default function Login\(\) {', "export default function Login() {\n  const t = useTranslations('Auth');", content)

replacements = {
    ">Sign in to your account<": ">{t('login_title')}<",
    'label="Email address"': 'label={t("login_email")}',
    'label="Password"': 'label={t("login_pass")}',
    ">Forgot password?<": ">{t('login_forgot')}<",
    ">Sign in<": ">{t('login_btn')}<",
    ">Sign in with Google<": ">{t('login_google')}<",
    ">Don't have an account? <": ">{t('login_no_account')} <",
    ">Sign up<": ">{t('login_register')}<"
}

for k, v in replacements.items():
    content = content.replace(k, v)

with open('src/app/[locale]/login/page.tsx', 'w') as f:
    f.write(content)

with open('src/app/[locale]/forgot-password/page.tsx', 'r') as f:
    content = f.read()

content = content.replace("import { useState } from 'react';", "import { useState } from 'react';\nimport { useTranslations } from 'next-intl';")
content = re.sub(r'export default function ForgotPassword\(\) {', "export default function ForgotPassword() {\n  const t = useTranslations('Auth');", content)

replacements = {
    ">Reset your password<": ">{t('forgot_title')}<",
    ">Enter your email address and we'll send you a link to reset your password.<": ">{t('forgot_desc')}<",
    'label="Email address"': 'label={t("login_email")}',
    ">Send reset link<": ">{t('forgot_btn')}<",
    ">Email sent!<": ">{t('forgot_success')}<",
    ">Check your inbox for the reset link.<": ">{''}<"
}

for k, v in replacements.items():
    content = content.replace(k, v)

with open('src/app/[locale]/forgot-password/page.tsx', 'w') as f:
    f.write(content)

