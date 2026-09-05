'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function PricingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const t = useTranslations('Pricing');

  const handleUpgrade = async () => {
    if (!session) {
      router.push('/register');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/billing/upgrade', {
        method: 'POST',
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const guestFeatures = t.raw('guest_features') as string[];
  const freeFeatures = t.raw('free_features') as string[];
  const proFeatures = t.raw('pro_features') as string[];

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">{t('title')}</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            {t('subtitle')}
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
          {t('desc')}
        </p>

        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 lg:gap-y-0">
          
          {/* Guest */}
          <div className="rounded-3xl p-8 ring-1 ring-gray-200 xl:p-10 flex flex-col justify-between hover:shadow-xl transition-shadow duration-300">
            <div>
              <h3 className="text-lg font-semibold leading-8 text-gray-900">{t('guest')}</h3>
              <p className="mt-4 text-sm leading-6 text-gray-600">{t('guest_desc')}</p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-gray-900">{t('free_price')}</span>
              </p>
              <ul className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                {guestFeatures.map((f, i) => (
                  <li key={i} className={`flex gap-x-3 ${i === guestFeatures.length - 1 ? 'font-semibold text-gray-900' : ''}`}>
                    <span className="text-indigo-600">✓</span> {f}
                  </li>
                ))}
              </ul>
            </div>
            {!session && (
              <button
                onClick={() => router.push('/dashboard')}
                className="mt-8 block w-full rounded-md bg-white px-3 py-2 text-center text-sm font-semibold leading-6 text-indigo-600 shadow-sm ring-1 ring-inset ring-blue-200 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {t('button_guest')}
              </button>
            )}
          </div>

          {/* Free */}
          <div className="relative rounded-3xl p-8 ring-2 ring-gray-200 xl:p-10 flex flex-col justify-between hover:shadow-xl transition-shadow duration-300">
            <div>
              <h3 className="text-lg font-semibold leading-8 text-gray-900">{t('free')}</h3>
              <p className="mt-4 text-sm leading-6 text-gray-600">{t('free_desc')}</p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-gray-900">{t('free_price')}</span>
              </p>
              <ul className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                {freeFeatures.map((f, i) => (
                  <li key={i} className={`flex gap-x-3 ${i === freeFeatures.length - 1 ? 'font-semibold text-gray-900' : ''}`}>
                    <span className="text-indigo-600">✓</span> {f}
                  </li>
                ))}
              </ul>
            </div>
            {!session && (
              <button
                onClick={() => router.push('/register')}
                className="mt-8 block w-full rounded-md bg-indigo-50 px-3 py-2 text-center text-sm font-semibold leading-6 text-blue-700 shadow-sm hover:bg-indigo-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {t('button_free')}
              </button>
            )}
          </div>

          {/* {t('pro')} */}
          <div className="relative rounded-3xl p-8 ring-2 ring-indigo-600 xl:p-10 flex flex-col justify-between bg-blue-900 shadow-xl transform scale-105 z-10 transition-transform duration-300">
            <div className="absolute top-0 right-6 transform -translate-y-1/2">
              <span className="bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full">{t('most_popular')}</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold leading-8 text-white">{t('pro')}</h3>
              <p className="mt-4 text-sm leading-6 text-blue-200">{t('pro_desc')}</p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-white">{t('pro_price')}</span>
                <span className="text-sm font-semibold leading-6 text-blue-200">/Monat</span>
              </p>
              <ul className="mt-8 space-y-3 text-sm leading-6 text-indigo-100">
                {proFeatures.map((f, i) => (
                  <li key={i} className={`flex gap-x-3 ${i === 1 ? 'font-bold text-white' : ''}`}>
                    <span className="text-indigo-400">✓</span> {f}
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={handleUpgrade}
              disabled={loading || (session?.user as any)?.tier === 'PRO'}
              className="mt-8 block w-full rounded-md bg-indigo-500 px-3 py-2 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:bg-gray-500"
            >
              {(session?.user as any)?.tier === 'PRO' ? t('current') : (loading ? '...' : t('upgrade'))}
            </button>
          </div>

        </div>

        <div className="mt-16 bg-gray-50 rounded-2xl p-8 text-sm leading-6 text-gray-600 flex flex-col md:flex-row gap-8 justify-between items-center text-center md:text-left">
          <p>{t('disclaimer')}</p>
          <div className="font-semibold text-gray-900">
            {t('payment_methods')} <span className="font-normal text-gray-600">{t('payment_methods_list')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
