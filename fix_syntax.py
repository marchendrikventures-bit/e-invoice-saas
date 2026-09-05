import re

def fix(path):
    with open(path, 'r') as f:
        content = f.read()
    
    # Fix dashboard
    content = content.replace("'{t('download_xml')}'", "t('download_xml')")
    content = content.replace("'{t('download_pdf')}'", "t('download_pdf')")
    content = content.replace("'{t('creating')}'", "t('creating')")
    
    # Fix pricing
    content = content.replace("'{t('upgrade')}'", "t('upgrade')")
    content = content.replace("'{t('get_started')}'", "t('get_started')")
    content = content.replace("'{t('current')}'", "t('current')")
    content = content.replace(">{t('current')}<", ">{t('current')}<")

    # Fix settings
    content = content.replace("'{t('saving')}'", "t('saving')")
    content = content.replace("'{t('save')}'", "t('save')")
    
    # Fix register
    content = content.replace("'{t('login_btn')}'", "t('login_btn')")

    with open(path, 'w') as f:
        f.write(content)

fix('src/app/[locale]/dashboard/page.tsx')
fix('src/app/[locale]/pricing/page.tsx')
fix('src/app/[locale]/settings/page.tsx')
fix('src/app/[locale]/register/page.tsx')
