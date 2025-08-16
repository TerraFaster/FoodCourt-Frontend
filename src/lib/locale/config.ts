export const LOCALES = ['en', 'uk'] as const;
export const DEFAULT_LOCALE = 'uk' as const;
export const COOKIE_NAME = 'NEXT_LOCALE' as const;

export type Locale = typeof LOCALES[number];

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  uk: 'Українська'
} as const;