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

export default function RevenueManualForm() {
  const router = useRouter();
  const [date, setDate] = useState(todayDateInput());
  const [totalRevenue, setTotalRevenue] = useState('');
  const [orderCount, setOrderCount] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const revenueNum = Number(totalRevenue);
    const countNum = Number(orderCount);

    if (!revenueNum || revenueNum < 0) {
      setError('Vui lòng nhập doanh thu hợp lệ');
      return;
    }
    if (!Number.isInteger(countNum) || countNum < 0) {
      setError('Vui lòng nhập số đơn hàng hợp lệ');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/revenue/daily`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ date, totalRevenue: revenueNum, orderCount: countNum, note: note.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Lưu thất bại');
        return;
      }

      setTotalRevenue('');
      setOrderCount('');
      setNote('');
      setSuccess(true);
      router.refresh();
    } catch (err) {
      setError('Không thể kết nối tới server');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white/60 rounded-2xl p-4 space-y-4 max-w-md">
      <p className="text-text font-medium">Nhập doanh thu bán trực tiếp (không qua web)</p>

      <div>
        <label className="block text-text font-medium mb-2" htmlFor="revDate">
          Ngày
        </label>
        <DateTimePicker id="revDate" mode="date" value={date} onChange={setDate} />
      </div>

      <div>
        <label className="block text-text font-medium mb-2" htmlFor="revAmount">
          Doanh thu (đ)
        </label>
        <MoneyInput
          id="revAmount"
          value={totalRevenue}
          onChange={setTotalRevenue}
          className="w-full rounded-xl border border-primary/40 bg-white px-4 py-2 text-text focus:outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="block text-text font-medium mb-2" htmlFor="revOrderCount">
          Số đơn hàng
        </label>
        <input
          id="revOrderCount"
          type="number"
          min="0"
          value={orderCount}
          onChange={(e) => setOrderCount(e.target.value)}
          className="w-full rounded-xl border border-primary/40 bg-white px-4 py-2 text-text focus:outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="block text-text font-medium mb-2" htmlFor="revNote">
          Ghi chú
        </label>
        <input
          id="revNote"
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full rounded-xl border border-primary/40 bg-white px-4 py-2 text-text focus:outline-none focus:border-primary"
        />
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}
      {success && <p className="text-primary-dark text-sm">Đã lưu doanh thu.</p>}

      <button
        type="submit"
        disabled={submitting}
        className="bg-primary hover:bg-primary-dark disabled:opacity-50 text-white px-6 py-3 rounded-xl transition-colors font-medium"
      >
        {submitting ? 'Đang lưu...' : 'Lưu'}
      </button>
    </form>
  );
}
