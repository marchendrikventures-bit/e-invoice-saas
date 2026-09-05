import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['en', 'de', 'fr'],
  defaultLocale: 'de',
  localePrefix: 'as-needed' // Only /en and /fr will have prefix, /de will be default (or use always)
});

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
