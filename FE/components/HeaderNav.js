'use client';

import { useState } from 'react';
import Link from 'next/link';
import LanguageSwitcher from './LanguageSwitcher';
import CartIcon from './CartIcon';
import { t } from '@/lib/i18n/getDictionary';

const NAV_LINKS = [
  { href: '/', key: 'nav.home' },
  { href: '/san-pham', key: 'nav.products' },
  { href: '/lien-he', key: 'nav.contact' },
];

export default function HeaderNav({ locale }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center gap-6">
      <nav className="hidden md:flex items-center gap-6">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-text hover:text-primary font-medium transition-colors"
          >
            {t(locale, link.key)}
          </Link>
        ))}
      </nav>

      <div className="hidden md:flex items-center gap-2">
        <CartIcon locale={locale} />
        <LanguageSwitcher locale={locale} />
        <Link
          href="/admin/login"
          className="text-sm border border-primary/40 text-text hover:border-primary hover:text-primary-dark px-3 py-1.5 rounded-xl transition-colors"
        >
          {t(locale, 'nav.login')}
        </Link>
      </div>

      <CartIcon locale={locale} className="md:hidden" />

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t(locale, 'nav.menu')}
        aria-expanded={open}
        className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl border border-primary/40 text-text hover:border-primary hover:text-primary-dark transition-colors"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          {open ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {open && (
        <div className="md:hidden absolute left-0 right-0 top-full bg-background border-b border-primary/10 px-4 py-4 flex flex-col gap-3 shadow-lg z-40">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-text hover:text-primary font-medium transition-colors py-1"
            >
              {t(locale, link.key)}
            </Link>
          ))}
          <div className="flex items-center gap-2 pt-3 border-t border-primary/10">
            <LanguageSwitcher locale={locale} />
            <Link
              href="/admin/login"
              onClick={() => setOpen(false)}
              className="text-sm border border-primary/40 text-text hover:border-primary hover:text-primary-dark px-3 py-1.5 rounded-xl transition-colors"
            >
              {t(locale, 'nav.login')}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
