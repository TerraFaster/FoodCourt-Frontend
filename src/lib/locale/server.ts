// src/lib/locale/server.ts - Enhanced server utilities with auto-detection
import { cookies } from 'next/headers';
import { headers } from 'next/headers';
import { LOCALES, DEFAULT_LOCALE, COOKIE_NAME, type Locale } from './config';

/**
 * Detects locale from Accept-Language header
 */
function detectLocaleFromHeaders(acceptLanguage?: string): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE;
  
  const languages = acceptLanguage
    .split(',')
    .map(lang => lang.split(';')[0].trim().toLowerCase());
  
  for (const lang of languages) {
    if (lang.startsWith('uk') || lang.startsWith('ua')) {
      return 'uk';
    }
    if (lang.startsWith('en')) {
      return 'en';
    }
  }
  
  return DEFAULT_LOCALE;
}

/**
 * Gets server locale with auto-detection and cookie setting
 */
export async function getServerLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const headersList = await headers();
  const existingCookie = cookieStore.get(COOKIE_NAME)?.value as Locale;
  
  // If cookie exists and is valid, use it
  if (existingCookie && LOCALES.includes(existingCookie)) {
    return existingCookie;
  }
  
  // No cookie or invalid cookie - detect from browser headers
  const acceptLanguage = headersList.get('accept-language');
  const detectedLocale = detectLocaleFromHeaders(acceptLanguage ?? undefined);
  
  // Set the cookie for future visits
  cookieStore.set(COOKIE_NAME, detectedLocale, {
    path: '/',
    maxAge: 31536000, // 1 year
    sameSite: 'lax',
    httpOnly: false // Allow client-side access for language switching
  });
  
  return detectedLocale;
}

/**
 * Manually set server locale (for API routes, etc.)
 */
export async function setServerLocale(locale: Locale) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, locale, {
    path: '/',
    maxAge: 31536000,
    sameSite: 'lax',
    httpOnly: false
  });
}