'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">{t('reg_title')}</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3" placeholder="Email address" />
            </div>
            <div>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3" placeholder="Password" />
            </div>
          </div>
          
          <div className="space-y-3 mt-4 text-sm text-gray-600">
            <div className="flex items-start">
              <div className="flex h-6 items-center">
                <input id="terms" type="checkbox" required checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" />
              </div>
              <div className="ml-3">
                <label htmlFor="terms">{t('reg_agree')} <Link href="/de/impressum" className="text-indigo-600 hover:underline">{t('reg_terms')}</Link>.</label>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex h-6 items-center">
                <input id="privacy" type="checkbox" required checked={privacyAccepted} onChange={(e) => setPrivacyAccepted(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" />
              </div>
              <div className="ml-3">
                <label htmlFor="privacy">{t('reg_privacy_read')} <Link href="/de/privacy" className="text-indigo-600 hover:underline">{t('reg_privacy')}</Link> {t('reg_privacy_agree')}</label>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex h-6 items-center">
                <input id="avv" type="checkbox" required checked={avvAccepted} onChange={(e) => setAvvAccepted(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" />
              </div>
              <div className="ml-3">
                <label htmlFor="avv">{t('reg_avv_agree')} <Link href="/de/avv" className="text-indigo-600 hover:underline">{t('reg_avv')}</Link> gemäß Art. 28 DSGVO mit dem Anbieter.</label>
              </div>
            </div>
          </div>

          <div>
            <button type="submit" disabled={loading} className="group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-blue-300">
              {loading ? 'Creating...' : 'Sign up'}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-gray-50 px-2 text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={() => {
                if (!termsAccepted || !privacyAccepted || !avvAccepted) {
                  setError(t('google_error'));
                  return;
                }
                signIn('google', { callbackUrl: '/dashboard' });
              }}
              className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent"
            >
              <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                <path
                  d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                  fill="#EA4335"
                />
                <path
                  d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                  fill="#4285F4"
                />
                <path
                  d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                  fill="#FBBC05"
                />
                <path
                  d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26537 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                  fill="#34A853"
                />
              </svg>
              Sign in with Google
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account? <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">{t('login_btn')}</Link>
        </p>
      </div>
    </div>
  );
}
