'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MoneyInput from '@/components/MoneyInput';

const API_URL = ''; // gọi qua rewrite cùng origin, xem next.config.js

function toDateInput(value) {
  return new Date(value).toISOString().slice(0, 10);
}

function EditRow({ entry, onCancel, onSaved }) {
  const [date, setDate] = useState(toDateInput(entry.date));
  const [totalRevenue, setTotalRevenue] = useState(entry.totalRevenue);
  const [orderCount, setOrderCount] = useState(entry.orderCount);
  const [note, setNote] = useState(entry.note || '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSave() {
    setError('');
    if (totalRevenue === '' || Number(totalRevenue) < 0) {
      setError('Doanh thu không hợp lệ');
      return;
    }
    if (!Number.isInteger(Number(orderCount)) || Number(orderCount) < 0) {
      setError('Số đơn hàng không hợp lệ');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/revenue/manual/${entry._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          date,
          totalRevenue: Number(totalRevenue),
          orderCount: Number(orderCount),
          note: note.trim(),
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Lưu thất bại');
        return;
      }

      onSaved();
    } catch (err) {
      setError('Không thể kết nối tới server');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <tr className="border-b border-primary/10 last:border-0 bg-accent/10">
      <td className="px-4 py-3" colSpan={5}>
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="block text-text/70 text-xs mb-1">Ngày</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-lg border border-primary/40 bg-white px-2 py-1.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-text/70 text-xs mb-1">Doanh thu (đ)</label>
            <MoneyInput
              value={totalRevenue}
              onChange={setTotalRevenue}
              className="w-28 rounded-lg border border-primary/40 bg-white px-2 py-1.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-text/70 text-xs mb-1">Số đơn</label>
            <input
              type="number"
              min="0"
              value={orderCount}
              onChange={(e) => setOrderCount(e.target.value)}
              className="w-20 rounded-lg border border-primary/40 bg-white px-2 py-1.5 text-sm"
            />
          </div>
          <div className="flex-1 min-w-[140px]">
            <label className="block text-text/70 text-xs mb-1">Ghi chú</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full rounded-lg border border-primary/40 bg-white px-2 py-1.5 text-sm"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={submitting}
              onClick={handleSave}
              className="bg-primary hover:bg-primary-dark disabled:opacity-50 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
            >
              {submitting ? 'Đang lưu...' : 'Lưu'}
            </button>
            <button type="button" onClick={onCancel} className="text-text/60 hover:text-text text-sm px-2">
              Huỷ
            </button>
          </div>
        </div>
        {error && <p className="text-red-600 text-xs mt-2">{error}</p>}
      </td>
    </tr>
  );
}

export default function RevenueEntryList({ entries }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState(null);
  const [pendingId, setPendingId] = useState(null);

  async function handleDelete(entry) {
    if (!window.confirm('Xoá khoản doanh thu này? Không thể hoàn tác.')) return;

    setPendingId(entry._id);
    try {
      await fetch(`${API_URL}/api/revenue/manual/${entry._id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      router.refresh();
    } finally {
      setPendingId(null);
    }
  }

  if (entries.length === 0) {
    return <p className="text-text/60">Chưa có khoản doanh thu nhập tay nào.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-white/60 rounded-2xl overflow-hidden">
        <thead>
          <tr className="text-left text-text/70 text-sm border-b border-primary/20">
            <th className="px-4 py-3">Ngày</th>
            <th className="px-4 py-3">Doanh thu</th>
            <th className="px-4 py-3">Số đơn</th>
            <th className="px-4 py-3">Ghi chú</th>
            <th className="px-4 py-3">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) =>
            editingId === entry._id ? (
              <EditRow
                key={entry._id}
                entry={entry}
                onCancel={() => setEditingId(null)}
                onSaved={() => {
                  setEditingId(null);
                  router.refresh();
                }}
              />
            ) : (
              <tr key={entry._id} className="border-b border-primary/10 last:border-0">
                <td className="px-4 py-3 text-text/70 text-sm whitespace-nowrap">
                  {new Date(entry.date).toLocaleDateString('vi-VN')}
                </td>
                <td className="px-4 py-3 text-text font-medium text-sm whitespace-nowrap">
                  {entry.totalRevenue.toLocaleString('vi-VN')}đ
                </td>
                <td className="px-4 py-3 text-text/70 text-sm">{entry.orderCount}</td>
                <td className="px-4 py-3 text-text/70 text-sm">{entry.note}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-3 text-sm">
                    <button
                      type="button"
                      onClick={() => setEditingId(entry._id)}
                      className="text-primary-dark hover:underline"
                    >
                      Sửa
                    </button>
                    <button
                      type="button"
                      disabled={pendingId === entry._id}
                      onClick={() => handleDelete(entry)}
                      className="text-red-600 hover:underline disabled:opacity-50"
                    >
                      Xoá
                    </button>
                  </div>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}
