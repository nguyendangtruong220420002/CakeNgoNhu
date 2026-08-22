'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = ''; // gọi qua rewrite cùng origin, xem next.config.js

const STATUS_LABELS = {
  new: 'Mới nhận',
  in_progress: 'Đang làm',
  completed: 'Hoàn thành',
  delivered: 'Đã giao',
  cancelled: 'Đã huỷ',
};

const STATUS_OPTIONS = Object.keys(STATUS_LABELS);

function formatDateTime(value) {
  return new Date(value).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function OrderAdminTable({ orders, canUpdateStatus }) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState(null);

  async function handleStatusChange(order, status) {
    setPendingId(order._id);
    try {
      await fetch(`${API_URL}/api/orders/${order._id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status }),
      });
      router.refresh();
    } finally {
      setPendingId(null);
    }
  }

  if (orders.length === 0) {
    return <p className="text-text/60">Không có đơn hàng nào.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-white/60 rounded-2xl overflow-hidden">
        <thead>
          <tr className="text-left text-text/70 text-sm border-b border-primary/20">
            <th className="px-4 py-3">Khách hàng</th>
            <th className="px-4 py-3">Sản phẩm</th>
            <th className="px-4 py-3">Ngày nhận</th>
            <th className="px-4 py-3">Nhận hàng</th>
            <th className="px-4 py-3">Tổng tiền</th>
            <th className="px-4 py-3">Thanh toán</th>
            <th className="px-4 py-3">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id} className="border-b border-primary/10 last:border-0 align-top">
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-text">{order.customerId?.name || 'Khách vãng lai'}</p>
                  {order.source === 'manual' && (
                    <span className="px-2 py-0.5 rounded-full text-xs bg-accent/40 text-text/70 shrink-0">
                      Tại quầy
                    </span>
                  )}
                </div>
                <p className="text-text/60 text-sm">{order.customerId?.phone}</p>
              </td>
              <td className="px-4 py-3 text-text/70 text-sm">
                {order.items.map((item, index) => (
                  <p key={index}>
                    {item.productId?.name?.vi ||
                      (order.source === 'manual' ? 'Bán tại quầy' : 'Sản phẩm đã xoá')}
                    {item.sizeLabel ? ` (${item.sizeLabel})` : ''} x{item.quantity}
                    {item.note && <span className="block text-text/50 italic">Ghi chú: {item.note}</span>}
                  </p>
                ))}
              </td>
              <td className="px-4 py-3 text-text/70 text-sm whitespace-nowrap">
                {formatDateTime(order.deliveryDate)}
              </td>
              <td className="px-4 py-3 text-text/70 text-sm">
                {order.deliveryMethod === 'pickup' ? 'Tự lấy tại tiệm' : 'Giao tận nơi'}
              </td>
              <td className="px-4 py-3 text-text font-medium whitespace-nowrap">
                {order.totalAmount.toLocaleString('vi-VN')}đ
              </td>
              <td className="px-4 py-3 text-text/70 text-sm">
                {order.paymentMethod === 'qr' ? 'QR' : 'COD'} —{' '}
                {order.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chờ thanh toán'}
              </td>
              <td className="px-4 py-3">
                {canUpdateStatus ? (
                  <select
                    value={order.status}
                    disabled={pendingId === order._id}
                    onChange={(e) => handleStatusChange(order, e.target.value)}
                    className="rounded-xl border border-primary/40 bg-white px-2 py-2 text-sm text-text focus:outline-none focus:border-primary disabled:opacity-50"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {STATUS_LABELS[status]}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary-dark">
                    {STATUS_LABELS[order.status]}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
