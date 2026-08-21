import { getProducts } from '@/lib/api';
import ProductFilterList from '@/components/ProductFilterList';

export const metadata = {
  title: 'Danh mục mẫu bánh — CakeNgonNhu',
};

export default async function ProductListPage() {
  const products = await getProducts();

  return (
    <main className="min-h-screen px-4 py-8 md:py-12 max-w-6xl mx-auto pb-24 md:pb-12">
      <h1 className="font-serif text-2xl md:text-3xl text-text text-center mb-8">
        Danh mục mẫu bánh
      </h1>
      <ProductFilterList products={products} />
    </main>
  );
}
