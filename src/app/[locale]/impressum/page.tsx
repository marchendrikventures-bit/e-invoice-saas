import { useTranslations } from 'next-intl';
import { LegalLayout } from '@/components/ui/LegalLayout';

export default function ImpressumPage() {
  const t = useTranslations('Legal');
  return <LegalLayout title={t('impressum_title')} bodyHtml={t.raw('impressum_body')} />;
}
