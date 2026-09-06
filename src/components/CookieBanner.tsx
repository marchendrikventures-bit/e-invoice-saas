'use client';
import { useSyncExternalStore } from 'react';
import { useTranslations } from 'next-intl';

// Reading localStorage on mount and syncing it into component state via an
// effect causes an extra render pass (and the banner "popping in" after
// first paint). useSyncExternalStore is the pattern React recommends for
// exactly this — an external, non-React store — and renders correctly on
// the very first paint instead, with no effect involved.
const CONSENT_KEY = 'cookie-consent';
const listeners = new Set<() => void>();

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

function getConsent() {
  return localStorage.getItem(CONSENT_KEY);
}

// No localStorage on the server — render as "not yet decided" so the
// banner shows immediately and consistently, then corrects itself the
// instant the real client value is known (useSyncExternalStore's job).
function getServerConsent() {
  return null;
}

function setConsent(value: 'true' | 'false') {
  localStorage.setItem(CONSENT_KEY, value);
  listeners.forEach((listener) => listener());
}

export default function CookieBanner() {
  const consent = useSyncExternalStore(subscribe, getConsent, getServerConsent);
  const t = useTranslations('CookieBanner');

  if (consent !== null) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 pb-2 sm:pb-5 z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="p-2 rounded-lg bg-gray-900 shadow-lg sm:p-3">
          <div className="flex items-center justify-between flex-wrap">
            <div className="w-0 flex-1 flex items-center">
              <span className="flex p-2 rounded-lg bg-gray-800">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <p className="ml-3 font-medium text-white truncate">
                <span className="md:hidden">{t('title')}</span>
                <span className="hidden md:inline">{t('description')}</span>
              </p>
            </div>
            <div className="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto flex space-x-2">
              <button onClick={() => setConsent('true')} className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-900 bg-white hover:bg-gray-50">
                {t('accept')}
              </button>
              <button onClick={() => setConsent('false')} className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700">
                {t('decline')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
