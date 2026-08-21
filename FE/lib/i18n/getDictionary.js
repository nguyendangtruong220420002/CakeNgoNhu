import vi from './dictionaries/vi.json';
import en from './dictionaries/en.json';
import zh from './dictionaries/zh.json';
import ko from './dictionaries/ko.json';
import ja from './dictionaries/ja.json';

const DICTIONARIES = { vi, en, zh, ko, ja };

export function getDictionary(locale) {
  return DICTIONARIES[locale] || DICTIONARIES.vi;
}

export function t(locale, key) {
  const dict = getDictionary(locale);
  return dict[key] || key;
}
