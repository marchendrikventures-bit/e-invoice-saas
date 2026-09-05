const fs = require('fs');

const de = JSON.parse(fs.readFileSync('messages/de.json', 'utf8'));
const en = JSON.parse(fs.readFileSync('messages/en.json', 'utf8'));
const fr = JSON.parse(fs.readFileSync('messages/fr.json', 'utf8'));

de.Settings = {
  title: "Einstellungen",
  company_info: "Unternehmensdaten",
  company_name: "Firmenname",
  street: "Straße",
  city: "Stadt",
  zip: "PLZ",
  country: "Land",
  vat: "USt-IdNr.",
  bank_details: "Bankverbindung",
  iban: "IBAN",
  bic: "BIC",
  bank_name: "Name der Bank",
  branding: "Rechnungs-Branding (PRO)",
  pro_only: "Nur im PRO-Tarif verfügbar",
  brand_color: "Markenfarbe (Hex)",
  logo: "Base64-Logo (Optional)",
  api_key: "API-Schlüssel (PRO)",
  api_desc: "API-Schlüssel ermöglichen die direkte Integration der E-Rechnung in Ihr Backend.",
  api_key_label: "Ihr API-Schlüssel:",
  api_btn: "API-Schlüssel generieren",
  save: "Einstellungen speichern",
  saving: "Speichern...",
  success: "Einstellungen erfolgreich gespeichert!",
  error: "Fehler beim Speichern der Einstellungen"
};

en.Settings = {
  title: "Settings",
  company_info: "Company Information",
  company_name: "Company Name",
  street: "Street",
  city: "City",
  zip: "ZIP",
  country: "Country",
  vat: "VAT ID",
  bank_details: "Bank Details",
  iban: "IBAN",
  bic: "BIC",
  bank_name: "Bank Name",
  branding: "Invoice Branding (PRO)",
  pro_only: "Only available on PRO plan",
  brand_color: "Brand Color (Hex)",
  logo: "Base64 Logo (Optional)",
  api_key: "API Key (PRO)",
  api_desc: "API keys allow you to integrate e-invoicing directly into your backend.",
  api_key_label: "Your API Key:",
  api_btn: "Generate API Key",
  save: "Save Settings",
  saving: "Saving...",
  success: "Settings saved successfully!",
  error: "Failed to save settings"
};

fr.Settings = {
  title: "Paramètres",
  company_info: "Informations sur l'entreprise",
  company_name: "Nom de l'entreprise",
  street: "Rue",
  city: "Ville",
  zip: "Code postal",
  country: "Pays",
  vat: "Numéro de TVA",
  bank_details: "Coordonnées bancaires",
  iban: "IBAN",
  bic: "BIC",
  bank_name: "Nom de la banque",
  branding: "Personnalisation des factures (PRO)",
  pro_only: "Uniquement disponible avec le plan PRO",
  brand_color: "Couleur de la marque (Hex)",
  logo: "Logo Base64 (Optionnel)",
  api_key: "Clé API (PRO)",
  api_desc: "Les clés API vous permettent d'intégrer la facturation électronique directement dans votre backend.",
  api_key_label: "Votre clé API :",
  api_btn: "Générer une clé API",
  save: "Enregistrer les paramètres",
  saving: "Enregistrement...",
  success: "Paramètres enregistrés avec succès !",
  error: "Échec de l'enregistrement des paramètres"
};

fs.writeFileSync('messages/de.json', JSON.stringify(de, null, 2));
fs.writeFileSync('messages/en.json', JSON.stringify(en, null, 2));
fs.writeFileSync('messages/fr.json', JSON.stringify(fr, null, 2));

