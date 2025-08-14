'use client';

import { useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useSettingsStore, localeMap } from '../../store/settingsStore';

export function LanguageSync() {
  const locale = useLocale() as 'en' | 'uk';
  const { setLanguageFromLocale, getCurrentLocale } = useSettingsStore();

  useEffect(() => {
    // Sync the store with the current locale
    const currentStoreLocale = getCurrentLocale();
    if (currentStoreLocale !== locale) {
      setLanguageFromLocale(locale);
    }
  }, [locale, setLanguageFromLocale, getCurrentLocale]);

  return null;
}