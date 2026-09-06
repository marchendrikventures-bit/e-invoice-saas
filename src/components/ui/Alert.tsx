import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

type Kind = 'error' | 'success' | 'warning' | 'info';

const STYLES: Record<Kind, { wrap: string; icon: React.ReactNode }> = {
  error: {
    wrap: 'bg-red-50 text-red-700 ring-1 ring-red-100',
    icon: <AlertCircle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />,
  },
  success: {
    wrap: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100',
    icon: <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />,
  },
  warning: {
    wrap: 'bg-amber-50 text-amber-800 ring-1 ring-amber-100',
    icon: <AlertCircle className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />,
  },
  info: {
    wrap: 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100',
    icon: <Info className="h-4 w-4 shrink-0 text-indigo-500 mt-0.5" />,
  },
};

export function Alert({ kind = 'info', children, className = '' }: { kind?: Kind; children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex items-start gap-2.5 rounded-lg px-4 py-3 text-sm font-medium ${STYLES[kind].wrap} ${className}`}>
      {STYLES[kind].icon}
      <div>{children}</div>
    </div>
  );
}
