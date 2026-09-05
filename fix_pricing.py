with open('src/app/[locale]/pricing/page.tsx', 'r') as f:
    content = f.read()

content = content.replace("=== '{t('pro')}'", "=== 'PRO'")
content = content.replace("t('current_plan')", "t('current')")
content = content.replace("t('button_pro')", "t('upgrade')")

with open('src/app/[locale]/pricing/page.tsx', 'w') as f:
    f.write(content)
