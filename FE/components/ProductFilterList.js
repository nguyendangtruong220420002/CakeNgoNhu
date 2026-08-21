'use client';

import { useMemo, useState } from 'react';
import ProductCard from './ProductCard';

const PRICE_RANGES = [
  { label: 'Tất cả mức giá', min: 0, max: Infinity },
  { label: 'Dưới 300k', min: 0, max: 300000 },
  { label: '300k - 500k', min: 300000, max: 500000 },
  { label: 'Trên 500k', min: 500000, max: Infinity },
];

function getStartingPrice(product) {
  if (!product.sizes?.length) return null;
  return Math.min(...product.sizes.map((size) => size.price));
}

export default function ProductFilterList({ products }) {
  const categories = useMemo(() => {
    const unique = new Set(products.map((product) => product.category).filter(Boolean));
    return ['Tất cả', ...Array.from(unique)];
  }, [products]);

  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [selectedPriceRange, setSelectedPriceRange] = useState(PRICE_RANGES[0]);

  const filteredProducts = products.filter((product) => {
    if (selectedCategory !== 'Tất cả' && product.category !== selectedCategory) {
      return false;
    }

    const startingPrice = getStartingPrice(product);
    if (startingPrice === null) return true;
    return startingPrice >= selectedPriceRange.min && startingPrice <= selectedPriceRange.max;
  });

  return (
    <div>
      <div className="mb-4">
        <p className="text-text font-medium mb-2">Loại / dịp</p>
        <div className="flex flex-wrap gap-2">
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
        <p className="text-text font-medium mb-2">Mức giá</p>
        <div className="flex flex-wrap gap-2">
          {PRICE_RANGES.map((range) => (
            <button
              key={range.label}
              type="button"
              onClick={() => setSelectedPriceRange(range)}
              className={`px-4 py-2 rounded-xl border text-sm transition-colors ${
                selectedPriceRange.label === range.label
                  ? 'bg-primary text-white border-primary'
                  : 'border-primary/40 text-text hover:border-primary'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <p className="text-text/60 text-center">Không tìm thấy mẫu bánh phù hợp.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
