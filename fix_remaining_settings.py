import json

def update_dict(lang, changes):
    with open(f'messages/{lang}.json', 'r') as f:
        d = json.load(f)
    
    d['Settings'].update(changes)
    
    with open(f'messages/{lang}.json', 'w') as f:
        json.dump(d, f, indent=2)

update_dict('de', {
  "loading": "Lade...",
  "branding_pro": "Branding (Pro)",
  "api_pro": "Entwickler-API (Pro)"
})

update_dict('en', {
  "loading": "Loading...",
  "branding_pro": "Branding (Pro)",
  "api_pro": "Developer API (Pro)"
})

update_dict('fr', {
  "loading": "Chargement...",
  "branding_pro": "Personnalisation (Pro)",
  "api_pro": "API Développeur (Pro)"
})

with open('src/app/[locale]/settings/page.tsx', 'r') as f:
    content = f.read()

content = content.replace(">Loading...<", ">{t('loading')}<")
content = content.replace(">Branding (Pro)<", ">{t('branding_pro')}<")
content = content.replace(">Developer API (Pro)<", ">{t('api_pro')}<")

with open('src/app/[locale]/settings/page.tsx', 'w') as f:
    f.write(content)

