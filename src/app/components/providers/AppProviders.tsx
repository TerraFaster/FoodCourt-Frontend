'use client';

import { NextIntlClientProvider } from 'next-intl';
import type { AbstractIntlMessages } from 'next-intl';
import { LanguageSync } from './LanguageSync';
import { useLocale } from '@/hooks/useLocale';
import { ReactNode } from 'react';

interface AppProvidersProps {
  children: ReactNode;
  messages: AbstractIntlMessages;
  locale: string; // Add locale prop
}

export function AppProviders({ children, messages, locale }: AppProvidersProps) {
  // Initialize locale on app start
  useLocale();

  return (
    <NextIntlClientProvider messages={messages} locale={locale} timeZone="Europe/Kiev">
      <LanguageSync />
      {children}
    </NextIntlClientProvider>
  );
}