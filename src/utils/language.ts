import { languageMap, localeMap, type Language, type Locale } from '../app/store/settingsStore';

/**
 * Detects the user's preferred language based on browser settings
 */
export function detectBrowserLanguage(): Language {
  if (typeof window === 'undefined') return 'English';

  const browserLang = navigator.language.toLowerCase();

  // Список всех славянских языков (ISO коды)
  const slavicLangs = [
    'uk', // Ukrainian
    'ru', // Russian
    'be', // Belarusian
    'pl', // Polish
    'cs', // Czech
    'sk', // Slovak
    'sl', // Slovenian
    'hr', // Croatian
    'sr', // Serbian
    'bs', // Bosnian
    'bg', // Bulgarian
    'mk'  // Macedonian
  ];

  // Проверяем, начинается ли язык с одного из славянских кодов
  if (slavicLangs.some(code => browserLang.startsWith(code))) {
    return 'Ukrainian';
  }

  return 'English'; // Все остальные считаем английским
}


export function languageToLocale(language: Language): Locale {
  switch (language) {
    case 'English':
      return 'en';
    case 'Ukrainian':
      return 'uk';
    default:
      return 'en';
  }
}

/**
 * Gets the current locale from cookie or browser detection
 */
export function getCurrentLocale(): Locale {
  if (typeof window === 'undefined') return 'en';
  
  // Check cookie first
  const cookieLocale = document.cookie
    .split('; ')
    .find(row => row.startsWith('NEXT_LOCALE='))
    ?.split('=')[1];
  
  if (cookieLocale && (cookieLocale === 'en' || cookieLocale === 'uk')) {
    return cookieLocale as Locale;
  }
  
  // Fallback to browser detection
  const detectedLanguage = detectBrowserLanguage();
  return languageMap[detectedLanguage];
}

/**
 * Sets the language cookie and optionally reloads the page
 */
export function setLanguageCookie(locale: Locale, reload: boolean = true) {
  document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000`; // 1 year
  
  if (reload) {
    window.location.reload();
  }
}

/**
 * Initialize language on app start
 */
export function initializeLanguage() {
  if (typeof window === 'undefined') return;
  
  const currentLocale = getCurrentLocale();
  
  // Set cookie if not exists
  if (!document.cookie.includes('NEXT_LOCALE=')) {
    setLanguageCookie(currentLocale, false);
  }
}