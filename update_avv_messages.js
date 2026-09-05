const fs = require('fs');

const de = JSON.parse(fs.readFileSync('messages/de.json', 'utf8'));
const en = JSON.parse(fs.readFileSync('messages/en.json', 'utf8'));
const fr = JSON.parse(fs.readFileSync('messages/fr.json', 'utf8'));

de.AVV = {
  title: "Auftragsverarbeitungsvertrag (AVV)",
  intro: "Dieser Auftragsverarbeitungsvertrag (AVV) gemäß Art. 28 DSGVO wird zwischen dem Nutzer (Verantwortlicher) und uns (Auftragsverarbeiter) mit der Registrierung auf unserer Plattform geschlossen.",
  h1: "1. Gegenstand der Verarbeitung",
  p1: "Der Auftragsverarbeiter erbringt für den Verantwortlichen Dienstleistungen im Bereich der E-Rechnungs-Erstellung. Dabei werden personenbezogene Daten verarbeitet. Die Applikation arbeitet grundsätzlich 'Memory-Only'. Es werden keine Rechnungs-XMLs oder Rechnungs-Metadaten (wie Käufer-Adressen) dauerhaft auf unseren Servern gespeichert. Alle erzeugten Rechnungen werden nach der Generierung umgehend aus dem flüchtigen Speicher gelöscht.",
  h2: "2. Art der verarbeiteten Daten",
  li1: "Kontaktdaten (Name, Adresse, E-Mail) des Rechnungsempfängers.",
  li2: "Unternehmensdaten des Rechnungsempfängers (USt-IdNr., Anschrift).",
  li3: "Rechnungsdaten (Beträge, Positionen, Rechnungsnummer).",
  h3: "3. Dauer der Verarbeitung",
  p3: "Die Verarbeitung erfolgt ausschließlich im Moment der Generierung der XML-/PDF-Datei ('On-the-fly'). Die Dauer der Datenverarbeitung beschränkt sich auf wenige Millisekunden bis Sekunden. Nach dem Herunterladen der Datei durch den Verantwortlichen werden die Daten unwiderruflich gelöscht.",
  h4: "4. Technische und organisatorische Maßnahmen (TOM)",
  p4: "Wir gewährleisten, dass alle Server (Standort Deutschland) nach aktuellen Sicherheitsstandards (SSL-Verschlüsselung) betrieben werden. Da keine persistente Speicherung von Rechnungsdaten stattfindet, ist das Risiko eines Datenabflusses (Data Breach) systemseitig auf ein absolutes Minimum reduziert.",
  h5: "5. Zustimmung",
  p5: "Durch die Erstellung eines Kontos auf unserer Plattform (Kostenlos oder Business) stimmt der Verantwortliche diesem AVV automatisch zu."
};

en.AVV = {
  title: "Data Processing Agreement (DPA)",
  intro: "This Data Processing Agreement (DPA) according to Art. 28 GDPR is concluded between the user (Data Controller) and us (Data Processor) upon registration on our platform.",
  h1: "1. Subject of Processing",
  p1: "The Processor provides services in the field of e-invoice creation for the Controller. Personal data is processed in this context. The application basically works 'Memory-Only'. No invoice XMLs or invoice metadata (such as buyer addresses) are permanently stored on our servers. All generated invoices are immediately deleted from volatile memory after generation.",
  h2: "2. Types of Processed Data",
  li1: "Contact details (Name, Address, Email) of the invoice recipient.",
  li2: "Company data of the invoice recipient (VAT ID, Address).",
  li3: "Invoice data (Amounts, Items, Invoice Number).",
  h3: "3. Duration of Processing",
  p3: "Processing takes place exclusively at the moment of XML/PDF file generation ('On-the-fly'). The duration of data processing is limited to a few milliseconds to seconds. After the Controller downloads the file, the data is irrevocably deleted.",
  h4: "4. Technical and Organizational Measures (TOM)",
  p4: "We ensure that all servers (Location: Germany) are operated according to current security standards (SSL encryption). Since there is no persistent storage of invoice data, the risk of a data breach is systematically reduced to an absolute minimum.",
  h5: "5. Consent",
  p5: "By creating an account on our platform (Free or Business), the Controller automatically agrees to this DPA."
};

fr.AVV = {
  title: "Accord de Traitement des Données (DPA)",
  intro: "Cet Accord de Traitement des Données (DPA) conformément à l'Art. 28 du RGPD est conclu entre l'utilisateur (Responsable du Traitement) et nous (Sous-traitant) lors de l'inscription sur notre plateforme.",
  h1: "1. Objet du Traitement",
  p1: "Le Sous-traitant fournit des services dans le domaine de la création de factures électroniques pour le Responsable. Des données personnelles sont traitées dans ce cadre. L'application fonctionne fondamentalement en 'Mémoire Uniquement'. Aucun fichier XML de facture ou métadonnées de facture (comme les adresses des acheteurs) n'est stocké de façon permanente sur nos serveurs. Toutes les factures générées sont immédiatement supprimées de la mémoire volatile après génération.",
  h2: "2. Types de Données Traitées",
  li1: "Coordonnées (Nom, Adresse, Email) du destinataire de la facture.",
  li2: "Données d'entreprise du destinataire (Numéro de TVA, Adresse).",
  li3: "Données de facturation (Montants, Articles, Numéro de facture).",
  h3: "3. Durée du Traitement",
  p3: "Le traitement a lieu exclusivement au moment de la génération du fichier XML/PDF ('À la volée'). La durée du traitement des données est limitée à quelques millisecondes ou secondes. Après le téléchargement du fichier par le Responsable, les données sont irrémédiablement supprimées.",
  h4: "4. Mesures Techniques et Organisationnelles (TOM)",
  p4: "Nous garantissons que tous les serveurs (Emplacement : Allemagne) sont exploités selon les normes de sécurité actuelles (cryptage SSL). Puisqu'il n'y a pas de stockage persistant des données de facturation, le risque de violation de données est systématiquement réduit à un minimum absolu.",
  h5: "5. Consentement",
  p5: "En créant un compte sur notre plateforme (Gratuit ou Business), le Responsable accepte automatiquement ce DPA."
};

fs.writeFileSync('messages/de.json', JSON.stringify(de, null, 2));
fs.writeFileSync('messages/en.json', JSON.stringify(en, null, 2));
fs.writeFileSync('messages/fr.json', JSON.stringify(fr, null, 2));
