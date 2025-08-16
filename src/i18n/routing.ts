import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';
import { LOCALES, DEFAULT_LOCALE } from '@/lib/locale/config';

export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: 'never', // Don't add locale prefix to URLs
  pathnames: {
    // Map all your routes to the same path for all locales
    '/': '/',
    '/auth': '/auth',
    '/adminPanel': '/adminPanel'
  }
});

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);