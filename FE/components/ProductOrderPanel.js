'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from './CartProvider';
import { t } from '@/lib/i18n/getDictionary';

function firstAvailableIndex(sizes) {
  const index = sizes.findIndex((s) => s.status !== 'out_of_stock');
  return index >= 0 ? index : 0;
}

export default function ProductOrderPanel({ product, locale, selectedImage }) {
  const router = useRouter();
  const { addItem, setBuyNowItem } = useCart();
  const hasSizes = product.sizes?.length > 0;
  const [sizeIndex, setSizeIndex] = useState(() =>
    hasSizes ? firstAvailableIndex(product.sizes) : 0
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const selectedSize = hasSizes ? product.sizes[sizeIndex] : null;
  const selectedOutOfStock = selectedSize?.status === 'out_of_stock';

  useEffect(() => {
    setAdded(false);
  }, [sizeIndex, quantity]);

  const SIZE_STATUS_LABELS = {
    out_of_stock: t(locale, 'detail.outOfStock'),
    pre_order: t(locale, 'detail.preOrder'),
  };

  function buildCartItem() {
    return {
      productId: product._id,
      name: product.name,
      image: selectedImage || product.images?.[0] || '',
      sizeLabel: selectedSize.label,
      price: selectedSize.price,
      quantity,
      note: '',
    };
  }

  function handleAddToCart() {
    if (!selectedSize || selectedOutOfStock) return;
    addItem(buildCartItem());
    setAdded(true);
  }

  function handleBuyNow() {
    if (!selectedSize || selectedOutOfStock) return;
    setBuyNowItem({ ...buildCartItem(), id: `buynow-${product._id}-${selectedSize.label}-${Date.now()}` });
    router.push('/gio-hang');
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

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!selectedSize || selectedOutOfStock}
          className="flex-1 inline-flex items-center justify-center gap-2 border-2 border-primary text-primary hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-xl transition-colors font-medium"
        >
          <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.35 2.7A1 1 0 006.55 17H17m-10 0a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4z"
            />
          </svg>
          {selectedOutOfStock ? t(locale, 'detail.sizeOutOfStock') : t(locale, 'cart.addToCart')}
        </button>
        <button
          type="button"
          onClick={handleBuyNow}
          disabled={!selectedSize || selectedOutOfStock}
          className="flex-1 bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl transition-colors font-medium"
        >
          {selectedOutOfStock
            ? t(locale, 'detail.sizeOutOfStock')
            : selectedSize
              ? `Mua ngay — ${(selectedSize.price * quantity).toLocaleString('vi-VN')}đ`
              : 'Mua ngay'}
        </button>
      </div>

      {added && (
        <div className="mt-3 flex items-center justify-between gap-3 bg-accent/20 text-text px-4 py-3 rounded-xl text-sm">
          <span>{t(locale, 'cart.addedToCart')}</span>
          <Link href="/gio-hang" className="text-primary-dark font-medium hover:underline whitespace-nowrap">
            {t(locale, 'cart.viewCart')}
          </Link>
        </div>
      )}
    </div>
  );
}
