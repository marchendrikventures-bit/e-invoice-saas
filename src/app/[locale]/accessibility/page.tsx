import { useTranslations } from 'next-intl';
import { LegalLayout } from '@/components/ui/LegalLayout';

export default function AccessibilityPage() {
  const t = useTranslations('Legal');
  return <LegalLayout title={t('accessibility_title')} bodyHtml={t.raw('accessibility_body')} />;
}
