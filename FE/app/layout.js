import './globals.css';
import SiteChrome from '@/components/SiteChrome';
import { ConfirmProvider } from '@/components/ConfirmProvider';
import { CartProvider } from '@/components/CartProvider';
import { getShopSettings } from '@/lib/api';
import { getServerLocale } from '@/lib/i18n/serverLocale';

export const metadata = {
  title: 'Ngô Như Cake Studio — Tiệm Bánh Kem',
  description: 'Đặt bánh kem online — sinh nhật, cưới, kem tươi, fondant',
};

export default async function RootLayout({ children }) {
  const [settings, locale] = await Promise.all([getShopSettings(), getServerLocale()]);

  return (
    <html lang={locale}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Montserrat:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans">
        <ConfirmProvider>
          <CartProvider>
            <SiteChrome settings={settings} locale={locale}>
              {children}
            </SiteChrome>
          </CartProvider>
        </ConfirmProvider>
      </body>
    </html>
  );
}
