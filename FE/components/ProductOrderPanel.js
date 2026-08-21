'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProductOrderPanel({ product }) {
  const router = useRouter();
  const hasSizes = product.sizes?.length > 0;
  const [sizeIndex, setSizeIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const selectedSize = hasSizes ? product.sizes[sizeIndex] : null;

  function handleOrder() {
    if (!selectedSize) return;
    const params = new URLSearchParams({
      productId: product._id,
      size: selectedSize.label,
      qty: String(quantity),
    });
    router.push(`/dat-hang?${params.toString()}`);
  }

  if (!product.isActive) {
    return (
      <div className="bg-accent/20 text-text px-4 py-3 rounded-xl text-center font-medium">
        Mẫu bánh này hiện đang ngừng bán
      </div>
    );
  }

  return (
    <div>
      {hasSizes && (
        <div className="mb-6">
          <p className="text-text font-medium mb-2">Chọn size</p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size, index) => (
              <button
                key={size.label}
                type="button"
                onClick={() => setSizeIndex(index)}
                className={`px-4 py-2 rounded-xl border text-sm transition-colors ${
                  index === sizeIndex
                    ? 'bg-primary text-white border-primary'
                    : 'border-primary/40 text-text hover:border-primary'
                }`}
              >
                {size.label} — {size.price.toLocaleString('vi-VN')}đ
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mb-6 flex items-center gap-4">
        <p className="text-text font-medium">Số lượng</p>
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
        disabled={!selectedSize}
        className="w-full bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl transition-colors font-medium"
      >
        {selectedSize
          ? `Đặt bánh — ${(selectedSize.price * quantity).toLocaleString('vi-VN')}đ`
          : 'Đặt bánh'}
      </button>
    </div>
  );
}
