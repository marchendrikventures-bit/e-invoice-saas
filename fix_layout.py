import re

with open('src/app/[locale]/layout.tsx', 'r') as f:
    content = f.read()

if 'import { Inter } from' not in content:
    content = content.replace("import type { Metadata } from 'next';", "import type { Metadata } from 'next';\nimport { Inter } from 'next/font/google';")
    content = content.replace("export const metadata:", "const inter = Inter({ subsets: ['latin'] });\n\nexport const metadata:")
    content = content.replace('className={`min-h-screen bg-gray-50 flex flex-col font-sans`}', 'className={`min-h-screen bg-[#fafafa] flex flex-col font-sans ${inter.className}`}')

with open('src/app/[locale]/layout.tsx', 'w') as f:
    f.write(content)
