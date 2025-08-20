'use client';

import { AbstractIntlMessages, NextIntlClientProvider } from 'next-intl';
import { LanguageSync } from './LanguageSync';
import { useLanguageInit } from '@/hooks/useLanguageInit';

interface AppProvidersProps {
  children: React.ReactNode;
  messages: AbstractIntlMessages;
  locale: string;
}

export function AppProviders({ children, messages, locale }: AppProvidersProps) {
  useLanguageInit();

  return (
    <NextIntlClientProvider messages={messages} locale={locale} timeZone="Europe/Kiev">
      <LanguageSync />
      {children}
    </NextIntlClientProvider>
  );
}