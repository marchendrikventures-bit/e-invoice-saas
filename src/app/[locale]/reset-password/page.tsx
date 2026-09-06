'use client';
import { useState, Suspense } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertTriangle } from 'lucide-react';
import { PasswordInput } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { AuthShell } from '@/components/ui/AuthShell';

function ResetPasswordForm() {
  const t = useTranslations('Auth');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to reset password');
      }
      router.push('/login?reset=success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <AuthShell title={t('reset_title')}>
        <div className="text-center animate-fade-in-up">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 mb-4">
            <AlertTriangle className="h-6 w-6 text-amber-600" />
          </div>
          <p className="text-sm text-gray-600">{t('reset_invalid')}</p>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell title={t('reset_title')}>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && <Alert kind="error">{error}</Alert>}
        <PasswordInput
          label={t('reset_pass')}
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />
        <Button type="submit" fullWidth loading={loading} size="lg">
          {t('reset_btn')}
        </Button>
      </form>
    </AuthShell>
  );
}

export default function ResetPassword() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
