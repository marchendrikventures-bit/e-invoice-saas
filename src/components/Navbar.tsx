'use client';

import { Link, usePathname, useRouter } from '@/i18n/routing';
import { useSession, signOut } from 'next-auth/react';
import { useTranslations, useLocale } from 'next-intl';

export default function Navbar() {
  const { data: session } = useSession();
  const t = useTranslations('Nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.replace(pathname, { locale: e.target.value });
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-blue-700 hover:text-blue-800 transition-colors">
                eu-invoice.app
              </Link>
            </div>
            <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/dashboard" className="border-transparent text-gray-600 hover:border-gray-400 hover:text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors">
                {t('dashboard')}
              </Link>
              <Link href="/pricing" className="border-transparent text-gray-600 hover:border-gray-400 hover:text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors">
                {t('pricing')}
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            
            <div className="relative">
              <select 
                value={locale} 
                onChange={handleLanguageChange}
                className="appearance-none bg-indigo-600 text-white border border-indigo-700 hover:bg-indigo-700 hover:border-indigo-800 rounded-md py-2 pl-4 pr-10 text-sm font-bold cursor-pointer focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all shadow-md"
                title="Sprache wählen / Select Language"
              >
                <option value="de">🇩🇪 Deutsch</option>
                <option value="en">🇬🇧 English</option>
                <option value="fr">🇫🇷 Français</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-white">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>

            {session ? (
              <div className="flex items-center space-x-4 ml-4">
                <Link href="/settings" className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">
                  {t('settings')}
                </Link>
                <span className="text-sm font-medium text-gray-800 hidden sm:inline-flex items-center">
                  {session.user?.email} <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-blue-800 shadow-sm">{(session.user as any)?.tier || 'FREE'}</span>
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-sm font-semibold text-gray-600 hover:text-red-600 transition-colors"
                >
                  {t('logout')}
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4 ml-4">
                <Link href="/login" className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">
                  {t('login')}
                </Link>
                <Link href="/register" className="text-sm font-semibold text-white bg-indigo-600 hover:bg-blue-700 px-4 py-2 rounded-md shadow-sm transition-colors">
                  {t('register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
