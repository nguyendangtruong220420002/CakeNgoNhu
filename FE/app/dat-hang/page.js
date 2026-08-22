import { notFound } from 'next/navigation';
import { getProductById } from '@/lib/api';
import OrderForm from '@/components/OrderForm';
import { getServerLocale } from '@/lib/i18n/serverLocale';

export const metadata = {
  title: 'Đặt bánh — Ngô Như Cake Studio',
};

export default async function OrderPage({ searchParams }) {
  const params = await searchParams;
  const productId = params.productId;

  if (!productId) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <h1 className="font-serif text-2xl text-text mb-2">Chưa chọn mẫu bánh</h1>
        <p className="text-text/70 mb-6">Vui lòng chọn một mẫu bánh trước khi đặt hàng.</p>
        <a
          href="/san-pham"
          className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl transition-colors"
        >
          Xem danh mục mẫu bánh
        </a>
      </main>
    );
  }

  const [product, locale] = await Promise.all([getProductById(productId), getServerLocale()]);

  if (!product) {
    notFound();
  }

  const parsedQty = Number(params.qty);
  const initialQuantity = Number.isFinite(parsedQty) && parsedQty > 0 ? parsedQty : 1;

  return (
    <main className="min-h-screen px-4 py-8 md:py-12 max-w-2xl mx-auto pb-24 md:pb-12">
      <h1 className="font-serif text-2xl md:text-3xl text-text text-center mb-8">Đặt bánh</h1>
      <OrderForm
        product={product}
        initialSizeLabel={params.size}
        initialQuantity={initialQuantity}
        initialImage={params.image}
        locale={locale}
      />
    </main>
  );
}
