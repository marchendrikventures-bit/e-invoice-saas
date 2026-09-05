import re

with open('src/app/[locale]/dashboard/page.tsx', 'r') as f:
    content = f.read()

# Replace plain h2 headers and lists with card-based designs with shadow
content = content.replace('className="bg-white shadow sm:rounded-lg mb-8"', 'className="bg-white shadow-md sm:rounded-xl mb-8 border border-gray-100"')
content = content.replace('className="px-4 py-5 sm:p-6"', 'className="px-6 py-8"')
content = content.replace('className="text-lg font-medium leading-6 text-gray-900 mb-4"', 'className="text-xl font-semibold leading-7 text-gray-900 mb-6 border-b pb-3"')

# If they weren't matched perfectly, just do a more aggressive regex
content = re.sub(r'bg-white shadow sm:rounded-lg', 'bg-white shadow-md sm:rounded-xl border border-gray-100', content)
content = re.sub(r'px-4 py-5 sm:p-6', 'px-6 py-6', content)
content = re.sub(r'text-lg font-medium leading-6 text-gray-900', 'text-xl font-semibold text-gray-900', content)

with open('src/app/[locale]/dashboard/page.tsx', 'w') as f:
    f.write(content)

