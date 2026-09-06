import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/app/globals.css';
import Navbar from '@/components/Navbar';
import CookieBanner from '@/components/CookieBanner';
import { Link } from '@/i18n/routing';
import NextAuthProvider from '@/components/NextAuthProvider';
import { ToastProvider } from '@/components/ui/Toast';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'eu-invoice.app',
  description: 'Generate EN16931 compliant E-Invoices from CSV or Excel files.',
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound();
  }
  
  const messages = await getMessages();
  const t = await getTranslations({locale, namespace: 'Footer'});

  return (
    <html lang={locale} className={inter.variable}>
      <body className="min-h-screen bg-[var(--background)] flex flex-col font-sans antialiased">
        <NextAuthProvider>
          <NextIntlClientProvider messages={messages}>
            <ToastProvider>
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-md focus:bg-indigo-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
              >
                Skip to content
              </a>
              <Navbar />
              <main id="main-content" className="flex-grow">
                {children}
              </main>
              <footer className="bg-white border-t border-gray-200 mt-auto">
                <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-sm text-gray-400 order-2 sm:order-1">
                    &copy; {new Date().getFullYear()} eu-invoice.app
                  </p>
                  <div className="flex justify-center gap-6 order-1 sm:order-2">
                    <Link href="/impressum" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                      {t('impressum')}
                    </Link>
                    <Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                      {t('privacy')}
                    </Link>
                    <Link href="/avv" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                      {t('avv')}
                    </Link>
                    <Link href="/accessibility" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                      {t('accessibility')}
                    </Link>
                  </div>
                </div>
              </footer>
              <CookieBanner />
            </ToastProvider>
          </NextIntlClientProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
