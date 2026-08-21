'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function ExpenseTable({ expenses }) {
  const router = useRouter();
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
          {expenses.map((expense) => (
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
                <button
                  type="button"
                  disabled={pendingId === expense._id}
                  onClick={() => handleDelete(expense)}
                  className="text-red-600 hover:underline text-sm disabled:opacity-50"
                >
                  Xoá
                </button>
              </td>
            </tr>
          ))}
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
