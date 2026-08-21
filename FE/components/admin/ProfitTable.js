'use client';

import { Fragment, useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

function DayDetail({ date }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`${API_URL}/api/reports/day-detail?date=${date}`, { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setDetail(data);
      })
      .catch(() => {
        if (!cancelled) setError('Không thể tải chi tiết');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [date]);

  if (loading) return <p className="text-text/50 text-sm py-2">Đang tải...</p>;
  if (error) return <p className="text-red-600 text-sm py-2">{error}</p>;
  if (!detail) return null;

  const hasNothing =
    detail.orders.length === 0 && detail.manualRevenue.length === 0 && detail.expenses.length === 0;

  if (hasNothing) {
    return <p className="text-text/50 text-sm py-2">Không có dữ liệu chi tiết.</p>;
  }

  return (
    <div className="py-3 space-y-3 text-sm">
      {detail.orders.length > 0 && (
        <div>
          <p className="font-medium text-text mb-1">Đơn hàng ({detail.orders.length})</p>
          <ul className="space-y-1 text-text/70">
            {detail.orders.map((o) => (
              <li key={o._id}>
                {o.customerId?.name || 'Khách vãng lai'} — {o.totalAmount.toLocaleString('vi-VN')}đ
                <span className="text-text/40"> · {o.source === 'manual' ? 'Tại quầy' : 'Online'}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {detail.manualRevenue.length > 0 && (
        <div>
          <p className="font-medium text-text mb-1">Doanh thu nhập tay ({detail.manualRevenue.length})</p>
          <ul className="space-y-1 text-text/70">
            {detail.manualRevenue.map((r) => (
              <li key={r._id}>
                {r.totalRevenue.toLocaleString('vi-VN')}đ ({r.orderCount} đơn)
                {r.note && <span className="text-text/40 italic"> — {r.note}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {detail.expenses.length > 0 && (
        <div>
          <p className="font-medium text-text mb-1">Chi tiêu ({detail.expenses.length})</p>
          <ul className="space-y-1 text-text/70">
            {detail.expenses.map((e) => (
              <li key={e._id}>
                {e.categoryId?.name || 'Đã xoá'} — {e.amount.toLocaleString('vi-VN')}đ
                {e.note && <span className="text-text/40 italic"> — {e.note}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function ProfitTable({ days, totals }) {
  const [expandedDate, setExpandedDate] = useState(null);

  if (days.length === 0) {
    return <p className="text-text/60">Không có dữ liệu trong khoảng thời gian này.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-white/60 rounded-2xl overflow-hidden">
        <thead>
          <tr className="text-left text-text/70 text-sm border-b border-primary/20">
            <th className="px-4 py-3">Ngày</th>
            <th className="px-4 py-3">Doanh thu</th>
            <th className="px-4 py-3">Chi tiêu</th>
            <th className="px-4 py-3">Lợi nhuận</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {days.map((day) => (
            <Fragment key={day.date}>
              <tr className="border-b border-primary/10 last:border-0">
                <td className="px-4 py-3 text-text/70 text-sm whitespace-nowrap">
                  {new Date(day.date).toLocaleDateString('vi-VN')}
                </td>
                <td className="px-4 py-3 text-text/70 text-sm">
                  {day.revenue.toLocaleString('vi-VN')}đ
                </td>
                <td className="px-4 py-3 text-text/70 text-sm">
                  {day.expenses.toLocaleString('vi-VN')}đ
                </td>
                <td
                  className={`px-4 py-3 font-medium text-sm ${
                    day.profit >= 0 ? 'text-primary-dark' : 'text-red-600'
                  }`}
                >
                  {day.profit.toLocaleString('vi-VN')}đ
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => setExpandedDate(expandedDate === day.date ? null : day.date)}
                    className="text-primary-dark hover:underline text-sm whitespace-nowrap"
                  >
                    {expandedDate === day.date ? 'Ẩn' : 'Xem chi tiết'}
                  </button>
                </td>
              </tr>
              {expandedDate === day.date && (
                <tr className="border-b border-primary/10 last:border-0 bg-accent/10">
                  <td className="px-4" colSpan={5}>
                    <DayDetail date={day.date} />
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td className="px-4 py-3 font-medium text-text">Tổng</td>
            <td className="px-4 py-3 font-medium text-text">
              {totals.totalRevenue.toLocaleString('vi-VN')}đ
            </td>
            <td className="px-4 py-3 font-medium text-text">
              {totals.totalExpenses.toLocaleString('vi-VN')}đ
            </td>
            <td
              className={`px-4 py-3 font-medium ${
                totals.totalProfit >= 0 ? 'text-primary-dark' : 'text-red-600'
              }`}
            >
              {totals.totalProfit.toLocaleString('vi-VN')}đ
            </td>
            <td />
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
