import { DEFAULT_LOCALE } from './config';

export function pickLocalized(field, locale) {
  if (!field) return '';
  return field[locale] || field[DEFAULT_LOCALE] || '';
}
