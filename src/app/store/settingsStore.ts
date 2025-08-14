import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Map your internal language codes to next-intl locale codes
export const languageMap = {
  'English': 'en',
  'Ukrainian': 'uk'
} as const;

export const localeMap = {
  'en': 'English',
  'uk': 'Ukrainian'
} as const;

export type Language = keyof typeof languageMap;
export type Locale = keyof typeof localeMap;

interface SettingsState {
  // Existing settings
  language: Language;
  isHydrated: boolean;
  
  // Actions
  setLanguage: (language: Language) => void;
  setLanguageFromLocale: (locale: Locale) => void;
  getCurrentLocale: () => Locale;
  setHydrated: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      // Initial state
      language: 'English',
      isHydrated: false,
      
      // Actions      
      setLanguage: (language: Language) => {
        set({ language });
        // Update the cookie for next-intl
        const locale = languageMap[language];
        document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000`; // 1 year
        // Reload to apply language change
        window.location.reload();
      },

      setLanguageFromLocale: (locale: Locale) => {
        const language = localeMap[locale];
        set({ language });
      },

      getCurrentLocale: () => {
        const { language } = get();
        return languageMap[language];
      },

      setHydrated: () => {
        set({ isHydrated: true });
      },
    }),
    {
      name: 'settings-storage',
      onRehydrateStorage: () => (state) => {
        // Set hydrated to true when rehydration is complete
        state?.setHydrated();
      },
    }
  )
);