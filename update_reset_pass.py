import json

def update_dict(lang, changes):
    with open(f'messages/{lang}.json', 'r') as f:
        d = json.load(f)
    
    d['Auth'].update(changes)
    
    with open(f'messages/{lang}.json', 'w') as f:
        json.dump(d, f, indent=2)

update_dict('de', {
  "reset_title": "Neues Passwort setzen",
  "reset_pass": "Neues Passwort",
  "reset_btn": "Neues Passwort speichern",
  "reset_invalid": "Ungültiger oder fehlender Token."
})

update_dict('en', {
  "reset_title": "Set new password",
  "reset_pass": "New Password",
  "reset_btn": "Save New Password",
  "reset_invalid": "Invalid or missing reset token."
})

update_dict('fr', {
  "reset_title": "Définir un nouveau mot de passe",
  "reset_pass": "Nouveau mot de passe",
  "reset_btn": "Enregistrer le nouveau mot de passe",
  "reset_invalid": "Jeton de réinitialisation invalide ou manquant."
})
