import CartView from '@/components/CartView';
import { getServerLocale } from '@/lib/i18n/serverLocale';

export const metadata = {
  title: 'Giỏ hàng — Ngô Như Cake Studio',
};

export default async function CartPage() {
  const locale = await getServerLocale();

  return (
    <main className="min-h-screen px-4 pt-4 pb-[150px] md:pt-8 md:pb-12 max-w-2xl mx-auto">
      <CartView locale={locale} />
    </main>
  );
}
