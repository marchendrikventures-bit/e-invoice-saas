import { useTranslations } from 'next-intl';
import { LegalLayout } from '@/components/ui/LegalLayout';

export default function AvvPage() {
  const t = useTranslations('Legal');
  return <LegalLayout title={t('avv_title')} bodyHtml={t.raw('avv_body')} />;
}
