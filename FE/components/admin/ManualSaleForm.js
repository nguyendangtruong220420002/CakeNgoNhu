'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MoneyInput from '@/components/MoneyInput';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export default function ManualSaleForm() {
  const router = useRouter();

  const [customerPhone, setCustomerPhone] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState('');
  const [date, setDate] = useState(todayStr());
  const [note, setNote] = useState('');
  const [countInRevenue, setCountInRevenue] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!customerPhone.trim() || !customerName.trim()) {
      setError('Vui lòng nhập số điện thoại và họ tên khách hàng');
      return;
    }
    if (!quantity || quantity < 1) {
      setError('Số lượng không hợp lệ');
      return;
    }
    if (price === '' || Number(price) < 0) {
      setError('Vui lòng nhập giá hợp lệ');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/orders/manual`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          customerPhone: customerPhone.trim(),
          customerName: customerName.trim(),
          quantity,
          price: Number(price),
          date: new Date(date).toISOString(),
          note: note.trim(),
          countInRevenue,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Lưu thất bại, vui lòng thử lại');
        return;
      }

      setCustomerPhone('');
      setCustomerName('');
      setQuantity(1);
      setPrice('');
      setDate(todayStr());
      setNote('');
      setCountInRevenue(false);
      setSuccess(true);
      router.refresh();
    } catch (err) {
      setError('Không thể kết nối tới server');
    } finally {
      setSubmitting(false);
    }
  }

  const total = price === '' ? 0 : Number(price) * quantity;

  return (
    <form onSubmit={handleSubmit} className="bg-white/60 rounded-2xl p-4 space-y-4">
      <p className="text-text font-medium">Ghi nhận bán tại quầy</p>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-text font-medium mb-2 text-sm" htmlFor="customerPhone">
            Số điện thoại
          </label>
          <input
            id="customerPhone"
            type="tel"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            className="w-full rounded-xl border border-primary/40 bg-white px-3 py-2 text-sm text-text focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-text font-medium mb-2 text-sm" htmlFor="customerName">
            Họ tên khách hàng
          </label>
          <input
            id="customerName"
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full rounded-xl border border-primary/40 bg-white px-3 py-2 text-sm text-text focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-text font-medium mb-2 text-sm" htmlFor="quantity">
            Số lượng
          </label>
          <input
            id="quantity"
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full rounded-xl border border-primary/40 bg-white px-3 py-2 text-sm text-text focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-text font-medium mb-2 text-sm" htmlFor="price">
            Giá (đ)
          </label>
          <MoneyInput
            id="price"
            value={price}
            onChange={setPrice}
            className="w-full rounded-xl border border-primary/40 bg-white px-3 py-2 text-sm text-text focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-text font-medium mb-2 text-sm" htmlFor="saleDate">
            Ngày bán
          </label>
          <input
            id="saleDate"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-xl border border-primary/40 bg-white px-3 py-2 text-sm text-text focus:outline-none focus:border-primary"
          />
          <p className="text-text/50 text-xs mt-1">Mặc định hôm nay, có thể sửa nếu ghi nhận trễ.</p>
        </div>
      </div>

      <div>
        <label className="block text-text font-medium mb-2 text-sm" htmlFor="note">
          Ghi chú
        </label>
        <input
          id="note"
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="VD: bánh sinh nhật 20cm, chữ trên bánh..."
          className="w-full rounded-xl border border-primary/40 bg-white px-3 py-2 text-sm text-text focus:outline-none focus:border-primary"
        />
      </div>

      <label className="flex items-center gap-2 text-text">
        <input
          type="checkbox"
          checked={countInRevenue}
          onChange={(e) => setCountInRevenue(e.target.checked)}
        />
        Tính vào doanh thu
      </label>
      <p className="text-text/50 text-xs -mt-2">
        Mặc định không tính — chỉ bật khi muốn khoản này cộng vào báo cáo doanh thu/lợi nhuận.
      </p>

      <p className="text-text/70 text-sm">
        Tổng: <span className="font-medium text-text">{total.toLocaleString('vi-VN')}đ</span>
      </p>

      {error && <p className="text-red-600 text-sm">{error}</p>}
      {success && <p className="text-primary-dark text-sm">Đã ghi nhận đơn bán.</p>}

      <button
        type="submit"
        disabled={submitting}
        className="bg-primary hover:bg-primary-dark disabled:opacity-50 text-white px-6 py-3 rounded-xl transition-colors font-medium"
      >
        {submitting ? 'Đang lưu...' : 'Ghi nhận'}
      </button>
    </form>
  );
}
