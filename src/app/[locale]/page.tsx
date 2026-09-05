import Link from 'next/link';
import { ArrowRight, FileSpreadsheet, ShieldCheck, FileCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations('Landing');
  return (
    <div className="bg-white">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              {t('title')}
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              {t('subtitle')}
            </p>
            
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/dashboard"
                className="rounded-full bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline flex items-center transition-transform hover:scale-105"
              >
                {t('cta')} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            
            <div className="mt-14 flex items-center justify-center space-x-8 text-gray-400 text-sm font-medium">
              <div className="flex items-center gap-2">
                 <ShieldCheck className="w-5 h-5 text-indigo-500" /> DSGVO Compliant
              </div>
              <div className="flex items-center gap-2">
                 <FileCheck className="w-5 h-5 text-indigo-500" /> EN16931 Ready
              </div>
              <div className="flex items-center gap-2">
                 <FileSpreadsheet className="w-5 h-5 text-indigo-500" /> Factur-X / ZUGFeRD
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">{t('features_title')}</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {t('features_subtitle')}
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <FileSpreadsheet className="h-5 w-5 flex-none text-indigo-600" aria-hidden="true" />
                  {t('feature1_title')}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{t('feature1_desc')}</p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <FileCheck className="h-5 w-5 flex-none text-indigo-600" aria-hidden="true" />
                  {t('feature2_title')}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{t('feature2_desc')}</p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <ShieldCheck className="h-5 w-5 flex-none text-indigo-600" aria-hidden="true" />
                  {t('feature3_title')}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{t('feature3_desc')}</p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
