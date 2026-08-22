import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProductById } from '@/lib/api';
import ProductDetailView from '@/components/ProductDetailView';
import { getServerLocale } from '@/lib/i18n/serverLocale';
import { pickLocalized } from '@/lib/i18n/localizedText';
import { t } from '@/lib/i18n/getDictionary';

export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  const [product, locale] = await Promise.all([getProductById(id), getServerLocale()]);

  if (!product) {
    notFound();
  }

  const name = pickLocalized(product.name, locale);
  const description = pickLocalized(product.description, locale);

  return (
    <main className="min-h-screen px-4 pt-6 pb-8 md:pt-8 md:pb-12 max-w-5xl mx-auto">
      <Link
        href="/san-pham"
        className="inline-flex items-center gap-1 text-text/70 hover:text-primary transition-colors mb-4"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        {t(locale, 'detail.back')}
      </Link>
      <ProductDetailView product={product} locale={locale} name={name} description={description} />
    </main>
  );
}
