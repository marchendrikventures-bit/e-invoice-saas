import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/app/globals.css';
import Navbar from '@/components/Navbar';
import CookieBanner from '@/components/CookieBanner';
import { Link } from '@/i18n/routing';
import NextAuthProvider from '@/components/NextAuthProvider';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'European E-Invoice Generator',
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
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }
  
  const messages = await getMessages();
  const t = await getTranslations({locale, namespace: 'Footer'});

  return (
    <html lang={locale}>
      <body className={`min-h-screen bg-[#fafafa] flex flex-col font-sans ${inter.className}`}>
        <NextAuthProvider>
          <NextIntlClientProvider messages={messages}>
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <footer className="bg-white border-t border-gray-200 mt-auto">
              <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-center space-x-6">
                <Link href="/impressum" className="text-sm text-gray-500 hover:text-gray-900">
                  {t('impressum')}
                </Link>
                <Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-900">
                  {t('privacy')}
                </Link>
                <Link href="/avv" className="text-sm text-gray-500 hover:text-gray-900">
                  {t('avv')}
                </Link>
              </div>
            </footer>
            <CookieBanner />
          </NextIntlClientProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
