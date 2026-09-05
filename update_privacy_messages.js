const fs = require('fs');

const de = JSON.parse(fs.readFileSync('messages/de.json', 'utf8'));
const en = JSON.parse(fs.readFileSync('messages/en.json', 'utf8'));
const fr = JSON.parse(fs.readFileSync('messages/fr.json', 'utf8'));

const getPrivacyKeys = (lang) => {
  if (lang === 'de') return {
    title: "Datenschutzerklärung (Privacy Policy)",
    intro: "Willkommen bei unserer Datenschutzerklärung. Ihre Privatsphäre ist uns sehr wichtig.",
    h1: "1. Datenverarbeitung auf einen Blick",
    p1: "Wir verarbeiten personenbezogene Daten nur, wenn dies zwingend erforderlich ist. Die Hauptfunktion dieses Dienstes (Konvertierung von CSV/Excel in E-Rechnungen) erfolgt vollständig im Arbeitsspeicher (RAM).",
    h2: "2. Keine Datenspeicherung (No Data Retention)",
    p2: "Dateien, die auf unsere Server hochgeladen werden, werden sofort verarbeitet und nur im RAM gehalten. Sie werden niemals auf persistenten Speichern (Festplatten) gespeichert und nach Abschluss der Anfrage vollständig verworfen. Wir führen keine Protokolle über die generierten Rechnungen oder Ihre Kundendaten.",
    h3: "3. Cookies",
    p3: "Wir verwenden einen zwingend notwendigen Local-Storage-Eintrag, um Ihre Cookie-Einwilligungspräferenzen zu speichern. Wir verwenden keine Drittanbieter-Analyse-, Marketing- oder Tracking-Cookies.",
    h4: "4. Ihre Rechte",
    p4: "Gemäß DSGVO haben Sie das Recht auf Auskunft, Berichtigung oder Löschung Ihrer personenbezogenen Daten. Da wir jedoch keine Ihrer Rechnungsdaten speichern, gibt es auf unseren Servern nach Beendigung Ihrer Sitzung keine Daten zum Auskunften, Berichtigen oder Löschen.",
    h5: "5. Kontakt",
    p5: "Für Datenschutzanfragen kontaktieren Sie uns bitte unter privacy@einvoice-saas.example.com."
  };
  if (lang === 'en') return {
    title: "Privacy Policy (Datenschutzerklärung)",
    intro: "Welcome to our Privacy Policy. Your privacy is critically important to us.",
    h1: "1. Data Processing at a Glance",
    p1: "We process personal data only when strictly necessary. The primary function of this service (converting CSV/Excel files to E-Invoices) happens entirely in memory.",
    h2: "2. No Data Retention",
    p2: "Files uploaded to our servers are processed immediately and held only in RAM. They are never stored on any persistent storage (disk) and are completely discarded after the request completes. We do not keep logs of the generated invoices or your client data.",
    h3: "3. Cookies",
    p3: "We use a strictly necessary local storage entry to remember your cookie consent preferences. We do not use any third-party analytics, marketing, or tracking cookies.",
    h4: "4. Your Rights",
    p4: "Under the GDPR, you have the right to access, rectify, or erase your personal data. However, since we do not store any of your invoice data, there is no data to access, rectify, or erase on our servers after your session ends.",
    h5: "5. Contact",
    p5: "For privacy inquiries, please contact us at privacy@einvoice-saas.example.com."
  };
  return {
    title: "Politique de Confidentialité (Datenschutzerklärung)",
    intro: "Bienvenue dans notre Politique de Confidentialité. Votre vie privée est essentielle pour nous.",
    h1: "1. Le Traitement des Données en un Coup d'Œil",
    p1: "Nous traitons les données personnelles uniquement lorsque cela est strictement nécessaire. La fonction principale de ce service (conversion de fichiers CSV/Excel en Factures Électroniques) se déroule entièrement en mémoire (RAM).",
    h2: "2. Aucune Conservation de Données",
    p2: "Les fichiers téléchargés sur nos serveurs sont traités immédiatement et conservés uniquement dans la RAM. Ils ne sont jamais stockés sur un support persistant (disque) et sont complètement supprimés une fois la demande terminée. Nous ne conservons aucun journal des factures générées ou des données de vos clients.",
    h3: "3. Cookies",
    p3: "Nous utilisons une entrée de stockage local strictement nécessaire pour mémoriser vos préférences de consentement aux cookies. Nous n'utilisons aucun cookie d'analyse tiers, de marketing ou de suivi.",
    h4: "4. Vos Droits",
    p4: "Conformément au RGPD, vous avez le droit d'accéder, de rectifier ou de supprimer vos données personnelles. Cependant, comme nous ne stockons aucune donnée de facturation, il n'y a aucune donnée à consulter, rectifier ou supprimer sur nos serveurs après la fin de votre session.",
    h5: "5. Contact",
    p5: "Pour toute question relative à la confidentialité, veuillez nous contacter à privacy@einvoice-saas.example.com."
  };
};

de.Privacy = getPrivacyKeys('de');
en.Privacy = getPrivacyKeys('en');
fr.Privacy = getPrivacyKeys('fr');

fs.writeFileSync('messages/de.json', JSON.stringify(de, null, 2));
fs.writeFileSync('messages/en.json', JSON.stringify(en, null, 2));
fs.writeFileSync('messages/fr.json', JSON.stringify(fr, null, 2));
