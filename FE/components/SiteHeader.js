import Link from 'next/link';
import Logo from './Logo';
import HeaderNav from './HeaderNav';

export default function SiteHeader({ settings, locale }) {
  return (
    <header className="relative px-4 py-2 flex items-center justify-between gap-3 border-b border-primary/10">
      <Link href="/" aria-label={settings?.shopName || 'Ngô Như Cake Studio'}>
        <Logo size={48} />
      </Link>
      <HeaderNav locale={locale} />
    </header>
  );
}
