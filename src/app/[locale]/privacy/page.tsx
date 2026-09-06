import { useTranslations } from 'next-intl';
import { LegalLayout } from '@/components/ui/LegalLayout';

export default function PrivacyPage() {
  const t = useTranslations('Legal');
  return <LegalLayout title={t('privacy_title')} bodyHtml={t.raw('privacy_body')} />;
}
