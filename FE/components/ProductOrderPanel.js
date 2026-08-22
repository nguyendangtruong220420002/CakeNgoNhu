'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { t } from '@/lib/i18n/getDictionary';

function firstAvailableIndex(sizes) {
  const index = sizes.findIndex((s) => s.status !== 'out_of_stock');
  return index >= 0 ? index : 0;
}

export default function ProductOrderPanel({ product, locale, selectedImage }) {
  const router = useRouter();
  const hasSizes = product.sizes?.length > 0;
  const [sizeIndex, setSizeIndex] = useState(() =>
    hasSizes ? firstAvailableIndex(product.sizes) : 0
  );
  const [quantity, setQuantity] = useState(1);

  const selectedSize = hasSizes ? product.sizes[sizeIndex] : null;
  const selectedOutOfStock = selectedSize?.status === 'out_of_stock';

  const SIZE_STATUS_LABELS = {
    out_of_stock: t(locale, 'detail.outOfStock'),
    pre_order: t(locale, 'detail.preOrder'),
  };

  function handleOrder() {
    if (!selectedSize || selectedOutOfStock) return;
    const params = new URLSearchParams({
      productId: product._id,
      size: selectedSize.label,
      qty: String(quantity),
      ...(selectedImage ? { image: selectedImage } : {}),
    });
    router.push(`/dat-hang?${params.toString()}`);
  }

  if (!product.isActive) {
    return (
      <div className="bg-accent/20 text-text px-4 py-3 rounded-xl text-center font-medium">
        {t(locale, 'detail.discontinued')}
      </div>
    );
  }

  return (
    <div>
      {hasSizes && (
        <div className="mb-6">
          <p className="text-text font-medium mb-2">{t(locale, 'detail.chooseSize')}</p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size, index) => {
              const outOfStock = size.status === 'out_of_stock';
              return (
                <button
                  key={size.label}
                  type="button"
                  disabled={outOfStock}
                  onClick={() => setSizeIndex(index)}
                  className={`px-4 py-2 rounded-xl border text-sm transition-colors ${
                    outOfStock
                      ? 'opacity-50 cursor-not-allowed border-text/20 text-text/40'
                      : index === sizeIndex
                        ? 'bg-primary text-white border-primary'
                        : 'border-primary/40 text-text hover:border-primary'
                  }`}
                >
                  {size.label} — {size.price.toLocaleString('vi-VN')}đ
                  {SIZE_STATUS_LABELS[size.status] && (
                    <span className="ml-1">({SIZE_STATUS_LABELS[size.status]})</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="mb-6 flex items-center gap-4">
        <p className="text-text font-medium">{t(locale, 'detail.quantity')}</p>
        <div className="flex items-center border border-primary/40 rounded-xl">
          <button
            type="button"
            onClick={() => setQuantity((qty) => Math.max(1, qty - 1))}
            className="w-10 h-10 text-text hover:text-primary"
          >
            −
          </button>
          <span className="w-10 text-center">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((qty) => qty + 1)}
            className="w-10 h-10 text-text hover:text-primary"
          >
            +
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={handleOrder}
        disabled={!selectedSize || selectedOutOfStock}
        className="w-full bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl transition-colors font-medium"
      >
        {selectedOutOfStock
          ? t(locale, 'detail.sizeOutOfStock')
          : selectedSize
            ? `${t(locale, 'detail.orderButton')} — ${(selectedSize.price * quantity).toLocaleString('vi-VN')}đ`
            : t(locale, 'detail.orderButton')}
      </button>
    </div>
  );
}
