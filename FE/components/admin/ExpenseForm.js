'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MoneyInput from '@/components/MoneyInput';
import DateTimePicker, { vnNow } from '@/components/DateTimePicker';

const API_URL = ''; // gọi qua rewrite cùng origin, xem next.config.js

function pad(n) {
  return String(n).padStart(2, '0');
}

function todayDateInput() {
  const now = vnNow();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

export default function ExpenseForm({ categories }) {
  const router = useRouter();
  const [categoryId, setCategoryId] = useState(categories[0]?._id || '');
  const [date, setDate] = useState(todayDateInput());
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!categoryId) {
      setError('Vui lòng chọn mục chi tiêu');
      return;
    }
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      setError('Vui lòng nhập số tiền hợp lệ');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ categoryId, date, amount: numericAmount, note }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Lưu thất bại, vui lòng thử lại');
        return;
      }

      setAmount('');
      setNote('');
      setSuccess(true);
      router.refresh();
    } catch (err) {
      setError('Không thể kết nối tới server');
    } finally {
      setSubmitting(false);
    }
  }

  if (categories.length === 0) {
    return <p className="text-text/60">Chưa có mục chi tiêu nào.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white/60 rounded-2xl p-4 space-y-4 max-w-md">
      <div>
        <label className="block text-text font-medium mb-2" htmlFor="categoryId">
          Mục chi tiêu
        </label>
        <select
          id="categoryId"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full rounded-xl border border-primary/40 bg-white px-4 py-2 text-text focus:outline-none focus:border-primary"
        >
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-text font-medium mb-2" htmlFor="date">
          Ngày chi
        </label>
        <DateTimePicker id="date" mode="date" value={date} onChange={setDate} />
      </div>

      <div>
        <label className="block text-text font-medium mb-2" htmlFor="amount">
          Số tiền (đ)
        </label>
        <MoneyInput
          id="amount"
          value={amount}
          onChange={setAmount}
          className="w-full rounded-xl border border-primary/40 bg-white px-4 py-2 text-text focus:outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="block text-text font-medium mb-2" htmlFor="note">
          Ghi chú
        </label>
        <input
          id="note"
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full rounded-xl border border-primary/40 bg-white px-4 py-2 text-text focus:outline-none focus:border-primary"
        />
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}
      {success && <p className="text-primary-dark text-sm">Đã lưu khoản chi.</p>}

      <button
        type="submit"
        disabled={submitting}
        className="bg-primary hover:bg-primary-dark disabled:opacity-50 text-white px-6 py-3 rounded-xl transition-colors font-medium"
      >
        {submitting ? 'Đang lưu...' : 'Lưu khoản chi'}
      </button>
    </form>
  );
}
