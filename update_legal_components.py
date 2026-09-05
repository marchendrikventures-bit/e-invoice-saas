import os

pages = ['impressum', 'privacy', 'avv']

for page in pages:
    path = f'src/app/[locale]/{page}/page.tsx'
    content = f"""import {{ useTranslations }} from 'next-intl';

export default function {page.capitalize()}Page() {{
  const t = useTranslations('Legal');
  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-6 lg:px-8 prose prose-indigo">
        <h1>{{t('{page}_title')}}</h1>
        <div dangerouslySetInnerHTML={{{{ __html: t('{page}_body') }}}} />
      </div>
    </div>
  );
}}
"""
    with open(path, 'w') as f:
        f.write(content)

