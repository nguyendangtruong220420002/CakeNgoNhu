'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LogoutButton from './LogoutButton';

export default function AdminHeaderAction() {
  const pathname = usePathname();
  const isHome = pathname === '/admin';

  if (isHome) {
    return <LogoutButton />;
  }

  return (
    <Link
      href="/admin"
      aria-label="Quay lại"
      title="Quay lại"
      className="inline-flex items-center justify-center w-10 h-10 text-text bg-white border border-primary/40 shadow-sm hover:border-primary hover:text-primary-dark rounded-xl transition-colors"
    >
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
    </Link>
  );
}
