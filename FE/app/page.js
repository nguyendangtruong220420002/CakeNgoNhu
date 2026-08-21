import Hero from '@/components/Hero';
import ProductCard from '@/components/ProductCard';
import StickyMobileActions from '@/components/StickyMobileActions';
import { getProducts } from '@/lib/api';

export default async function HomePage() {
  const products = await getProducts();
  const featured = products.slice(0, 8);

  return (
    <>
      <main className="min-h-screen pb-24 md:pb-0">
        <Hero />

        <section className="px-4 pb-16 max-w-6xl mx-auto">
          <h2 className="font-serif text-2xl md:text-3xl text-text text-center mb-8">
            Mẫu bánh nổi bật
          </h2>

          {featured.length === 0 ? (
            <p className="text-text/60 text-center">
              Chưa có mẫu bánh nào. Vui lòng quay lại sau.
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {featured.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </section>
      </main>

      <StickyMobileActions />
    </>
  );
}
