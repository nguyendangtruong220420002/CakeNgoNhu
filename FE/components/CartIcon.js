'use client';

import Link from 'next/link';
import { useCart } from './CartProvider';
import { t } from '@/lib/i18n/getDictionary';

export default function CartIcon({ locale, className = '' }) {
  const { totalItems } = useCart();

  return (
    <Link
      href="/gio-hang"
      aria-label={t(locale, 'cart.title')}
      className={`relative inline-flex items-center justify-center w-10 h-10 rounded-xl border border-primary/40 text-text hover:border-primary hover:text-primary-dark transition-colors shrink-0 ${className}`}
    >
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.35 2.7A1 1 0 006.55 17H17m-10 0a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4z"
        />
      </svg>
      {totalItems > 0 && (
        <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center leading-none">
          {totalItems}
        </span>
      )}
    </Link>
  );
}
