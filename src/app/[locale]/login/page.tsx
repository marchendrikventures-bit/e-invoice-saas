'use client';

import { Suspense, useState } from 'react';
import { useTranslations } from 'next-intl';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { Input, PasswordInput } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { AuthShell } from '@/components/ui/AuthShell';
import { GoogleButton, OrDivider } from '@/components/ui/GoogleButton';

function LoginForm() {
  const t = useTranslations('Auth');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const justReset = searchParams.get('reset') === 'success';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await signIn('credentials', { redirect: false, email, password });
    if (res?.error) {
      setError(t('login_error'));
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <AuthShell title={t('login_title')} subtitle={t('login_subtitle')}>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {justReset && <Alert kind="success">{t('reset_success_login')}</Alert>}
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
        <div>
          <PasswordInput
            label={t('login_pass')}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          <div className="mt-2 text-right">
            <Link href="/forgot-password" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              {t('login_forgot')}
            </Link>
          </div>
        </div>

        <Button type="submit" fullWidth loading={loading} size="lg">
          {t('login_btn')}
        </Button>
      </form>

      <OrDivider label={t('or_continue')} />

      <GoogleButton onClick={() => signIn('google', { callbackUrl: '/dashboard' })}>
        {t('login_google')}
      </GoogleButton>

      <p className="text-center text-sm text-gray-500 mt-6">
        {t('login_no_account')}{' '}
        <Link href="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
          {t('login_register')}
        </Link>
      </p>
    </AuthShell>
  );
}

export default function Login() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
