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
