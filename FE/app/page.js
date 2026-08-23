import { Sparkles } from 'lucide-react';
import Hero from '@/components/Hero';
import FlavorsSection from '@/components/FlavorsSection';
import CtaSection from '@/components/CtaSection';
import FeatureCardsSection from '@/components/FeatureCardsSection';
import IdeaCtaSection from '@/components/IdeaCtaSection';
import ProductCard from '@/components/ProductCard';
import HorizontalScroller from '@/components/HorizontalScroller';
import { getProducts, getShopSettings } from '@/lib/api';
import { getServerLocale } from '@/lib/i18n/serverLocale';
import { t } from '@/lib/i18n/getDictionary';

export default async function HomePage() {
  const [products, locale, settings] = await Promise.all([
    getProducts(),
    getServerLocale(),
    getShopSettings(),
  ]);
  const featured = products.slice(0, 8);

  return (
    <main className="min-h-screen">
      <Hero locale={locale} />
      <FlavorsSection locale={locale} />
      <CtaSection locale={locale} />
      <FeatureCardsSection locale={locale} />

      <section className="px-4 pb-6 max-w-6xl mx-auto">
        <h2 className="font-serif font-bold text-2xl md:text-3xl text-text text-center mb-4 inline-flex items-center gap-3 justify-center w-full">
          <Sparkles className="h-5 w-5 text-accent" aria-hidden="true" />
          {t(locale, 'home.featuredTitle')}
          <Sparkles className="h-5 w-5 text-accent" aria-hidden="true" />
        </h2>

        {featured.length === 0 ? (
          <p className="text-text/60 text-center">{t(locale, 'home.empty')}</p>
        ) : (
          <HorizontalScroller className="overflow-x-auto">
            <div className="grid grid-rows-2 grid-flow-col auto-cols-[42vw] sm:auto-cols-[220px] gap-4 md:gap-6 w-max mx-auto">
              {featured.map((product) => (
                <ProductCard key={product._id} product={product} locale={locale} />
              ))}
            </div>
          </HorizontalScroller>
        )}
      </section>

      <IdeaCtaSection locale={locale} settings={settings} />
    </main>
  );
}
