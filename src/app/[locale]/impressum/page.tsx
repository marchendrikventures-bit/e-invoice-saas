import { useTranslations } from 'next-intl';

export default function Impressum() {
  const t = useTranslations('Impressum');
  
  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-white my-10 rounded-lg shadow hover:shadow-xl transition-shadow duration-300">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">{t('title')}</h1>
      
      <div className="prose prose-blue text-gray-600">
        <p>{t('info')}</p>
        <p>
          <strong>{t('company')}</strong><br/>
          Musterstraße 1<br/>
          12345 Musterstadt<br/>
          Deutschland
        </p>

        <p>
          <strong>{t('represented_by')}</strong><br/>
          Max Mustermann
        </p>

        <p>
          <strong>{t('contact')}</strong><br/>
          Telefon: +49 (0) 123 44 55 66<br/>
          E-Mail: kontakt@einvoice-saas.example.com
        </p>

        <p>
          <strong>{t('register')}</strong><br/>
          {t('register_info')}
        </p>

        <p>
          <strong>{t('vat')}</strong><br/>
          {t('vat_info')}
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-900">{t('responsible')}</h2>
        <p>
          Max Mustermann<br/>
          Musterstraße 1<br/>
          12345 Musterstadt
        </p>
      </div>
    </div>
  );
}
