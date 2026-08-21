import Hero from '@/components/Hero';
import ProductCard from '@/components/ProductCard';
import { getProducts } from '@/lib/api';
import { getServerLocale } from '@/lib/i18n/serverLocale';
import { t } from '@/lib/i18n/getDictionary';

export default async function HomePage() {
  const [products, locale] = await Promise.all([getProducts(), getServerLocale()]);
  const featured = products.slice(0, 8);

  return (
    <main className="min-h-screen pb-24 md:pb-0">
      <Hero locale={locale} />

      <section className="px-4 pb-16 max-w-6xl mx-auto">
        <h2 className="font-serif text-2xl md:text-3xl text-text text-center mb-8">
          {t(locale, 'home.featuredTitle')}
        </h2>

        {featured.length === 0 ? (
          <p className="text-text/60 text-center">{t(locale, 'home.empty')}</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featured.map((product) => (
              <ProductCard key={product._id} product={product} locale={locale} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
