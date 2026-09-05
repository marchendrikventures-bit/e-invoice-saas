with open('src/app/[locale]/reset-password/page.tsx', 'r') as f:
    content = f.read()

content = content.replace("import { useState, Suspense } from 'react';", "import { useState, Suspense } from 'react';\nimport { useTranslations } from 'next-intl';")
content = content.replace("function ResetPasswordForm() {", "function ResetPasswordForm() {\n  const t = useTranslations('Auth');")

replacements = {
    ">Set new password<": ">{t('reset_title')}<",
    ">New Password<": ">{t('reset_pass')}<",
    "'Save New Password'": "t('reset_btn')",
    ">Invalid or missing reset token.<": ">{t('reset_invalid')}<"
}

for k, v in replacements.items():
    content = content.replace(k, v)

with open('src/app/[locale]/reset-password/page.tsx', 'w') as f:
    f.write(content)
