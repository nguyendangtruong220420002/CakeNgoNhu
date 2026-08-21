'use client';

import { useMemo, useState } from 'react';
import ProductCard from './ProductCard';
import { t } from '@/lib/i18n/getDictionary';

const PRICE_RANGES = [
  { key: 'filter.priceAll', min: 0, max: Infinity },
  { key: 'filter.priceUnder300', min: 0, max: 300000 },
  { key: 'filter.price300to500', min: 300000, max: 500000 },
  { key: 'filter.priceOver500', min: 500000, max: Infinity },
];

function getStartingPrice(product) {
  if (!product.sizes?.length) return null;
  return Math.min(...product.sizes.map((size) => size.price));
}

export default function ProductFilterList({ products, locale }) {
  const categories = useMemo(() => {
    const unique = new Set(products.map((product) => product.category).filter(Boolean));
    return Array.from(unique);
  }, [products]);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedRangeKey, setSelectedRangeKey] = useState(PRICE_RANGES[0].key);
  const selectedRange = PRICE_RANGES.find((r) => r.key === selectedRangeKey);

  const filteredProducts = products.filter((product) => {
    if (selectedCategory !== null && product.category !== selectedCategory) {
      return false;
    }

    const startingPrice = getStartingPrice(product);
    if (startingPrice === null) return true;
    return startingPrice >= selectedRange.min && startingPrice <= selectedRange.max;
  });

  return (
    <div>
      <div className="mb-4">
        <p className="text-text font-medium mb-2">{t(locale, 'filter.categoryLabel')}</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-xl border text-sm transition-colors ${
              selectedCategory === null
                ? 'bg-primary text-white border-primary'
                : 'border-primary/40 text-text hover:border-primary'
            }`}
          >
            {t(locale, 'filter.all')}
          </button>
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-xl border text-sm transition-colors ${
                selectedCategory === category
                  ? 'bg-primary text-white border-primary'
                  : 'border-primary/40 text-text hover:border-primary'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <p className="text-text font-medium mb-2">{t(locale, 'filter.priceLabel')}</p>
        <div className="flex flex-wrap gap-2">
          {PRICE_RANGES.map((range) => (
            <button
              key={range.key}
              type="button"
              onClick={() => setSelectedRangeKey(range.key)}
              className={`px-4 py-2 rounded-xl border text-sm transition-colors ${
                selectedRangeKey === range.key
                  ? 'bg-primary text-white border-primary'
                  : 'border-primary/40 text-text hover:border-primary'
              }`}
            >
              {t(locale, range.key)}
            </button>
          ))}
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <p className="text-text/60 text-center">{t(locale, 'filter.empty')}</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
