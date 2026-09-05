const fs = require('fs');

const de = JSON.parse(fs.readFileSync('messages/de.json', 'utf8'));
const en = JSON.parse(fs.readFileSync('messages/en.json', 'utf8'));
const fr = JSON.parse(fs.readFileSync('messages/fr.json', 'utf8'));

de.Footer = {
  impressum: "Impressum",
  privacy: "Datenschutz",
  avv: "AVV (Auftragsverarbeitung)"
};

en.Footer = {
  impressum: "Legal Notice",
  privacy: "Privacy Policy",
  avv: "DPA (Data Processing)"
};

fr.Footer = {
  impressum: "Mentions Légales",
  privacy: "Confidentialité",
  avv: "ATD (Traitement des données)"
};

fs.writeFileSync('messages/de.json', JSON.stringify(de, null, 2));
fs.writeFileSync('messages/en.json', JSON.stringify(en, null, 2));
fs.writeFileSync('messages/fr.json', JSON.stringify(fr, null, 2));
