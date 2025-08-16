import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  type Locale, 
  LOCALE_LABELS, 
  DEFAULT_LOCALE
} from '@/lib/locale/config';
import { getCurrentLocale, setLocaleCookie } from '@/lib/locale/client';

interface SettingsState {
  locale: Locale;
  isHydrated: boolean;
  
  // Actions
  setLocale: (locale: Locale) => void;
  getLocaleLabel: () => string;
  setHydrated: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      // Initial state
      locale: DEFAULT_LOCALE,
      isHydrated: false,
      
      // Actions      
      setLocale: (locale: Locale) => {
        set({ locale });
        setLocaleCookie(locale);
      },

      getLocaleLabel: () => {
        const { locale } = get();
        return LOCALE_LABELS[locale];
      },

      setHydrated: () => {
        set({ isHydrated: true });
      },
    }),
    {
      name: 'settings-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Sync with current cookie locale on hydration
          const currentLocale = getCurrentLocale();
          state.locale = currentLocale;
          state.setHydrated();
        }
      },
    }
  )
);