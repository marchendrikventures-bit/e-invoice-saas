'use client';
import { useSyncExternalStore } from 'react';
import { useTranslations } from 'next-intl';
import { Cookie } from 'lucide-react';
import { Button } from '@/components/ui/Button';

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
    <div className="fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6 animate-fade-in-up">
      <div className="mx-auto max-w-3xl rounded-2xl bg-gray-900 shadow-2xl shadow-black/20 p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-800 text-white">
              <Cookie className="h-4.5 w-4.5" />
            </span>
            <p className="text-sm text-gray-300 leading-relaxed">{t('description')}</p>
          </div>
          <div className="flex gap-2 shrink-0 self-end sm:self-auto">
            <Button variant="ghost" className="!text-gray-300 hover:!text-white hover:!bg-white/10" onClick={() => setConsent('false')}>
              {t('decline')}
            </Button>
            <Button variant="secondary" onClick={() => setConsent('true')}>
              {t('accept')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
