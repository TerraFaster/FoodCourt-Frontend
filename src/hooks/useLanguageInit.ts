'use client';

import { useEffect } from 'react';
import { useSettingsStore } from '../app/store/settingsStore';
import { initializeLanguage, getCurrentLocale } from '../utils/language';

/**
 * Hook to initialize language settings on app start
 */
export function useLanguageInit() {
  const { setLanguageFromLocale } = useSettingsStore();

  useEffect(() => {
    // Initialize language on client side
    initializeLanguage();
    
    // Sync store with current locale
    const currentLocale = getCurrentLocale();
    setLanguageFromLocale(currentLocale);
  }, [setLanguageFromLocale]);
}