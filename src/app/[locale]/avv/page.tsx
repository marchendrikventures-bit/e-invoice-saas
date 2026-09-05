import { useTranslations } from 'next-intl';

export default function AVV() {
  const t = useTranslations('AVV');
  return (
    <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8 bg-white my-10 rounded-lg shadow hover:shadow-xl transition-shadow duration-300">
      <h1 className="text-3xl font-bold mb-8">{t('title')}</h1>
      
      <p className="mb-4 text-gray-700 leading-relaxed">
        {t('intro')}
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900">{t('h1')}</h2>
      <p className="mb-4 text-gray-700 leading-relaxed">
        {t('p1')}
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900">{t('h2')}</h2>
      <ul className="list-disc ml-6 mb-4 space-y-2 text-gray-700">
        <li>{t('li1')}</li>
        <li>{t('li2')}</li>
        <li>{t('li3')}</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900">{t('h3')}</h2>
      <p className="mb-4 text-gray-700 leading-relaxed">
        {t('p3')}
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900">{t('h4')}</h2>
      <p className="mb-4 text-gray-700 leading-relaxed">
        {t('p4')}
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900">{t('h5')}</h2>
      <p className="mb-4 text-gray-700 leading-relaxed">
        {t('p5')}
      </p>
    </div>
  );
}
