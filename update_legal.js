const fs = require('fs');

const de = JSON.parse(fs.readFileSync('messages/de.json', 'utf8'));
const en = JSON.parse(fs.readFileSync('messages/en.json', 'utf8'));
const fr = JSON.parse(fs.readFileSync('messages/fr.json', 'utf8'));

de.Legal = {
  impressum_title: "Impressum",
  impressum_body: `<h3>Angaben gemäß § 5 TMG</h3>
<p>
  <strong>Max Mustermann</strong><br />
  Musterstraße 123<br />
  12345 Musterstadt<br />
  Deutschland
</p>
<h3>Kontakt</h3>
<p>
  Telefon: +49 (0) 123 44 55 66<br />
  E-Mail: info@musterfirma.de
</p>`,
  privacy_title: "Datenschutzerklärung",
  privacy_body: `<p>Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.</p>
<h3>1. Datenerfassung auf dieser Website</h3>
<p>Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z.B. um Daten handeln, die Sie in ein Kontaktformular eingeben.</p>
<h3>2. Nutzung der E-Rechnungs-Funktion</h3>
<p>Die Rechnungsdaten (Kunden- und Artikeldaten), die Sie in unsere Plattform eingeben oder hochladen, werden ausschließlich im Arbeitsspeicher verarbeitet und nicht dauerhaft gespeichert. Nach der Generierung der PDF/XML-Datei werden diese Daten verworfen.</p>`,
  avv_title: "Auftragsverarbeitungsvertrag (AVV)",
  avv_body: `<p>Dieser Vertrag regelt die Rechte und Pflichten der Parteien im Zusammenhang mit der Verarbeitung von personenbezogenen Daten gemäß Art. 28 der Datenschutz-Grundverordnung (DSGVO).</p>
<h3>1. Gegenstand des Auftrags</h3>
<p>Der Auftragnehmer verarbeitet personenbezogene Daten im Auftrag des Auftraggebers. Dies umfasst die Konvertierung von bereitgestellten Rechnungsdaten in standardisierte Formate (XRechnung, ZUGFeRD).</p>
<h3>2. Dauer des Auftrags</h3>
<p>Der Vertrag wird auf unbestimmte Zeit geschlossen und kann von beiden Parteien mit einer Frist von 30 Tagen gekündigt werden.</p>`
};

en.Legal = {
  impressum_title: "Legal Notice",
  impressum_body: `<h3>Information according to § 5 TMG</h3>
<p>
  <strong>Max Mustermann</strong><br />
  Musterstraße 123<br />
  12345 Musterstadt<br />
  Germany
</p>
<h3>Contact</h3>
<p>
  Phone: +49 (0) 123 44 55 66<br />
  Email: info@musterfirma.de
</p>`,
  privacy_title: "Privacy Policy",
  privacy_body: `<p>We take the protection of your personal data very seriously. We treat your personal data confidentially and in accordance with the statutory data protection regulations and this privacy policy.</p>
<h3>1. Data collection on this website</h3>
<p>Your data is collected when you provide it to us. This could be, for example, data you enter into a contact form.</p>
<h3>2. Use of the E-Invoicing feature</h3>
<p>The invoice data (customer and item data) that you enter or upload to our platform is processed exclusively in memory and is not stored permanently. After generating the PDF/XML file, this data is discarded.</p>`,
  avv_title: "Data Processing Agreement (DPA)",
  avv_body: `<p>This agreement regulates the rights and obligations of the parties in connection with the processing of personal data in accordance with Art. 28 of the General Data Protection Regulation (GDPR).</p>
<h3>1. Subject of the Agreement</h3>
<p>The contractor processes personal data on behalf of the client. This includes the conversion of provided invoice data into standardized formats (XRechnung, ZUGFeRD).</p>
<h3>2. Duration of the Agreement</h3>
<p>The contract is concluded for an indefinite period and can be terminated by either party with a notice period of 30 days.</p>`
};

fr.Legal = {
  impressum_title: "Mentions Légales",
  impressum_body: `<h3>Informations conformément au § 5 TMG</h3>
<p>
  <strong>Max Mustermann</strong><br />
  Musterstraße 123<br />
  12345 Musterstadt<br />
  Allemagne
</p>
<h3>Contact</h3>
<p>
  Téléphone : +49 (0) 123 44 55 66<br />
  E-mail : info@musterfirma.de
</p>`,
  privacy_title: "Politique de Confidentialité",
  privacy_body: `<p>Nous prenons la protection de vos données personnelles très au sérieux. Nous traitons vos données personnelles de manière confidentielle et conformément aux dispositions légales sur la protection des données ainsi qu'à cette politique de confidentialité.</p>
<h3>1. Collecte de données sur ce site</h3>
<p>Vos données sont collectées lorsque vous nous les communiquez. Il peut s'agir, par exemple, de données saisies dans un formulaire de contact.</p>
<h3>2. Utilisation de la fonction de facturation électronique</h3>
<p>Les données de facturation (clients et articles) que vous saisissez ou téléchargez sur notre plateforme sont traitées exclusivement en mémoire et ne sont pas stockées de manière permanente. Après la génération du fichier PDF/XML, ces données sont supprimées.</p>`,
  avv_title: "Accord sur le Traitement des Données (DPA)",
  avv_body: `<p>Cet accord régit les droits et obligations des parties dans le cadre du traitement des données personnelles conformément à l'Art. 28 du Règlement Général sur la Protection des Données (RGPD).</p>
<h3>1. Objet de l'accord</h3>
<p>Le sous-traitant traite des données personnelles pour le compte du client. Cela inclut la conversion des données de facturation fournies en formats standardisés (XRechnung, ZUGFeRD).</p>
<h3>2. Durée de l'accord</h3>
<p>Le contrat est conclu pour une durée indéterminée et peut être résilié par l'une ou l'autre des parties avec un préavis de 30 jours.</p>`
};

fs.writeFileSync('messages/de.json', JSON.stringify(de, null, 2));
fs.writeFileSync('messages/en.json', JSON.stringify(en, null, 2));
fs.writeFileSync('messages/fr.json', JSON.stringify(fr, null, 2));

