import { FileStack, ShieldCheck } from 'lucide-react';
import { Link } from '@/i18n/routing';

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50 via-white to-white">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20 mb-4">
            <FileStack className="h-5.5 w-5.5" strokeWidth={2.25} />
          </Link>
          <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900">{title}</h2>
          {subtitle && <p className="mt-2 text-center text-sm text-gray-500 max-w-xs">{subtitle}</p>}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-[var(--shadow-card)] p-6 sm:p-8">
          {children}
        </div>

        <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-gray-400">
          <ShieldCheck className="h-3.5 w-3.5" />
          DSGVO-compliant &middot; EU-hosted
        </div>

        {footer}
      </div>
    </div>
  );
}
