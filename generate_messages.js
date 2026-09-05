const fs = require('fs');

const de = JSON.parse(fs.readFileSync('messages/de.json', 'utf8'));
const en = JSON.parse(fs.readFileSync('messages/en.json', 'utf8'));
const fr = JSON.parse(fs.readFileSync('messages/fr.json', 'utf8'));

de.Pricing = {
    title: "Preise und Lizenzen",
    subtitle: "E-Rechnungen einfach und konform",
    desc: "Auf unserer Plattform erstellen Sie E-Rechnungen ganz einfach im standardisierten XRechnungs-Format. Dieses Format entspricht den Anforderungen der EU-Richtlinie und wird von Unternehmen sowie öffentlichen Auftraggebern anerkannt und akzeptiert.",
    guest: "Unregistriert",
    guest_desc: "Schnell und ohne Anmeldung Rechnungen generieren.",
    guest_features: [
        "E-Rechnung nach Standard EN-16931",
        "SSL verschlüsselt",
        "DSGVO konform",
        "Serverstandort Deutschland",
        "E-Rechnungen erstellen im standardisierten XRechnungs-Format",
        "E-Rechnungen validieren",
        "XML-Datei herunterladen",
        "Rechnungsbetrag bis maximal 100 €"
    ],
    free: "Kostenlose Registrierung",
    free_desc: "Für regelmäßige Nutzer, die ihre Stammdaten speichern möchten.",
    free_features: [
        "Alle Funktionen aus \"Unregistriert\"",
        "Kunden-Adressbuch (CRM Light)",
        "Eigener Leistungskatalog / Artikelstamm",
        "Stammdaten hinterlegen (automatisch eintragen)",
        "Auftragsverarbeitungsvertrag (AVV)",
        "Rechnungsbetrag bis maximal 500 €"
    ],
    pro: "Business",
    pro_desc: "Für Unternehmen mit unbegrenztem Rechnungsbedarf und maximalem Komfort.",
    pro_features: [
        "Alle Funktionen aus \"Kostenlos\"",
        "Unbegrenzte Rechnungsbeträge",
        "Echte ZUGFeRD PDF/A-3 Generierung",
        "Premium Support"
    ],
    button_guest: "Jetzt ausprobieren",
    button_free: "Kostenlos Registrieren",
    button_pro: "Business Paket buchen",
    current_plan: "Aktueller Plan",
    disclaimer: "Die Mindestvertragslaufzeit beträgt einen Monat und das Abonnement ist jederzeit mit einem Klick über diese Website kündbar. Preise inklusive MwSt.",
    payment_methods: "Zahlungsarten:",
    payment_methods_list: "Paypal, Kreditkarte, Rechnung (Überweisung)",
    most_popular: "Meistgewählt"
};

en.Pricing = {
    title: "Pricing and Licenses",
    subtitle: "E-Invoices simple and compliant",
    desc: "On our platform, you can easily create e-invoices in the standardized XRechnung format. This format complies with EU directive requirements and is recognized and accepted by companies and public authorities.",
    guest: "Unregistered",
    guest_desc: "Generate invoices quickly without registration.",
    guest_features: [
        "E-Invoice according to EN-16931 standard",
        "SSL encrypted",
        "GDPR compliant",
        "Server location Germany",
        "Create E-Invoices in standardized XRechnung format",
        "Validate E-Invoices",
        "Download XML file",
        "Invoice amount up to max 100 €"
    ],
    free: "Free Registration",
    free_desc: "For regular users who want to save their master data.",
    free_features: [
        "All features from \"Unregistered\"",
        "Customer Address Book (CRM Light)",
        "Custom Service/Product Catalog",
        "Store master data (auto-fill)",
        "Data Processing Agreement (DPA)",
        "Invoice amount up to max 500 €"
    ],
    pro: "Business",
    pro_desc: "For companies with unlimited invoicing needs and maximum comfort.",
    pro_features: [
        "All features from \"Free\"",
        "Unlimited invoice amounts",
        "True ZUGFeRD PDF/A-3 Generation",
        "Premium Support"
    ],
    button_guest: "Try Now",
    button_free: "Register for Free",
    button_pro: "Upgrade to Business",
    current_plan: "Current Plan",
    disclaimer: "The minimum contract period is one month and the subscription can be canceled at any time with one click via this website. Prices include VAT.",
    payment_methods: "Payment Methods:",
    payment_methods_list: "PayPal, Credit Card, Invoice (Bank Transfer)",
    most_popular: "Most Popular"
};

fr.Pricing = {
    title: "Tarifs et Licences",
    subtitle: "Factures électroniques simples et conformes",
    desc: "Sur notre plateforme, vous pouvez facilement créer des factures électroniques au format standardisé XRechnung. Ce format est conforme aux exigences de la directive européenne et est reconnu et accepté par les entreprises et les autorités publiques.",
    guest: "Non inscrit",
    guest_desc: "Générez des factures rapidement sans inscription.",
    guest_features: [
        "Facture électronique selon la norme EN-16931",
        "Crypté SSL",
        "Conforme au RGPD",
        "Serveurs situés en Allemagne",
        "Créer des factures électroniques au format XRechnung",
        "Valider les factures électroniques",
        "Télécharger le fichier XML",
        "Montant de la facture jusqu'à 100 € max"
    ],
    free: "Inscription gratuite",
    free_desc: "Pour les utilisateurs réguliers souhaitant enregistrer leurs données.",
    free_features: [
        "Toutes les fonctionnalités de \"Non inscrit\"",
        "Carnet d'adresses clients (CRM Light)",
        "Catalogue de produits/services personnalisé",
        "Enregistrer les données de base (remplissage auto)",
        "Accord de traitement des données (DPA)",
        "Montant de la facture jusqu'à 500 € max"
    ],
    pro: "Business",
    pro_desc: "Pour les entreprises ayant des besoins de facturation illimités et un confort maximal.",
    pro_features: [
        "Toutes les fonctionnalités \"Gratuit\"",
        "Montants de facturation illimités",
        "Génération de PDF/A-3 ZUGFeRD authentique",
        "Support Premium"
    ],
    button_guest: "Essayer maintenant",
    button_free: "S'inscrire gratuitement",
    button_pro: "Passer à Business",
    current_plan: "Plan Actuel",
    disclaimer: "La durée minimale du contrat est d'un mois et l'abonnement peut être annulé à tout moment en un clic via ce site web. Les prix incluent la TVA.",
    payment_methods: "Moyens de paiement:",
    payment_methods_list: "PayPal, Carte de crédit, Facture (Virement bancaire)",
    most_popular: "Le plus populaire"
};

fs.writeFileSync('messages/de.json', JSON.stringify(de, null, 2));
fs.writeFileSync('messages/en.json', JSON.stringify(en, null, 2));
fs.writeFileSync('messages/fr.json', JSON.stringify(fr, null, 2));
