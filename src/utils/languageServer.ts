import { Locale } from "@/app/store/settingsStore";
import { cookies, headers } from "next/headers";

/**
 * Detects the user's preferred locale from the "Accept-Language" header
 */
export function detectLocaleFromHeaders(acceptLanguage?: string): Locale {
  if (!acceptLanguage) return "uk";
  
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
  
  return "uk";
}

/**
 * Gets the current locale from cookie or browser detection
 */
export async function getServerLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const headersList = await headers();
  const existingCookie = cookieStore.get("NEXT_LOCALE")?.value as Locale;

  const locales = ['en', 'uk'];

  // If cookie exists and is valid, use it
  if (existingCookie && locales.includes(existingCookie)) {
    return existingCookie;
  }
  
  // No cookie or invalid cookie - detect from browser headers
  const acceptLanguage = headersList.get('accept-language');
  const detectedLocale = detectLocaleFromHeaders(acceptLanguage ?? undefined);
  
  return detectedLocale;
}
