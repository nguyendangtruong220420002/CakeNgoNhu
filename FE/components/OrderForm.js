'use client';

import { useState } from 'react';
import { pickLocalized } from '@/lib/i18n/localizedText';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const SIZE_STATUS_LABELS = {
  out_of_stock: 'Hết hàng',
  pre_order: 'Đặt trước',
};

function minDatetimeLocal() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
}

function firstAvailableIndex(sizes) {
  const index = sizes.findIndex((s) => s.status !== 'out_of_stock');
  return index >= 0 ? index : 0;
}

export default function OrderForm({ product, initialSizeLabel, initialQuantity, locale }) {
  const productName = pickLocalized(product.name, locale);
  const hasSizes = product.sizes?.length > 0;
  const initialIndex = hasSizes
    ? product.sizes.findIndex((s) => s.label === initialSizeLabel)
    : -1;
  const initialIsOutOfStock =
    initialIndex >= 0 && product.sizes[initialIndex].status === 'out_of_stock';

  const [sizeIdx, setSizeIdx] = useState(() => {
    if (initialIndex >= 0 && !initialIsOutOfStock) return initialIndex;
    return hasSizes ? firstAvailableIndex(product.sizes) : 0;
  });
  const [quantity, setQuantity] = useState(initialQuantity);
  const [note, setNote] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('pickup');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [orderResult, setOrderResult] = useState(null);

  const selectedSize = hasSizes ? product.sizes[sizeIdx] : null;
  const selectedOutOfStock = selectedSize?.status === 'out_of_stock';
  const totalAmount = selectedSize ? selectedSize.price * quantity : 0;

  async function handleSubmit(e) {
    e.preventDefault();

    if (selectedOutOfStock) {
      setError('Size này đã hết hàng, vui lòng chọn size khác');
      return;
    }
    setError('');

    if (!deliveryDate) {
      setError('Vui lòng chọn ngày giờ nhận bánh');
      return;
    }
    if (deliveryMethod === 'delivery' && !address.trim()) {
      setError('Vui lòng nhập địa chỉ giao hàng');
      return;
    }
    if (!customerName.trim() || !customerPhone.trim()) {
      setError('Vui lòng nhập đầy đủ tên và số điện thoại');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product._id,
          sizeLabel: selectedSize.label,
          quantity,
          note,
          deliveryDate: new Date(deliveryDate).toISOString(),
          deliveryMethod,
          address,
          customerName,
          customerPhone,
          paymentMethod,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Đặt hàng thất bại, vui lòng thử lại');
        return;
      }

      setOrderResult(data);
    } catch (err) {
      setError('Không thể kết nối tới server, vui lòng thử lại');
    } finally {
      setSubmitting(false);
    }
  }

  if (!hasSizes) {
    return (
      <p className="bg-accent/20 text-text px-4 py-3 rounded-xl text-center">
        Mẫu bánh này chưa có size để đặt, vui lòng liên hệ trực tiếp với tiệm.
      </p>
    );
  }

  if (orderResult) {
    return (
      <div className="bg-white/60 rounded-2xl p-6 text-center">
        <h2 className="font-serif text-2xl text-text mb-2">Đặt hàng thành công!</h2>
        <p className="text-text/70 mb-1">
          Mã đơn hàng: <span className="font-mono">{orderResult._id}</span>
        </p>
        <p className="text-text/70 mb-6">
          Tổng tiền: {orderResult.totalAmount.toLocaleString('vi-VN')}đ — chúng tôi sẽ liên hệ xác nhận sớm.
        </p>
        <a
          href="/san-pham"
          className="inline-block bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl transition-colors"
        >
          Tiếp tục xem mẫu bánh
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white/60 rounded-2xl p-4">
        <p className="font-serif text-lg text-text mb-3">{productName}</p>

        <p className="text-text font-medium mb-2">Chọn size</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {product.sizes.map((size, index) => {
            const outOfStock = size.status === 'out_of_stock';
            return (
              <button
                key={size.label}
                type="button"
                disabled={outOfStock}
                onClick={() => setSizeIdx(index)}
                className={`px-4 py-2 rounded-xl border text-sm transition-colors ${
                  outOfStock
                    ? 'opacity-50 cursor-not-allowed border-text/20 text-text/40'
                    : index === sizeIdx
                      ? 'bg-primary text-white border-primary'
                      : 'border-primary/40 text-text hover:border-primary'
                }`}
              >
                {size.label} — {size.price.toLocaleString('vi-VN')}đ
                {SIZE_STATUS_LABELS[size.status] && (
                  <span className="ml-1">({SIZE_STATUS_LABELS[size.status]})</span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          <p className="text-text font-medium">Số lượng</p>
          <div className="flex items-center border border-primary/40 rounded-xl">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-10 h-10 text-text hover:text-primary"
            >
              −
            </button>
            <span className="w-10 text-center">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="w-10 h-10 text-text hover:text-primary"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-text font-medium mb-2" htmlFor="note">
          Ghi chú (chữ trên bánh, yêu cầu riêng)
        </label>
        <textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          className="w-full rounded-xl border border-primary/40 bg-white/60 px-4 py-3 text-text focus:outline-none focus:border-primary"
          placeholder="VD: Chúc mừng sinh nhật Bé An, tông màu hồng pastel..."
        />
      </div>

      <div>
        <label className="block text-text font-medium mb-2" htmlFor="deliveryDate">
          Ngày giờ nhận bánh
        </label>
        <input
          id="deliveryDate"
          type="datetime-local"
          value={deliveryDate}
          min={minDatetimeLocal()}
          onChange={(e) => setDeliveryDate(e.target.value)}
          required
          className="w-full rounded-xl border border-primary/40 bg-white/60 px-4 py-3 text-text focus:outline-none focus:border-primary"
        />
      </div>

      <div>
        <p className="text-text font-medium mb-2">Nhận bánh</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setDeliveryMethod('pickup')}
            className={`flex-1 px-4 py-3 rounded-xl border text-sm transition-colors ${
              deliveryMethod === 'pickup'
                ? 'bg-primary text-white border-primary'
                : 'border-primary/40 text-text hover:border-primary'
            }`}
          >
            Tự lấy tại tiệm
          </button>
          <button
            type="button"
            onClick={() => setDeliveryMethod('delivery')}
            className={`flex-1 px-4 py-3 rounded-xl border text-sm transition-colors ${
              deliveryMethod === 'delivery'
                ? 'bg-primary text-white border-primary'
                : 'border-primary/40 text-text hover:border-primary'
            }`}
          >
            Giao tận nơi
          </button>
        </div>
      </div>

      {deliveryMethod === 'delivery' && (
        <div>
          <label className="block text-text font-medium mb-2" htmlFor="address">
            Địa chỉ giao hàng
          </label>
          <input
            id="address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full rounded-xl border border-primary/40 bg-white/60 px-4 py-3 text-text focus:outline-none focus:border-primary"
            placeholder="Số nhà, đường, phường/xã, quận/huyện"
          />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-text font-medium mb-2" htmlFor="customerName">
            Họ tên
          </label>
          <input
            id="customerName"
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full rounded-xl border border-primary/40 bg-white/60 px-4 py-3 text-text focus:outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-text font-medium mb-2" htmlFor="customerPhone">
            Số điện thoại
          </label>
          <input
            id="customerPhone"
            type="tel"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            className="w-full rounded-xl border border-primary/40 bg-white/60 px-4 py-3 text-text focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <div>
        <p className="text-text font-medium mb-2">Phương thức thanh toán</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setPaymentMethod('cod')}
            className={`flex-1 px-4 py-3 rounded-xl border text-sm transition-colors ${
              paymentMethod === 'cod'
                ? 'bg-primary text-white border-primary'
                : 'border-primary/40 text-text hover:border-primary'
            }`}
          >
            Thanh toán khi nhận (COD)
          </button>
          <button
            type="button"
            onClick={() => setPaymentMethod('qr')}
            className={`flex-1 px-4 py-3 rounded-xl border text-sm transition-colors ${
              paymentMethod === 'qr'
                ? 'bg-primary text-white border-primary'
                : 'border-primary/40 text-text hover:border-primary'
            }`}
          >
            Chuyển khoản QR
          </button>
        </div>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={submitting || selectedOutOfStock}
        className="w-full bg-primary hover:bg-primary-dark disabled:opacity-50 text-white px-6 py-3 rounded-xl transition-colors font-medium"
      >
        {submitting
          ? 'Đang gửi...'
          : selectedOutOfStock
            ? 'Size này đã hết hàng'
            : `Xác nhận đặt bánh — ${totalAmount.toLocaleString('vi-VN')}đ`}
      </button>
    </form>
  );
}
