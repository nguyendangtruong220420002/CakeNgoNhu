'use client';

import { useState } from 'react';
import { pickLocalized } from '@/lib/i18n/localizedText';
import { cloudinaryThumbUrl } from '@/lib/cloudinary';

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

export default function OrderForm({ product, initialSizeLabel, initialQuantity, initialImage, locale }) {
  const productName = pickLocalized(product.name, locale);
  const hasSizes = product.sizes?.length > 0;
  const selectedImage =
    initialImage && product.images?.includes(initialImage) ? initialImage : product.images?.[0] || '';
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
  const [confirming, setConfirming] = useState(false);

  const selectedSize = hasSizes ? product.sizes[sizeIdx] : null;
  const selectedOutOfStock = selectedSize?.status === 'out_of_stock';
  const totalAmount = selectedSize ? selectedSize.price * quantity : 0;

  function handleReview(e) {
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
          productId: product._id,
          sizeLabel: selectedSize.label,
          quantity,
          note,
          image: selectedImage,
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
      <div className="bg-white/60 rounded-2xl p-6 space-y-4">
        <h2 className="font-serif text-xl text-text text-center mb-2">Xác nhận đơn hàng</h2>
        <p className="text-text/60 text-sm text-center mb-4">
          Vui lòng kiểm tra lại thông tin trước khi đặt bánh.
        </p>

        <div className="flex items-center gap-3 pb-2">
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-accent/20 shrink-0">
            {selectedImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={cloudinaryThumbUrl(selectedImage, 128)}
                alt={productName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl">🎂</div>
            )}
          </div>
          <div>
            <p className="font-serif text-text">{productName}</p>
            <p className="text-text/60 text-sm">Size {selectedSize.label}</p>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-text/60">Số lượng</span>
            <span className="text-text font-medium">{quantity}</span>
          </div>
          {note.trim() && (
            <div className="flex justify-between gap-4">
              <span className="text-text/60 shrink-0">Ghi chú</span>
              <span className="text-text text-right">{note}</span>
            </div>
          )}
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
            <span className="text-text font-medium">
              {paymentMethod === 'cod' ? 'Thanh toán khi nhận (COD)' : 'Chuyển khoản QR'}
            </span>
          </div>
          <div className="flex justify-between gap-4 pt-2 border-t border-primary/10">
            <span className="text-text font-medium">Tổng tiền</span>
            <span className="text-primary-dark font-semibold">{totalAmount.toLocaleString('vi-VN')}đ</span>
          </div>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => setConfirming(false)}
            disabled={submitting}
            className="flex-1 border border-primary/40 text-text hover:border-primary disabled:opacity-50 px-4 py-3 rounded-xl transition-colors font-medium"
          >
            ← Chỉnh sửa lại
          </button>
          <button
            type="button"
            onClick={handleConfirmOrder}
            disabled={submitting}
            className="flex-1 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white px-4 py-3 rounded-xl transition-colors font-medium"
          >
            {submitting ? 'Đang gửi...' : 'Xác nhận đặt bánh'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleReview} className="space-y-6">
      <div className="bg-white/60 rounded-2xl p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-accent/20 shrink-0">
            {selectedImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={cloudinaryThumbUrl(selectedImage, 128)}
                alt={productName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl">🎂</div>
            )}
          </div>
          <p className="font-serif text-lg text-text">{productName}</p>
        </div>

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
        disabled={selectedOutOfStock}
        className="w-full bg-primary hover:bg-primary-dark disabled:opacity-50 text-white px-6 py-3 rounded-xl transition-colors font-medium"
      >
        {selectedOutOfStock
          ? 'Size này đã hết hàng'
          : `Xem lại đơn hàng — ${totalAmount.toLocaleString('vi-VN')}đ`}
      </button>
    </form>
  );
}
