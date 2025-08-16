'use client';

import { useEffect } from 'react';
import { useSettingsStore } from '@/app/store/settingsStore';
import { getCurrentLocale, initializeLocaleIfNeeded } from '@/lib/locale/client';

/**
 * Hook to initialize and manage locale settings
 */
export function useLocale() {
  const { locale, setLocale: setStoreLocale, isHydrated } = useSettingsStore();

  useEffect(() => {
    // Initialize locale on client side with auto-detection
    const currentLocale = initializeLocaleIfNeeded();
    
    if (currentLocale !== locale) {
      useSettingsStore.setState({ locale: currentLocale });
    }
  }, [locale]);

  const setLocale = (newLocale: typeof locale) => {
    setStoreLocale(newLocale);
  };

  return {
    locale,
    setLocale,
    isHydrated
  };
}