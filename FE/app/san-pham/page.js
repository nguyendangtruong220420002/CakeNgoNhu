import { getProducts, getShopSettings } from '@/lib/api';
import ProductFilterList from '@/components/ProductFilterList';
import IdeaCtaSection from '@/components/IdeaCtaSection';
import FeatureCardsSection from '@/components/FeatureCardsSection';
import { getServerLocale } from '@/lib/i18n/serverLocale';
import { t } from '@/lib/i18n/getDictionary';

export const metadata = {
  title: 'Danh mục mẫu bánh — Ngô Như Cake Studio',
};

export default async function ProductListPage() {
  const [products, locale, settings] = await Promise.all([
    getProducts(),
    getServerLocale(),
    getShopSettings(),
  ]);

  return (
    <>
      <main className="min-h-screen px-4 pt-4 pb-8 md:pt-8 md:pb-12 max-w-6xl mx-auto">
        <h1 className="font-serif text-2xl md:text-3xl text-text text-center mb-6">
          {t(locale, 'category.title')}
        </h1>
        <ProductFilterList products={products} locale={locale} />
      </main>

      <IdeaCtaSection locale={locale} settings={settings} maxWidth="max-w-6xl" />
      <FeatureCardsSection locale={locale} maxWidth="max-w-6xl" />
    </>
  );
}
