const fs = require('fs');

const de = JSON.parse(fs.readFileSync('messages/de.json', 'utf8'));
const en = JSON.parse(fs.readFileSync('messages/en.json', 'utf8'));
const fr = JSON.parse(fs.readFileSync('messages/fr.json', 'utf8'));

de.Impressum = {
  title: "Impressum",
  info: "Angaben gemäß § 5 TMG",
  company: "E-Invoice SaaS Provider GmbH",
  represented_by: "Vertreten durch:",
  contact: "Kontakt:",
  register: "Registereintrag:",
  register_info: "Eintragung im Handelsregister. Registergericht: Amtsgericht Musterstadt. Registernummer: HRB 999999",
  vat: "Umsatzsteuer-ID:",
  vat_info: "Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz: DE 999 999 999",
  responsible: "Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:"
};

en.Impressum = {
  title: "Legal Notice (Impressum)",
  info: "Information according to § 5 TMG",
  company: "E-Invoice SaaS Provider GmbH",
  represented_by: "Represented by:",
  contact: "Contact:",
  register: "Register Entry:",
  register_info: "Entry in the Commercial Register. Register Court: Amtsgericht Musterstadt. Register Number: HRB 999999",
  vat: "VAT ID:",
  vat_info: "Value Added Tax Identification Number according to § 27 a Value Added Tax Act: DE 999 999 999",
  responsible: "Responsible for content according to § 55 Abs. 2 RStV:"
};

fr.Impressum = {
  title: "Mentions Légales",
  info: "Informations conformément au § 5 TMG",
  company: "E-Invoice SaaS Provider GmbH",
  represented_by: "Représenté par :",
  contact: "Contact :",
  register: "Inscription au registre :",
  register_info: "Inscription au registre du commerce. Tribunal d'enregistrement : Amtsgericht Musterstadt. Numéro de registre : HRB 999999",
  vat: "Numéro de TVA :",
  vat_info: "Numéro d'identification à la taxe sur la valeur ajoutée conformément au § 27 a de la loi sur la taxe sur la valeur ajoutée : DE 999 999 999",
  responsible: "Responsable du contenu selon le § 55 Abs. 2 RStV :"
};

fs.writeFileSync('messages/de.json', JSON.stringify(de, null, 2));
fs.writeFileSync('messages/en.json', JSON.stringify(en, null, 2));
fs.writeFileSync('messages/fr.json', JSON.stringify(fr, null, 2));
