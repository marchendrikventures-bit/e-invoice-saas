import re

with open('src/app/[locale]/dashboard/page.tsx', 'r') as f:
    content = f.read()

replacements = {
    "'Bitte fügen Sie mindestens eine Position hinzu.'": "t('error_no_items')",
    "'Please upload a file or switch to manual entry.'": "t('error_no_items')",
    "'Bitte geben Sie Ihren Firmennamen (Verkäufer) ein.'": "t('error_no_supplier')",
    "'Bitte geben Sie die Kundendaten (Käufer) ein.'": "t('error_no_customer')",
    "'Bitte Firmenname ausfüllen'": "t('alert_customer_name')",
    "'Kunde gespeichert!'": "t('alert_customer_saved')",
    "'Bezeichnung fehlt'": "t('alert_item_desc')",
    "'Artikel im Katalog gespeichert!'": "t('alert_item_saved')",
    "Lade...": "{t('loading')}",
    "E-Rechnungen Dashboard": "{t('title')}",
    "Sie nutzen die Plattform als Gast (Unregistriert). Sie können Rechnungen bis max. 100 € erstellen.": "{t('guest_warning')}",
    "Kostenlos registrieren": "{t('guest_register')}",
    "für bis zu 500 € und gespeicherte Stammdaten.": "{t('guest_limit')}",
    "Ihre Stammdaten (Verkäufer)": "{t('supplier_title_auth')}",
    "Wir übernehmen Ihre Unternehmensdaten sicher aus Ihren Kontoeinstellungen für jede Rechnung.": "{t('supplier_desc_auth')}",
    "Einstellungen anpassen": "{t('supplier_edit')}",
    "Ihre Daten (Verkäufer)": "{t('supplier_title_guest')}",
    'label="Firmenname *"': 'label={t("company_name")}',
    'label="Straße"': 'label={t("street")}',
    'label="Stadt"': 'label={t("city")}',
    'label="PLZ"': 'label={t("zip")}',
    'label="Land (z.B. DE)"': 'label={t("country")}',
    'label="USt-IdNr."': 'label={t("vat")}',
    "Kundendaten (Käufer)": "{t('customer_title')}",
    "-- Gespeicherten Kunden laden --": "{t('load_customer')}",
    "Kunde im Adressbuch speichern": "{t('save_customer')}",
    "Rechnungsdetails (Optional)": "{t('invoice_details')}",
    'label="Rechnungsnummer (Autom. generiert wenn leer)"': 'label={t("invoice_number")}',
    "Rechnungsdatum": "{t('invoice_date')}",
    "Posten hinzufügen": "{t('add_items')}",
    "Datei hochladen": "{t('mode_upload')}",
    "Manuelle Eingabe": "{t('mode_manual')}",
    "Laden Sie eine CSV, Excel (.xlsx) oder CRM JSON (.json) hoch. Bei CSV/Excel werden folgende Spalten benötigt: <code>Description</code>, <code>Quantity</code>, <code>Price</code>, und <code>TaxPercent</code>.": "{t('upload_desc')}",
    "Datei auswählen": "{t('select_file')}",
    "oder per Drag & Drop": "{t('drag_drop')}",
    "CSV, XLSX, JSON bis 10MB": "{t('file_limits')}",
    "+ Artikel aus Katalog hinzufügen": "{t('add_from_catalog')}",
    "Bezeichnung (Description)": "{t('item_desc')}",
    "z.B. Webentwicklung": "{t('item_desc_placeholder')}",
    "Menge": "{t('quantity')}",
    "Stückpreis (€)": "{t('price')}",
    "MwSt. (%)": "{t('tax')}",
    "💾 Speichern": "{t('save_catalog')}",
    "Als Vorlage im Artikelstamm speichern": "{t('save_catalog_title')}",
    "✖": "{t('remove')}",
    'title="Entfernen"': 'title={t("remove_title")}',
    "+ Neue Position hinzufügen": "{t('add_new_position')}",
    "XRechnung (XML) herunterladen": "{t('download_xml')}",
    "ZUGFeRD (PDF) herunterladen": "{t('download_pdf')}",
    "Wird erstellt...": "{t('creating')}"
}

for k, v in replacements.items():
    content = content.replace(k, v)

with open('src/app/[locale]/dashboard/page.tsx', 'w') as f:
    f.write(content)

