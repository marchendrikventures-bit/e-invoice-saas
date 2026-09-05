import json

def update_impressum(lang, title, contact_title, email_label):
    with open(f'messages/{lang}.json', 'r') as f:
        data = json.load(f)
    
    body = f"""<h3>{title}</h3>
<p>
  <strong>Marc Szymkowiak</strong><br />
  Praceta Luanda 7<br />
  2ESQ<br />
  2780-018 OEIRAS<br />
  Portugal
</p>
<h3>{contact_title}</h3>
<p>
  {email_label}: marc.hendrik.ventures@gmail.com
</p>"""

    data['Legal']['impressum_body'] = body

    with open(f'messages/{lang}.json', 'w') as f:
        json.dump(data, f, indent=2)

update_impressum('de', 'Angaben gemäß § 5 TMG', 'Kontakt', 'E-Mail')
update_impressum('en', 'Information according to § 5 TMG', 'Contact', 'Email')
update_impressum('fr', 'Informations conformément au § 5 TMG', 'Contact', 'E-mail')

