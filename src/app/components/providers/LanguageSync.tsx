'use client';

import { useEffect, useState } from 'react';
import { useLocale } from '@/hooks/useLocale';
import { initializeLocaleIfNeeded } from '@/lib/locale/client';

/**
 * Component to initialize and sync locale state
 */
export function LanguageSync() {
  const { locale, isHydrated } = useLocale();
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    if (!isInitialized) {
      // Ensure locale is initialized on first visit
      initializeLocaleIfNeeded();
      setIsInitialized(true);
    }
  }, [isInitialized]);
  
  return null;
}