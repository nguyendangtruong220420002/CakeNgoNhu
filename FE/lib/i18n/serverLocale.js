import { cookies } from 'next/headers';
import { DEFAULT_LOCALE, LOCALE_COOKIE, isValidLocale } from './config';

export async function getServerLocale() {
  const cookieStore = await cookies();
  const value = cookieStore.get(LOCALE_COOKIE)?.value;
  return isValidLocale(value) ? value : DEFAULT_LOCALE;
}
