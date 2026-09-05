import re

def update_nav(path):
    with open(path, 'r') as f:
        content = f.read()
    
    if 'useTranslations' not in content:
        content = content.replace("import { useState } from 'react';", "import { useState } from 'react';\nimport { useTranslations } from 'next-intl';")
        content = re.sub(r'export default function \w+\(\) {', lambda m: f"{m.group(0)}\n  const t = useTranslations('Nav');", content)
    
    replacements = {
        ">Dashboard<": ">{t('dashboard')}<",
        ">Preise<": ">{t('pricing')}<",
        "Einstellungen": "{t('settings')}",
        "Abmelden": "{t('logout')}",
        "Anmelden": "{t('login')}",
        "Registrieren": "{t('register')}"
    }
    
    for k, v in replacements.items():
        content = content.replace(k, v)
        
    with open(path, 'w') as f:
        f.write(content)

def update_footer(path):
    with open(path, 'r') as f:
        content = f.read()
    
    if 'useTranslations' not in content:
        content = "import { useTranslations } from 'next-intl';\n" + content
        content = re.sub(r'export default function \w+\(\) {', lambda m: f"{m.group(0)}\n  const t = useTranslations('Footer');", content)
    
    replacements = {
        ">Impressum<": ">{t('impressum')}<",
        ">Datenschutzerklärung<": ">{t('privacy')}<",
        ">Auftragsverarbeitungsvertrag (AVV)<": ">{t('avv')}<"
    }
    
    for k, v in replacements.items():
        content = content.replace(k, v)
        
    with open(path, 'w') as f:
        f.write(content)

update_nav('src/components/Navbar.tsx')
update_footer('src/components/Footer.tsx')
