import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'uk'],

  // Used when no locale matches
  defaultLocale: 'uk',

  // The locale prefix strategy
  localePrefix: 'never' // Don't add locale prefix to URLs
});

// Lightweight wrappers around Next.js' navigation APIs
export const {Link, redirect, usePathname, useRouter} = createNavigation(routing);
