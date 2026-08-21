import Link from 'next/link';
import Logo from './Logo';
import LanguageSwitcher from './LanguageSwitcher';
import { t } from '@/lib/i18n/getDictionary';

export default function SiteHeader({ settings, locale }) {
  return (
    <header className="px-4 py-3 flex items-center justify-between gap-3 border-b border-primary/10">
      <Link href="/" aria-label={settings?.shopName || 'Ngô Như Cake Studio'}>
        <Logo size={48} />
      </Link>
      <div className="flex items-center gap-2">
        <LanguageSwitcher locale={locale} />
        <Link
          href="/admin/login"
          className="text-sm border border-primary/40 text-text hover:border-primary hover:text-primary-dark px-3 py-1.5 rounded-xl transition-colors"
        >
          {t(locale, 'nav.login')}
        </Link>
      </div>
    </header>
  );
}
