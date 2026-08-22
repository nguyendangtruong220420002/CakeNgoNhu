'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MoneyInput from '@/components/MoneyInput';

const API_URL = ''; // gọi qua rewrite cùng origin, xem next.config.js

const STATUS_LABELS = {
  new: 'Mới nhận',
  in_progress: 'Đang làm',
  completed: 'Hoàn thành',
  delivered: 'Đã giao',
  cancelled: 'Đã huỷ',
};

function toDateInput(value) {
  return new Date(value).toISOString().slice(0, 10);
}

function OrderEditRow({ order, onCancel, onSaved }) {
  const [quantity, setQuantity] = useState(order.items?.[0]?.quantity || 1);
  const [price, setPrice] = useState(order.items?.[0]?.price ?? '');
  const [note, setNote] = useState(order.items?.[0]?.note || '');
  const [date, setDate] = useState(toDateInput(order.createdAt));
  const [countInRevenue, setCountInRevenue] = useState(Boolean(order.countInRevenue));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSave() {
    setError('');
    if (!quantity || quantity < 1) {
      setError('Số lượng không hợp lệ');
      return;
    }
    if (price === '' || Number(price) < 0) {
      setError('Giá không hợp lệ');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/orders/${order._id}/manual`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          quantity,
          price: Number(price),
          note: note.trim(),
          date: new Date(date).toISOString(),
          countInRevenue,
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
    <tr className="border-b border-primary/5 last:border-0 bg-accent/10">
      <td className="py-2 pr-3" colSpan={6}>
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
            <label className="block text-text/70 text-xs mb-1">Số lượng</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-20 rounded-lg border border-primary/40 bg-white px-2 py-1.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-text/70 text-xs mb-1">Giá (đ)</label>
            <MoneyInput
              value={price}
              onChange={setPrice}
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
          <label className="flex items-center gap-1.5 text-sm text-text pb-1.5">
            <input
              type="checkbox"
              checked={countInRevenue}
              onChange={(e) => setCountInRevenue(e.target.checked)}
            />
            Tính vào DT
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={submitting}
              onClick={handleSave}
              className="bg-primary hover:bg-primary-dark disabled:opacity-50 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
            >
              {submitting ? 'Đang lưu...' : 'Lưu'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="text-text/60 hover:text-text text-sm px-2"
            >
              Huỷ
            </button>
          </div>
        </div>
        {error && <p className="text-red-600 text-xs mt-2">{error}</p>}
      </td>
    </tr>
  );
}

export default function CustomerList({ customers }) {
  const router = useRouter();
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [pendingId, setPendingId] = useState(null);

  async function handleDelete(order) {
    if (!window.confirm('Xoá đơn này? Không thể hoàn tác.')) return;

    setPendingId(order._id);
    try {
      await fetch(`${API_URL}/api/orders/${order._id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      router.refresh();
    } finally {
      setPendingId(null);
    }
  }

  if (customers.length === 0) {
    return <p className="text-text/60">Không tìm thấy khách hàng phù hợp.</p>;
  }

  return (
    <div className="space-y-4">
      {customers.map((customer) => {
        const orders = customer.orderHistory || [];
        const totalSpent = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

        return (
          <div key={customer._id} className="bg-white/60 rounded-2xl p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
              <div>
                <p className="font-medium text-text">{customer.name}</p>
                <p className="text-text/60 text-sm">{customer.phone}</p>
                {customer.address && <p className="text-text/50 text-sm">{customer.address}</p>}
              </div>
              <div className="text-right text-sm text-text/70">
                <p>{orders.length} đơn</p>
                <p className="font-medium text-primary-dark">
                  {totalSpent.toLocaleString('vi-VN')}đ
                </p>
              </div>
            </div>

            {orders.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-text/60 border-b border-primary/10">
                      <th className="py-1 pr-3">Ngày</th>
                      <th className="py-1 pr-3">Sản phẩm</th>
                      <th className="py-1 pr-3">Tổng tiền</th>
                      <th className="py-1 pr-3">Tính vào DT</th>
                      <th className="py-1 pr-3">Nguồn</th>
                      <th className="py-1">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) =>
                      editingOrderId === order._id ? (
                        <OrderEditRow
                          key={order._id}
                          order={order}
                          onCancel={() => setEditingOrderId(null)}
                          onSaved={() => {
                            setEditingOrderId(null);
                            router.refresh();
                          }}
                        />
                      ) : (
                        <tr key={order._id} className="border-b border-primary/5 last:border-0">
                          <td className="py-1.5 pr-3 text-text/70 whitespace-nowrap">
                            {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                          </td>
                          <td className="py-1.5 pr-3 text-text/70">
                            {order.items.map((item, index) => {
                              const label =
                                item.productId?.name?.vi ||
                                (order.source === 'manual' ? 'Bán tại quầy' : 'Đã xoá');
                              const size = item.sizeLabel ? ` (${item.sizeLabel})` : '';
                              return (
                                <p key={index}>
                                  {label}
                                  {size} x{item.quantity}
                                  {item.note && (
                                    <span className="block text-text/50 italic">{item.note}</span>
                                  )}
                                </p>
                              );
                            })}
                          </td>
                          <td className="py-1.5 pr-3 text-text/70 whitespace-nowrap">
                            {order.totalAmount.toLocaleString('vi-VN')}đ
                          </td>
                          <td className="py-1.5 pr-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs ${
                                order.countInRevenue
                                  ? 'bg-primary/20 text-primary-dark'
                                  : 'bg-text/10 text-text/50'
                              }`}
                            >
                              {order.countInRevenue ? 'Có' : 'Không'}
                            </span>
                          </td>
                          <td className="py-1.5 pr-3 text-text/50">
                            {order.source === 'manual' ? 'Tại quầy' : 'Online'}
                          </td>
                          <td className="py-1.5">
                            <div className="flex gap-2">
                              {order.source === 'manual' && (
                                <button
                                  type="button"
                                  onClick={() => setEditingOrderId(order._id)}
                                  className="text-primary-dark hover:underline"
                                >
                                  Sửa
                                </button>
                              )}
                              <button
                                type="button"
                                disabled={pendingId === order._id}
                                onClick={() => handleDelete(order)}
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
            )}
          </div>
        );
      })}
    </div>
  );
}
