'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MoneyInput from '@/components/MoneyInput';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

function toDateInput(value) {
  return new Date(value).toISOString().slice(0, 10);
}

function EditRow({ expense, categories, onCancel, onSaved }) {
  const [categoryId, setCategoryId] = useState(expense.categoryId?._id || '');
  const [date, setDate] = useState(toDateInput(expense.date));
  const [amount, setAmount] = useState(expense.amount);
  const [note, setNote] = useState(expense.note || '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSave() {
    setError('');
    if (!categoryId) {
      setError('Vui lòng chọn mục chi tiêu');
      return;
    }
    if (amount === '' || Number(amount) <= 0) {
      setError('Số tiền không hợp lệ');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/expenses/${expense._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ categoryId, date, amount: Number(amount), note: note.trim() }),
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
      <td className="px-4 py-3" colSpan={6}>
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="block text-text/70 text-xs mb-1">Mục</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="rounded-lg border border-primary/40 bg-white px-2 py-1.5 text-sm"
            >
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
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
            <label className="block text-text/70 text-xs mb-1">Số tiền (đ)</label>
            <MoneyInput
              value={amount}
              onChange={setAmount}
              className="w-28 rounded-lg border border-primary/40 bg-white px-2 py-1.5 text-sm"
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

export default function ExpenseTable({ expenses, categories }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState(null);
  const [pendingId, setPendingId] = useState(null);

  async function handleDelete(expense) {
    if (!window.confirm('Xoá khoản chi này? Không thể hoàn tác.')) return;

    setPendingId(expense._id);
    try {
      await fetch(`${API_URL}/api/expenses/${expense._id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      router.refresh();
    } finally {
      setPendingId(null);
    }
  }

  if (expenses.length === 0) {
    return <p className="text-text/60">Chưa có khoản chi nào.</p>;
  }

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-white/60 rounded-2xl overflow-hidden">
        <thead>
          <tr className="text-left text-text/70 text-sm border-b border-primary/20">
            <th className="px-4 py-3">Ngày</th>
            <th className="px-4 py-3">Mục</th>
            <th className="px-4 py-3">Số tiền</th>
            <th className="px-4 py-3">Ghi chú</th>
            <th className="px-4 py-3">Người chi</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) =>
            editingId === expense._id ? (
              <EditRow
                key={expense._id}
                expense={expense}
                categories={categories}
                onCancel={() => setEditingId(null)}
                onSaved={() => {
                  setEditingId(null);
                  router.refresh();
                }}
              />
            ) : (
              <tr key={expense._id} className="border-b border-primary/10 last:border-0">
                <td className="px-4 py-3 text-text/70 text-sm whitespace-nowrap">
                  {new Date(expense.date).toLocaleDateString('vi-VN')}
                </td>
                <td className="px-4 py-3 text-text">{expense.categoryId?.name || 'Đã xoá'}</td>
                <td className="px-4 py-3 text-text font-medium whitespace-nowrap">
                  {expense.amount.toLocaleString('vi-VN')}đ
                </td>
                <td className="px-4 py-3 text-text/70 text-sm">{expense.note}</td>
                <td className="px-4 py-3 text-text/70 text-sm">{expense.createdBy}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-3 text-sm">
                    <button
                      type="button"
                      onClick={() => setEditingId(expense._id)}
                      className="text-primary-dark hover:underline"
                    >
                      Sửa
                    </button>
                    <button
                      type="button"
                      disabled={pendingId === expense._id}
                      onClick={() => handleDelete(expense)}
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
        <tfoot>
          <tr>
            <td className="px-4 py-3 font-medium text-text" colSpan={2}>
              Tổng
            </td>
            <td className="px-4 py-3 font-medium text-text">{total.toLocaleString('vi-VN')}đ</td>
            <td colSpan={3} />
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
