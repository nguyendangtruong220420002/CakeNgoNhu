'use client';

import { usePathname } from 'next/navigation';
import SiteHeader from './SiteHeader';
import Footer from './Footer';
import StickyMobileActions from './StickyMobileActions';

export default function SiteChrome({ settings, locale, children }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  const hideFooter =
    pathname.startsWith('/gio-hang') || pathname.startsWith('/san-pham/') || pathname.startsWith('/lien-he');

  if (isAdmin) {
    return children;
  }

  return (
    <>
      <SiteHeader settings={settings} locale={locale} />
      {children}
      {!hideFooter && <Footer settings={settings} locale={locale} />}
      <StickyMobileActions settings={settings} locale={locale} />
    </>
  );
}
