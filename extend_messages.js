const fs = require('fs');

const de = JSON.parse(fs.readFileSync('messages/de.json', 'utf8'));
const en = JSON.parse(fs.readFileSync('messages/en.json', 'utf8'));
const fr = JSON.parse(fs.readFileSync('messages/fr.json', 'utf8'));

// Pricing
de.Pricing = {
  title: "Einfache und transparente Preise",
  subtitle: "Wählen Sie den passenden Tarif für Ihr Unternehmen.",
  free: "Kostenlos",
  free_desc: "Für Einzelunternehmer und kleine Projekte",
  free_price: "0 €",
  pro: "PRO",
  pro_desc: "Für wachsende Unternehmen mit API-Bedarf",
  pro_price: "12,95 €",
  month: "/ Monat",
  get_started: "Jetzt starten",
  upgrade: "Auf PRO upgraden",
  current: "Aktueller Tarif",
  feat1: "Max 500€ pro Rechnung",
  feat2: "Unbegrenzte Rechnungen",
  feat3: "Standard ZUGFeRD PDF",
  feat4: "Basic E-Mail Support",
  feat5: "Kein Limit pro Rechnung",
  feat6: "API-Zugang & Custom Branding",
  feat7: "Priority Support"
};

en.Pricing = {
  title: "Simple and transparent pricing",
  subtitle: "Choose the right plan for your business.",
  free: "Free",
  free_desc: "For solo entrepreneurs and small projects",
  free_price: "0 €",
  pro: "PRO",
  pro_desc: "For growing businesses needing API access",
  pro_price: "12.95 €",
  month: "/ month",
  get_started: "Get started",
  upgrade: "Upgrade to PRO",
  current: "Current plan",
  feat1: "Max 500€ per invoice",
  feat2: "Unlimited invoices",
  feat3: "Standard ZUGFeRD PDF",
  feat4: "Basic email support",
  feat5: "No limit per invoice",
  feat6: "API Access & Custom Branding",
  feat7: "Priority support"
};

fr.Pricing = {
  title: "Tarification simple et transparente",
  subtitle: "Choisissez le plan adapté à votre entreprise.",
  free: "Gratuit",
  free_desc: "Pour les auto-entrepreneurs et les petits projets",
  free_price: "0 €",
  pro: "PRO",
  pro_desc: "Pour les entreprises en croissance ayant besoin d'un accès API",
  pro_price: "12,95 €",
  month: "/ mois",
  get_started: "Commencer",
  upgrade: "Passer à PRO",
  current: "Plan actuel",
  feat1: "Max 500€ par facture",
  feat2: "Factures illimitées",
  feat3: "PDF ZUGFeRD standard",
  feat4: "Support par e-mail basique",
  feat5: "Aucune limite par facture",
  feat6: "Accès API et personnalisation",
  feat7: "Support prioritaire"
};

// Auth
de.Auth = {
  login_title: "Willkommen zurück",
  login_email: "E-Mail-Adresse",
  login_pass: "Passwort",
  login_forgot: "Passwort vergessen?",
  login_btn: "Anmelden",
  login_google: "Mit Google anmelden",
  login_no_account: "Noch kein Konto?",
  login_register: "Registrieren",
  reg_title: "Konto erstellen",
  reg_btn: "Registrieren",
  reg_has_account: "Bereits ein Konto?",
  reg_agree: "Ich akzeptiere die",
  reg_terms: "Allgemeinen Geschäftsbedingungen (AGB)",
  reg_privacy_read: "Ich habe die",
  reg_privacy: "Datenschutzerklärung",
  reg_privacy_agree: "gelesen und stimme ihr zu.",
  reg_avv_agree: "Ich schließe hiermit den",
  reg_avv: "Auftragsverarbeitungsvertrag (AVV)",
  reg_avv_end: "gemäß Art. 28 DSGVO mit dem Anbieter ab.",
  reg_error: "Passwort muss mindestens 8 Zeichen lang sein.",
  google_error: "Bitte akzeptieren Sie alle rechtlichen Vereinbarungen, bevor Sie sich mit Google anmelden.",
  forgot_title: "Passwort zurücksetzen",
  forgot_desc: "Geben Sie Ihre E-Mail-Adresse ein. Wir senden Ihnen einen Link zum Zurücksetzen.",
  forgot_btn: "Link senden",
  forgot_success: "E-Mail gesendet! Überprüfen Sie Ihren Posteingang."
};

en.Auth = {
  login_title: "Welcome back",
  login_email: "Email address",
  login_pass: "Password",
  login_forgot: "Forgot password?",
  login_btn: "Sign in",
  login_google: "Sign in with Google",
  login_no_account: "Don't have an account?",
  login_register: "Sign up",
  reg_title: "Create your account",
  reg_btn: "Sign up",
  reg_has_account: "Already have an account?",
  reg_agree: "I accept the",
  reg_terms: "Terms and Conditions (T&C)",
  reg_privacy_read: "I have read and agree to the",
  reg_privacy: "Privacy Policy",
  reg_privacy_agree: ".",
  reg_avv_agree: "I hereby conclude the",
  reg_avv: "Data Processing Agreement (DPA)",
  reg_avv_end: "according to Art. 28 GDPR with the provider.",
  reg_error: "Password must be at least 8 characters long.",
  google_error: "Please accept all legal agreements before signing in with Google.",
  forgot_title: "Reset password",
  forgot_desc: "Enter your email address and we'll send you a link to reset your password.",
  forgot_btn: "Send link",
  forgot_success: "Email sent! Check your inbox."
};

fr.Auth = {
  login_title: "Bon retour",
  login_email: "Adresse e-mail",
  login_pass: "Mot de passe",
  login_forgot: "Mot de passe oublié ?",
  login_btn: "Se connecter",
  login_google: "Se connecter avec Google",
  login_no_account: "Pas encore de compte ?",
  login_register: "S'inscrire",
  reg_title: "Créez votre compte",
  reg_btn: "S'inscrire",
  reg_has_account: "Vous avez déjà un compte ?",
  reg_agree: "J'accepte les",
  reg_terms: "Conditions Générales",
  reg_privacy_read: "J'ai lu et j'accepte la",
  reg_privacy: "Politique de Confidentialité",
  reg_privacy_agree: ".",
  reg_avv_agree: "Je conclus par la présente l'",
  reg_avv: "Accord sur le Traitement des Données (DPA)",
  reg_avv_end: "conformément à l'Art. 28 du RGPD avec le fournisseur.",
  reg_error: "Le mot de passe doit comporter au moins 8 caractères.",
  google_error: "Veuillez accepter tous les accords légaux avant de vous connecter avec Google.",
  forgot_title: "Réinitialiser le mot de passe",
  forgot_desc: "Entrez votre adresse e-mail. Nous vous enverrons un lien de réinitialisation.",
  forgot_btn: "Envoyer le lien",
  forgot_success: "E-mail envoyé ! Vérifiez votre boîte de réception."
};

fs.writeFileSync('messages/de.json', JSON.stringify(de, null, 2));
fs.writeFileSync('messages/en.json', JSON.stringify(en, null, 2));
fs.writeFileSync('messages/fr.json', JSON.stringify(fr, null, 2));

