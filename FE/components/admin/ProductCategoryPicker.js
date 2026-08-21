'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function ProductCategoryPicker({ categories, value, onChange }) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [pendingId, setPendingId] = useState(null);
  const [error, setError] = useState('');

  async function handleAdd(e) {
    e.preventDefault();
    setError('');

    if (!newName.trim()) {
      setError('Vui lòng nhập tên loại bánh');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/product-categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name: newName.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Thêm thất bại');
        return;
      }

      onChange(data.name);
      setNewName('');
      setAdding(false);
      router.refresh();
    } catch (err) {
      setError('Không thể kết nối tới server');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(category) {
    if (!window.confirm(`Xoá loại bánh "${category.name}"?`)) return;

    setPendingId(category._id);
    try {
      await fetch(`${API_URL}/api/product-categories/${category._id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (value === category.name) {
        onChange('');
      }
      router.refresh();
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <div key={category._id} className="relative group">
            <button
              type="button"
              onClick={() => onChange(category.name)}
              className={`px-4 py-2 rounded-xl border text-sm transition-colors ${
                value === category.name
                  ? 'bg-primary text-white border-primary'
                  : 'border-primary/40 text-text hover:border-primary'
              }`}
            >
              {category.name}
            </button>
            {!category.isDefault && (
              <button
                type="button"
                disabled={pendingId === category._id}
                onClick={() => handleDelete(category)}
                title="Xoá loại bánh này"
                className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center rounded-full bg-white border border-primary/40 text-text/60 text-xs hover:text-red-600 hover:border-red-600 disabled:opacity-50"
              >
                ×
              </button>
            )}
          </div>
        ))}

        {!adding && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="px-4 py-2 rounded-xl border border-dashed border-primary/40 text-sm text-primary-dark hover:border-primary transition-colors"
          >
            + Thêm loại
          </button>
        )}
      </div>

      {adding && (
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Tên loại bánh mới"
            className="flex-1 rounded-xl border border-primary/40 bg-white px-3 py-2 text-sm text-text focus:outline-none focus:border-primary"
          />
          <button
            type="button"
            onClick={handleAdd}
            disabled={submitting}
            className="bg-primary hover:bg-primary-dark disabled:opacity-50 text-white px-4 py-2 rounded-xl transition-colors text-sm font-medium"
          >
            Lưu
          </button>
          <button
            type="button"
            onClick={() => {
              setAdding(false);
              setNewName('');
              setError('');
            }}
            className="text-sm text-text/60 hover:text-text px-2"
          >
            Huỷ
          </button>
        </div>
      )}

      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
    </div>
  );
}
