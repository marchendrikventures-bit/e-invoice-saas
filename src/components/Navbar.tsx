'use client';

import { useState } from 'react';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { useSession, signOut } from 'next-auth/react';
import { useTranslations, useLocale } from 'next-intl';
import { FileStack, Menu, X, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

const LANGUAGES: Record<string, string> = { de: '🇩🇪 DE', en: '🇬🇧 EN', fr: '🇫🇷 FR' };

export default function Navbar() {
  const { data: session } = useSession();
  const t = useTranslations('Nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const tier = session?.user?.tier || 'FREE';

  const navLinks = [
    { href: '/dashboard', label: t('dashboard') },
    { href: '/pricing', label: t('pricing') },
  ];

  const isActive = (href: string) => pathname === href;

  const handleLanguageChange = (loc: string) => {
    router.replace(pathname, { locale: loc });
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-gray-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 shrink-0 group">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm group-hover:bg-indigo-500 transition-colors">
                <FileStack className="h-4.5 w-4.5" strokeWidth={2.25} />
              </span>
              <span className="text-lg font-bold text-gray-900 tracking-tight">eu-invoice<span className="text-indigo-600">.app</span></span>
            </Link>
            <div className="hidden sm:flex sm:space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive(link.href) ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            <div className="relative group">
              <button className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                {LANGUAGES[locale]} <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
              </button>
              <div className="absolute right-0 mt-1 w-28 rounded-lg bg-white shadow-lg ring-1 ring-gray-900/5 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all origin-top-right">
                {Object.entries(LANGUAGES).map(([loc, label]) => (
                  <button
                    key={loc}
                    onClick={() => handleLanguageChange(loc)}
                    className={`flex w-full items-center px-3 py-1.5 text-sm hover:bg-gray-50 ${loc === locale ? 'font-semibold text-indigo-600' : 'text-gray-700'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-5 w-px bg-gray-200" />

            {session ? (
              <div className="flex items-center gap-3">
                <Link href="/settings" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                  {t('settings')}
                </Link>
                <div className="flex items-center gap-2 pl-1">
                  <span className="text-sm text-gray-500 max-w-[160px] truncate hidden lg:inline">{session.user?.email}</span>
                  <Badge color={tier === 'PRO' ? 'indigo' : 'gray'}>{tier}</Badge>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors px-2"
                >
                  {t('logout')}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-3 py-2">
                  {t('login')}
                </Link>
                <Link href="/register" className="text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg shadow-sm transition-colors">
                  {t('register')}
                </Link>
              </div>
            )}
          </div>

          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="sm:hidden flex items-center justify-center text-gray-600 hover:text-gray-900"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="sm:hidden border-t border-gray-100 bg-white animate-fade-in-up">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-medium ${isActive(link.href) ? 'text-indigo-600 bg-indigo-50' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                {link.label}
              </Link>
            ))}
            {session && (
              <Link href="/settings" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                {t('settings')}
              </Link>
            )}
          </div>

          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
            <div className="flex gap-1">
              {Object.entries(LANGUAGES).map(([loc, label]) => (
                <button
                  key={loc}
                  onClick={() => handleLanguageChange(loc)}
                  className={`px-2.5 py-1.5 text-sm rounded-lg ${loc === locale ? 'font-semibold text-indigo-600 bg-indigo-50' : 'text-gray-600'}`}
                >
                  {label}
                </button>
              ))}
            </div>
            {session ? (
              <div className="flex items-center gap-2">
                <Badge color={tier === 'PRO' ? 'indigo' : 'gray'}>{tier}</Badge>
                <button onClick={() => signOut({ callbackUrl: '/' })} className="text-sm font-medium text-red-600">
                  {t('logout')}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-gray-600">
                  {t('login')}
                </Link>
                <Link href="/register" onClick={() => setMobileOpen(false)} className="text-sm font-semibold text-white bg-indigo-600 px-3 py-1.5 rounded-lg">
                  {t('register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
