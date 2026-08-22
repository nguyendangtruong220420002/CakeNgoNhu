'use client';

import { useState } from 'react';
import ImageGallery from './ImageGallery';
import ProductOrderPanel from './ProductOrderPanel';

export default function ProductDetailView({ product, locale, name, description }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const selectedImage = product.images?.[activeIndex] || product.images?.[0] || '';

  return (
    <div className="grid md:grid-cols-2 gap-8 md:gap-12">
      <ImageGallery
        images={product.images}
        alt={name}
        activeIndex={activeIndex}
        onChangeIndex={setActiveIndex}
      />

      <div>
        {product.tags?.length > 0 && (
          <div className="flex gap-2 mb-3">
            {product.tags.map((tag) => (
              <span key={tag} className="bg-accent text-text text-xs px-2 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}
        <h1 className="font-serif text-2xl md:text-3xl text-text mb-3">{name}</h1>
        {description && <p className="text-text/70 mb-6 whitespace-pre-line">{description}</p>}

        <ProductOrderPanel product={product} locale={locale} selectedImage={selectedImage} />
      </div>
    </div>
  );
}
