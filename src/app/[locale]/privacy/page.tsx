import { useTranslations } from 'next-intl';

export default function PrivacyPolicy() {
  const t = useTranslations('Privacy');
  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-white my-10 rounded-lg shadow hover:shadow-xl transition-shadow duration-300">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">{t('title')}</h1>
      
      <div className="prose prose-blue text-gray-600">
        <p>{t('intro')}</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-900">{t('h1')}</h2>
        <p>{t('p1')}</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-900">{t('h2')}</h2>
        <p>{t('p2')}</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-900">{t('h3')}</h2>
        <p>{t('p3')}</p>

        <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-900">{t('h4')}</h2>
        <p>{t('p4')}</p>

        <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-900">{t('h5')}</h2>
        <p>{t('p5')}</p>
      </div>
    </div>
  );
}
