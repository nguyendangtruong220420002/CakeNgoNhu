'use client';

import { useRouter } from 'next/navigation';
import { LOCALES, LOCALE_COOKIE } from '@/lib/i18n/config';

export default function LanguageSwitcher({ locale }) {
  const router = useRouter();

  function handleChange(e) {
    const next = e.target.value;
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000`;
    router.refresh();
  }

  return (
    <select
      value={locale}
      onChange={handleChange}
      aria-label="Ngôn ngữ / Language"
      className="text-sm border border-primary/40 text-text bg-transparent rounded-xl px-2 py-1.5 focus:outline-none focus:border-primary"
    >
      {LOCALES.map((l) => (
        <option key={l.code} value={l.code}>
          {l.flag} {l.label}
        </option>
      ))}
    </select>
  );
}
