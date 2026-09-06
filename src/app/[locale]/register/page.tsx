'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { Input, PasswordInput } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { AuthShell } from '@/components/ui/AuthShell';
import { GoogleButton, OrDivider } from '@/components/ui/GoogleButton';

export default function Register() {
  const t = useTranslations('Auth');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [avvAccepted, setAvvAccepted] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password.length < 8) {
      setError(t('reg_error'));
      setLoading(false);
      return;
    }

    if (!termsAccepted || !privacyAccepted || !avvAccepted) {
      setError(t('google_error'));
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, termsAccepted, privacyAccepted, avvAccepted }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to register');
      }

      router.push('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  const allAccepted = termsAccepted && privacyAccepted && avvAccepted;

  return (
    <AuthShell title={t('reg_title')} subtitle={t('reg_subtitle')}>
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
        <PasswordInput
          label={t('login_pass')}
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          hint={t('reg_error')}
          autoComplete="new-password"
        />

        <div className="space-y-2.5 pt-1 text-sm text-gray-600">
          <label className="flex items-start gap-2.5 cursor-pointer group">
            <input type="checkbox" required checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" />
            <span>{t('reg_agree')} <Link href="/impressum" className="text-indigo-600 hover:underline font-medium">{t('reg_terms')}</Link>.</span>
          </label>
          <label className="flex items-start gap-2.5 cursor-pointer group">
            <input type="checkbox" required checked={privacyAccepted} onChange={(e) => setPrivacyAccepted(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" />
            <span>{t('reg_privacy_read')} <Link href="/privacy" className="text-indigo-600 hover:underline font-medium">{t('reg_privacy')}</Link> {t('reg_privacy_agree')}</span>
          </label>
          <label className="flex items-start gap-2.5 cursor-pointer group">
            <input type="checkbox" required checked={avvAccepted} onChange={(e) => setAvvAccepted(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" />
            <span>{t('reg_avv_agree')} <Link href="/avv" className="text-indigo-600 hover:underline font-medium">{t('reg_avv')}</Link> {t('reg_avv_end')}</span>
          </label>
        </div>

        <Button type="submit" fullWidth loading={loading} size="lg">
          {t('reg_btn')}
        </Button>
      </form>

      <OrDivider label={t('or_continue')} />

      <GoogleButton
        onClick={() => {
          if (!allAccepted) {
            setError(t('google_error'));
            return;
          }
          signIn('google', { callbackUrl: '/dashboard' });
        }}
      >
        {t('login_google')}
      </GoogleButton>

      <p className="text-center text-sm text-gray-500 mt-6">
        {t('reg_has_account')}{' '}
        <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
          {t('login_btn')}
        </Link>
      </p>
    </AuthShell>
  );
}
