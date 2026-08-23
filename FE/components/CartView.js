'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from './CartProvider';
import { pickLocalized } from '@/lib/i18n/localizedText';
import DateTimePicker, { vnNow, vnValueToISOString } from './DateTimePicker';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

function pad(n) {
  return String(n).padStart(2, '0');
}

function minDatetimeLocal() {
  const now = vnNow();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

export default function CartView({ locale }) {
  const {
    items: cartItems,
    updateItem: updateCartItem,
    removeItem,
    totalAmount: cartTotalAmount,
    clearCart,
    hydrated,
    buyNowItem,
    setBuyNowItem,
  } = useCart();

  const isBuyNow = Boolean(buyNowItem);
  const items = isBuyNow ? [buyNowItem] : cartItems;
  const totalAmount = isBuyNow ? buyNowItem.price * buyNowItem.quantity : cartTotalAmount;

  function updateItem(id, patch) {
    if (isBuyNow) {
      setBuyNowItem((prev) => (prev ? { ...prev, ...patch } : prev));
    } else {
      updateCartItem(id, patch);
    }
  }

  const heading = (
    <>
      <Link
        href="/san-pham"
        className="inline-flex items-center gap-1 text-text/70 hover:text-primary transition-colors mb-1"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Quay lại
      </Link>
      <h1 className="font-serif text-2xl md:text-3xl text-text text-center mb-6">
        {isBuyNow ? 'Đặt bánh' : 'Giỏ hàng'}
      </h1>
    </>
  );

  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('pickup');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [address, setAddress] = useState('');
  const paymentMethod = 'cod'; // Tạm thời chỉ nhận COD, chuyển khoản QR chưa mở
  const [confirming, setConfirming] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [orderResult, setOrderResult] = useState(null);

  function handleReview(e) {
    e.preventDefault();
    setError('');

    if (items.length === 0) {
      setError('Giỏ hàng đang trống');
      return;
    }
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

    setConfirming(true);
  }

  async function handleConfirmOrder() {
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            sizeLabel: item.sizeLabel,
            quantity: item.quantity,
            note: item.note,
            image: item.image,
          })),
          deliveryDate: vnValueToISOString(deliveryDate),
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
      if (isBuyNow) {
        setBuyNowItem(null);
      } else {
        clearCart();
      }
    } catch (err) {
      setError('Không thể kết nối tới server, vui lòng thử lại');
    } finally {
      setSubmitting(false);
    }
  }

  if (!hydrated) {
    return null;
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

  if (items.length === 0) {
    return (
      <>
        {heading}
        <div className="bg-white/60 rounded-2xl p-8 text-center">
          <p className="text-text/70 mb-4">Giỏ hàng của bạn đang trống.</p>
          <Link
            href="/san-pham"
            className="inline-block bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl transition-colors"
          >
            Xem mẫu bánh
          </Link>
        </div>
      </>
    );
  }

  if (confirming) {
    const deliveryDateLabel = deliveryDate
      ? new Date(deliveryDate).toLocaleString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      : '';

    return (
      <>
        {heading}
        <div className="bg-white/60 rounded-2xl p-6 space-y-4">
        <h2 className="font-serif text-xl text-text text-center mb-2">Xác nhận đơn hàng</h2>
        <p className="text-text/60 text-sm text-center mb-4">
          Vui lòng kiểm tra lại thông tin trước khi đặt bánh.
        </p>

        <div className="space-y-3 pb-2 border-b border-primary/10">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-accent/20 shrink-0">
                {item.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xl">🎂</div>
                )}
              </div>
              <div className="flex-1 min-w-0 text-sm">
                <p className="font-medium text-text truncate">
                  {pickLocalized(item.name, locale)} ({item.sizeLabel}) x{item.quantity}
                </p>
                {item.note?.trim() && <p className="text-text/50 italic truncate">Ghi chú: {item.note}</p>}
              </div>
              <span className="text-text/70 text-sm whitespace-nowrap">
                {(item.price * item.quantity).toLocaleString('vi-VN')}đ
              </span>
            </div>
          ))}
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-text/60">Ngày giờ nhận</span>
            <span className="text-text font-medium">{deliveryDateLabel}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-text/60">Nhận bánh</span>
            <span className="text-text font-medium">
              {deliveryMethod === 'pickup' ? 'Tự lấy tại tiệm' : 'Giao tận nơi'}
            </span>
          </div>
          {deliveryMethod === 'delivery' && (
            <div className="flex justify-between gap-4">
              <span className="text-text/60 shrink-0">Địa chỉ</span>
              <span className="text-text text-right">{address}</span>
            </div>
          )}
          <div className="flex justify-between gap-4">
            <span className="text-text/60">Họ tên</span>
            <span className="text-text font-medium">{customerName}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-text/60">Số điện thoại</span>
            <span className="text-text font-medium">{customerPhone}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-text/60">Thanh toán</span>
            <span className="text-text font-medium">Thanh toán khi nhận (COD)</span>
          </div>
          <div className="flex justify-between gap-4 pt-2 border-t border-primary/10">
            <span className="text-text font-medium">Tổng tiền</span>
            <span className="text-primary-dark font-semibold">{totalAmount.toLocaleString('vi-VN')}đ</span>
          </div>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={() => setConfirming(false)}
            disabled={submitting}
            className="flex-1 whitespace-nowrap border border-primary/40 text-text hover:border-primary disabled:opacity-50 px-4 py-3 rounded-xl transition-colors font-medium"
          >
            ← Chỉnh sửa lại
          </button>
          <button
            type="button"
            onClick={handleConfirmOrder}
            disabled={submitting}
            className="flex-1 whitespace-nowrap bg-primary hover:bg-primary-dark disabled:opacity-50 text-white px-4 py-3 rounded-xl transition-colors font-medium"
          >
            {submitting ? 'Đang gửi...' : 'Xác nhận đặt bánh'}
          </button>
        </div>
        </div>
      </>
    );
  }

  return (
    <>
      {heading}
      <form onSubmit={handleReview} className="space-y-4">
      <div className="bg-white/60 border border-[#E8D5BC] rounded-2xl p-4 space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3 pb-4 border-b border-primary/10 last:border-0 last:pb-0">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-accent/20 shrink-0">
              {item.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.image} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl">🎂</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium text-text">
                  {pickLocalized(item.name, locale)}{' '}
                  <span className="text-text/60 text-sm">({item.sizeLabel})</span>
                </p>
                {!isBuyNow && (
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 hover:underline text-xs shrink-0"
                  >
                    Xoá
                  </button>
                )}
              </div>
              <p className="text-text/70 text-sm mb-2">{item.price.toLocaleString('vi-VN')}đ</p>
              <input
                type="text"
                value={item.note}
                onChange={(e) => updateItem(item.id, { note: e.target.value })}
                placeholder="Ghi chú (chữ trên bánh, yêu cầu riêng)"
                className="w-full rounded-lg border border-primary/30 bg-white px-3 py-1.5 text-sm mb-2 focus:outline-none focus:border-primary"
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center border border-primary/40 rounded-xl">
                  <button
                    type="button"
                    onClick={() => updateItem(item.id, { quantity: Math.max(1, item.quantity - 1) })}
                    className="w-8 h-8 text-text hover:text-primary"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateItem(item.id, { quantity: item.quantity + 1 })}
                    className="w-8 h-8 text-text hover:text-primary"
                  >
                    +
                  </button>
                </div>
                <span className="font-medium text-text text-sm">
                  {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                </span>
              </div>
            </div>
          </div>
        ))}

        <div className="flex justify-between items-center pt-2">
          <span className="font-medium text-text">Tổng cộng</span>
          <span className="text-primary-dark font-semibold text-lg">{totalAmount.toLocaleString('vi-VN')}đ</span>
        </div>
      </div>

      <div className="bg-white/60 border border-[#E8D5BC] rounded-2xl p-4 space-y-4">
        <div>
          <label className="block text-text font-medium mb-2" htmlFor="deliveryDate">
            Ngày giờ nhận bánh
          </label>
          <DateTimePicker
            id="deliveryDate"
            value={deliveryDate}
            min={minDatetimeLocal()}
            onChange={setDeliveryDate}
          />
        </div>

        <div className="pt-2 border-t border-primary/10">
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
          {deliveryMethod === 'delivery' && (
            <p className="text-text/60 text-sm mt-2">
              Miễn phí giao hàng trong bán kính 3km cho đơn từ 250.000đ trở lên, ngoài phạm vi này có thể phát sinh thêm phí.
            </p>
          )}
        </div>

        {deliveryMethod === 'delivery' && (
          <div className="pt-2 border-t border-primary/10">
            <label className="block text-text font-medium mb-2" htmlFor="address">
              Địa chỉ giao hàng
            </label>
            <input
              id="address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full rounded-xl border border-primary/40 bg-white px-4 py-3 text-text focus:outline-none focus:border-primary"
              placeholder="Số nhà, đường, phường/xã, quận/huyện"
            />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-primary/10">
          <div>
            <label className="block text-text font-medium mb-2" htmlFor="customerName">
              Họ tên <span className="text-red-600">*</span>
            </label>
            <input
              id="customerName"
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full rounded-xl border border-primary/40 bg-white px-4 py-3 text-text focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-text font-medium mb-2" htmlFor="customerPhone">
              Số điện thoại <span className="text-red-600">*</span>
            </label>
            <input
              id="customerPhone"
              type="tel"
              required
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full rounded-xl border border-primary/40 bg-white px-4 py-3 text-text focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="pt-2 border-t border-primary/10">
          <p className="text-text font-medium mb-2">Phương thức thanh toán</p>
          <div className="flex gap-2">
            <div className="flex-1 bg-primary text-white px-4 py-3 rounded-xl text-sm text-center">
              Thanh toán khi nhận (COD)
            </div>
            <div
              className="flex-1 border border-primary/20 text-text/40 px-4 py-3 rounded-xl text-sm text-center cursor-not-allowed"
              title="Chuyển khoản QR tạm chưa hỗ trợ"
            >
              Chuyển khoản QR
              <span className="block text-[10px] mt-0.5">(Sắp ra mắt)</span>
            </div>
          </div>
        </div>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        className="w-full bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl transition-colors font-medium"
      >
        {`${isBuyNow ? 'Đặt bánh ngay' : 'Xem lại đơn hàng'} — ${totalAmount.toLocaleString('vi-VN')}đ`}
      </button>
      </form>
    </>
  );
}
