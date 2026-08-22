'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const API_URL = ''; // gọi qua rewrite cùng origin, xem next.config.js

const SIZE_STATUS_LABELS = {
  available: 'Có sẵn',
  out_of_stock: 'Hết hàng',
  pre_order: 'Đặt trước',
};

export default function ProductAdminTable({ products }) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState(null);

  async function handleToggleActive(product) {
    setPendingId(product._id);
    try {
      await fetch(`${API_URL}/api/products/${product._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ isActive: !product.isActive }),
      });
      router.refresh();
    } finally {
      setPendingId(null);
    }
  }

  async function handleDelete(product) {
    if (!window.confirm(`Xoá mẫu bánh "${product.name?.vi}"? Không thể hoàn tác.`)) return;

    setPendingId(product._id);
    try {
      await fetch(`${API_URL}/api/products/${product._id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      router.refresh();
    } finally {
      setPendingId(null);
    }
  }

  if (products.length === 0) {
    return <p className="text-text/60">Chưa có mẫu bánh nào.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-white/60 rounded-2xl overflow-hidden">
        <thead>
          <tr className="text-left text-text/70 text-sm border-b border-primary/20">
            <th className="px-4 py-3">Ảnh</th>
            <th className="px-4 py-3">Tên</th>
            <th className="px-4 py-3">Danh mục</th>
            <th className="px-4 py-3">Size / Giá</th>
            <th className="px-4 py-3">Trạng thái</th>
            <th className="px-4 py-3">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id} className="border-b border-primary/10 last:border-0">
              <td className="px-4 py-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-accent/20 shrink-0">
                  {product.images?.[0] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.images[0]}
                      alt=""
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </td>
              <td className="px-4 py-3 font-medium text-text">{product.name?.vi}</td>
              <td className="px-4 py-3 text-text/70">{product.category}</td>
              <td className="px-4 py-3 text-text/70 text-sm">
                {product.sizes?.length
                  ? product.sizes
                      .map(
                        (s) =>
                          `${s.label}: ${s.price.toLocaleString('vi-VN')}đ (${
                            SIZE_STATUS_LABELS[s.status || 'available']
                          })`
                      )
                      .join(', ')
                  : '—'}
              </td>
              <td className="px-4 py-3">
                <button
                  type="button"
                  disabled={pendingId === product._id}
                  onClick={() => handleToggleActive(product)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors disabled:opacity-50 ${
                    product.isActive
                      ? 'bg-primary/20 text-primary-dark hover:bg-primary/30'
                      : 'bg-text/10 text-text/60 hover:bg-text/20'
                  }`}
                >
                  {product.isActive ? 'Đang bán' : 'Ngừng bán'}
                </button>
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-3 text-sm">
                  <Link
                    href={`/san-pham/${product._id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text/70 hover:underline"
                  >
                    Xem
                  </Link>
                  <Link href={`/admin/san-pham/${product._id}`} className="text-primary-dark hover:underline">
                    Sửa
                  </Link>
                  <button
                    type="button"
                    disabled={pendingId === product._id}
                    onClick={() => handleDelete(product)}
                    className="text-red-600 hover:underline disabled:opacity-50"
                  >
                    Xoá
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
