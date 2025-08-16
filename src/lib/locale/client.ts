import { LOCALES, DEFAULT_LOCALE, COOKIE_NAME, type Locale } from './config';

/**
 * Detects user's preferred locale from browser settings
 */
export function detectBrowserLocale(): Locale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE;
  
  const browserLanguages = navigator.languages || [navigator.language];
  
  for (const lang of browserLanguages) {
    const normalizedLang = lang.toLowerCase();
    if (normalizedLang.startsWith('uk') || normalizedLang.startsWith('ua')) {
      return 'uk';
    }
    if (normalizedLang.startsWith('en')) {
      return 'en';
    }
  }
  
  return DEFAULT_LOCALE;
}

/**
 * Gets current locale from cookie with auto-detection fallback
 */
export function getCurrentLocale(): Locale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE;
  
  const cookieLocale = document.cookie
    .split('; ')
    .find(row => row.startsWith(`${COOKIE_NAME}=`))
    ?.split('=')[1] as Locale;
  
  if (cookieLocale && LOCALES.includes(cookieLocale)) {
    return cookieLocale;
  }
  
  // No cookie found - detect and set
  const detectedLocale = detectBrowserLocale();
  setLocaleCookie(detectedLocale, false); // Don't reload on initial detection
  
  return detectedLocale;
}

/**
 * Sets locale cookie and optionally reloads page
 */
export function setLocaleCookie(locale: Locale, reload: boolean = true) {
  if (typeof window === 'undefined') return;
  
  document.cookie = `${COOKIE_NAME}=${locale}; path=/; max-age=31536000; SameSite=Lax`;
  
  if (reload) {
    window.location.reload();
  }
}

/**
 * Checks if locale cookie exists
 */
export function hasLocaleCookie(): boolean {
  if (typeof window === 'undefined') return false;
  
  return document.cookie.includes(`${COOKIE_NAME}=`);
}

/**
 * Initializes locale if no cookie exists (client-side)
 */
export function initializeLocaleIfNeeded(): Locale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE;
  
  if (!hasLocaleCookie()) {
    const detectedLocale = detectBrowserLocale();
    setLocaleCookie(detectedLocale, false);
    return detectedLocale;
  }
  
  return getCurrentLocale();
}