'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { MailCheck } from 'lucide-react';
import { Input } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { AuthShell } from '@/components/ui/AuthShell';

export default function ForgotPassword() {
  const t = useTranslations('Auth');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error('Something went wrong');
      setSuccess(true);
    } catch {
      setError(t('forgot_error'));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthShell title={t('forgot_sent_title')}>
        <div className="text-center animate-fade-in-up">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 mb-4">
            <MailCheck className="h-6 w-6 text-emerald-600" />
          </div>
          <p className="text-sm text-gray-600">{t('forgot_sent_desc', { email })}</p>
          <Link href="/login" className="mt-6 inline-block text-sm font-semibold text-indigo-600 hover:text-indigo-500">
            {t('back_to_login')}
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell title={t('forgot_title')} subtitle={t('forgot_desc')}>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && <Alert kind="error">{error}</Alert>}
        <Input
          label={t('login_email')}
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          autoComplete="email"
        />
        <Button type="submit" fullWidth loading={loading} size="lg">
          {t('forgot_btn')}
        </Button>
      </form>
      <p className="text-center text-sm text-gray-500 mt-6">
        <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
          {t('back_to_login')}
        </Link>
      </p>
    </AuthShell>
  );
}
