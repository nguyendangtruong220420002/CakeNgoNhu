'use client';

import { useState } from 'react';

export default function ImageGallery({ images, alt }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const hasImages = images && images.length > 0;

  return (
    <div>
      <div className="aspect-square bg-accent/30 rounded-2xl overflow-hidden mb-3">
        {hasImages ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={images[activeIndex]}
            alt={alt}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text/40">
            Chưa có ảnh
          </div>
        )}
      </div>

      {hasImages && images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((src, index) => (
            <button
              key={src + index}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${
                index === activeIndex ? 'border-primary' : 'border-transparent'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
