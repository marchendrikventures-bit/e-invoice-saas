import { ScrollText } from 'lucide-react';

export function LegalLayout({ title, bodyHtml }: { title: string; bodyHtml: string }) {
  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <ScrollText className="h-5 w-5" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">{title}</h1>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[var(--shadow-card)] p-6 sm:p-10">
          <div className="prose prose-indigo prose-sm sm:prose-base max-w-none" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
        </div>
      </div>
    </div>
  );
}
