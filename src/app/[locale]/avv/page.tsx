import { useTranslations } from 'next-intl';

export default function AvvPage() {
  const t = useTranslations('Legal');
  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-6 lg:px-8 prose prose-indigo">
        <h1>{t('avv_title')}</h1>
        <div dangerouslySetInnerHTML={{ __html: t('avv_body') }} />
      </div>
    </div>
  );
}
