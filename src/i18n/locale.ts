import {cookies} from 'next/headers';
import { localeMap } from '@/app/store/settingsStore';

const COOKIE_NAME = 'NEXT_LOCALE';

export async function getUserLocale() {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(COOKIE_NAME)?.value;
  
  // Check if the locale from cookie exists in our locale map
  if (cookieLocale && cookieLocale in localeMap) {
    return cookieLocale;
  }
  
  // If cookie locale is invalid or doesn't exist, return default
  return 'uk';
}

export async function setUserLocale(locale: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, locale);
}
