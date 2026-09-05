import re

with open('src/app/[locale]/page.tsx', 'r') as f:
    content = f.read()

# Add a trust signal below the CTA
trust_signal = """
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
"""

content = re.sub(r'<div className="mt-10 flex items-center justify-center gap-x-6">.*?</div>', trust_signal, content, flags=re.DOTALL)

with open('src/app/[locale]/page.tsx', 'w') as f:
    f.write(content)

