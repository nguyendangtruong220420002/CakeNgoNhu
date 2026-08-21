'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function CustomerSearch({ initialQuery }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(initialQuery || '');

  function handleSubmit(e) {
    e.preventDefault();
    const qs = new URLSearchParams(searchParams);
    if (value.trim()) {
      qs.set('q', value.trim());
    } else {
      qs.delete('q');
    }
    router.push(`/admin/khach-hang?${qs.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Tìm theo tên hoặc số điện thoại..."
        className="flex-1 rounded-xl border border-primary/40 bg-white px-4 py-2 text-text focus:outline-none focus:border-primary"
      />
      <button
        type="submit"
        className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
      >
        Tìm
      </button>
    </form>
  );
}
