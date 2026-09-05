import re

with open('src/app/[locale]/page.tsx', 'r') as f:
    content = f.read()

new_hero = """
    <div className="bg-white overflow-hidden relative">
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#818cf8] to-[#4f46e5] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'}}></div>
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-24 pt-20 sm:pb-32 lg:flex lg:items-center lg:gap-x-10 lg:px-8 lg:pt-32 lg:pb-40">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-lg lg:flex-shrink-0">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            {t('title')}
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            {t('subtitle')}
          </p>
          
          <div className="mt-10 flex items-center gap-x-6">
            <Link
              href="/dashboard"
              className="rounded-full bg-indigo-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline flex items-center transition-transform hover:scale-105"
            >
              {t('cta')} <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          
          <div className="mt-14 flex items-center gap-x-6 text-gray-500 text-sm font-medium">
            <div className="flex items-center gap-2">
               <ShieldCheck className="w-5 h-5 text-indigo-500" /> DSGVO Compliant
            </div>
            <div className="flex items-center gap-2">
               <FileCheck className="w-5 h-5 text-indigo-500" /> EN16931
            </div>
            <div className="flex items-center gap-2">
               <FileSpreadsheet className="w-5 h-5 text-indigo-500" /> ZUGFeRD
            </div>
          </div>
        </div>
        
        <div className="mx-auto mt-16 lg:mt-0 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:max-w-none lg:flex-none xl:ml-32">
          <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
            <div className="rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
              <div className="bg-white rounded-lg shadow-2xl ring-1 ring-gray-900/10 overflow-hidden w-full max-w-[600px] h-[400px] flex flex-col relative hidden sm:flex">
                 <div className="h-12 border-b bg-gray-50 flex items-center px-4 space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    <div className="ml-4 h-6 w-48 bg-white rounded-md border text-xs flex items-center px-2 text-gray-400 font-mono">eu-invoice.app/dashboard</div>
                 </div>
                 <div className="flex-1 flex bg-gray-50">
                   <div className="w-40 border-r bg-white p-4 space-y-4">
                     <div className="h-4 w-20 bg-indigo-100 rounded"></div>
                     <div className="h-4 w-full bg-gray-100 rounded"></div>
                     <div className="h-4 w-full bg-gray-100 rounded"></div>
                     <div className="h-4 w-2/3 bg-gray-100 rounded"></div>
                   </div>
                   <div className="flex-1 p-6">
                     <div className="flex justify-between items-center mb-6">
                       <div className="h-6 w-32 bg-gray-800 rounded"></div>
                       <div className="h-8 w-24 bg-indigo-600 rounded-md"></div>
                     </div>
                     <div className="bg-white border rounded-lg overflow-hidden">
                       <div className="h-10 bg-gray-50 border-b flex items-center px-4">
                         <div className="h-3 w-16 bg-gray-300 rounded mr-auto"></div>
                         <div className="h-3 w-12 bg-gray-300 rounded mx-4"></div>
                         <div className="h-3 w-12 bg-gray-300 rounded"></div>
                       </div>
                       {[1,2,3].map(i => (
                         <div key={i} className="h-12 border-b flex items-center px-4">
                           <div className="h-3 w-32 bg-gray-200 rounded mr-auto"></div>
                           <div className="h-3 w-8 bg-gray-200 rounded mx-4"></div>
                           <div className="h-3 w-12 bg-gray-200 rounded"></div>
                         </div>
                       ))}
                     </div>
                     <div className="mt-4 flex justify-end">
                       <div className="h-4 w-32 bg-gray-200 rounded"></div>
                     </div>
                   </div>
                 </div>
                 
                 <div className="absolute -right-6 -bottom-6 bg-white p-4 rounded-xl shadow-xl border flex items-center space-x-3 hidden md:flex">
                   <div className="bg-green-100 p-2 rounded-full"><ShieldCheck className="w-6 h-6 text-green-600"/></div>
                   <div>
                     <div className="text-sm font-bold text-gray-900">Valid Factur-X / ZUGFeRD</div>
                     <div className="text-xs text-gray-500">XML embedded successfully</div>
                   </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
"""

old_hero_start = '<div className="bg-white">'
old_hero_end = '      <div className="bg-gray-50 py-24 sm:py-32">'

content = content.replace(content[content.find(old_hero_start):content.find(old_hero_end)], new_hero)

with open('src/app/[locale]/page.tsx', 'w') as f:
    f.write(content)

