'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = ''; // gọi qua rewrite cùng origin, xem next.config.js

export default function ExpenseCategoryManager({ categories }) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [pendingId, setPendingId] = useState(null);

  async function handleAdd(e) {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Vui lòng nhập tên mục chi tiêu');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/expense-categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name: name.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Lưu thất bại');
        return;
      }

      setName('');
      router.refresh();
    } catch (err) {
      setError('Không thể kết nối tới server');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(category) {
    if (!window.confirm(`Xoá mục "${category.name}"?`)) return;

    setPendingId(category._id);
    try {
      await fetch(`${API_URL}/api/expense-categories/${category._id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      router.refresh();
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="bg-white/60 rounded-2xl p-4">
      <p className="text-text font-medium mb-3">Mục chi tiêu</p>

      <ul className="space-y-2 mb-4">
        {categories.map((category) => (
          <li key={category._id} className="flex items-center justify-between gap-2 text-sm">
            <span className="text-text truncate">
              {category.name}
              {category.isDefault && <span className="text-text/40 ml-1">(mặc định)</span>}
            </span>
            {!category.isDefault && (
              <button
                type="button"
                disabled={pendingId === category._id}
                onClick={() => handleDelete(category)}
                className="text-red-600 hover:underline disabled:opacity-50 shrink-0"
              >
                Xoá
              </button>
            )}
          </li>
        ))}
      </ul>

      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Thêm mục mới..."
          className="flex-1 rounded-xl border border-primary/40 bg-white px-3 py-2 text-sm text-text focus:outline-none focus:border-primary"
        />
        <button
          type="submit"
          disabled={submitting}
          className="bg-primary hover:bg-primary-dark disabled:opacity-50 text-white px-4 py-2 rounded-xl transition-colors text-sm font-medium"
        >
          Thêm
        </button>
      </form>
      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
    </div>
  );
}
