'use client';

import { NextIntlClientProvider } from 'next-intl';
import { LanguageSync } from './LanguageSync';
import { useLanguageInit } from '../../../hooks/useLanguageInit';

type IntlMessages = Record<string, string | Record<string, string | Record<string, string>>>;

interface AppProvidersProps {
  children: React.ReactNode;
  messages: IntlMessages;
}

export function AppProviders({ children, messages }: AppProvidersProps) {
  useLanguageInit();

  return (
    <NextIntlClientProvider messages={messages}>
      <LanguageSync />
      {children}
    </NextIntlClientProvider>
  );
}