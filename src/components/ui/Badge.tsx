type BadgeColor = 'indigo' | 'green' | 'gray' | 'amber' | 'red' | 'dark';

const COLORS: Record<BadgeColor, string> = {
  indigo: 'bg-indigo-50 text-indigo-700 ring-indigo-600/20',
  green: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  gray: 'bg-gray-100 text-gray-600 ring-gray-500/10',
  amber: 'bg-amber-50 text-amber-800 ring-amber-600/20',
  red: 'bg-red-50 text-red-700 ring-red-600/10',
  dark: 'bg-gray-900 text-white ring-gray-900',
};

export function Badge({
  children,
  color = 'gray',
  className = '',
}: {
  children: React.ReactNode;
  color?: BadgeColor;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${COLORS[color]} ${className}`}
    >
      {children}
    </span>
  );
}
