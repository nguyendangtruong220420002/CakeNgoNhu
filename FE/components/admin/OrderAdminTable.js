'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import Pagination from './Pagination';
import HorizontalScroller from '@/components/HorizontalScroller';
import { cloudinaryThumbUrl } from '@/lib/cloudinary';
import MoneyInput from '@/components/MoneyInput';
import { useConfirm } from '@/components/ConfirmProvider';

const API_URL = ''; // gọi qua rewrite cùng origin, xem next.config.js

const STATUS_LABELS = {
  new: 'Mới nhận',
  in_progress: 'Đang làm',
  completed: 'Hoàn thành',
  delivered: 'Đã giao',
  cancelled: 'Đã huỷ',
};

const STATUS_OPTIONS = Object.keys(STATUS_LABELS);

const STATUS_PRIORITY = {
  new: 0,
  in_progress: 1,
  completed: 2,
  delivered: 3,
  cancelled: 4,
};

function toDateInputValue(value) {
  return new Date(value).toISOString().slice(0, 10);
}

function toDatetimeLocalValue(value) {
  const d = new Date(value);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

function formatDateTime(value) {
  return new Date(value).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function toLocalDateStr(value) {
  const d = new Date(value);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

const FIELD_VALUE = {
  customer: (order) => order.customerId?.name || 'Khách vãng lai',
  phone: (order) => order.customerId?.phone || '',
  deliveryMethod: (order) => (order.deliveryMethod === 'pickup' ? 'Tự lấy tại tiệm' : 'Giao tận nơi'),
  totalAmount: (order) => `${order.totalAmount.toLocaleString('vi-VN')}đ`,
  payment: (order) =>
    `${order.paymentMethod === 'qr' ? 'QR' : 'COD'} — ${
      order.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chờ thanh toán'
    }`,
};

const CHECKBOX_COLUMNS = [
  { key: 'deliveryMethod', label: 'Nhận hàng' },
  { key: 'totalAmount', label: 'Tổng tiền' },
  { key: 'payment', label: 'Thanh toán' },
];

function usePopoverPosition() {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);

  function toggleOpen() {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 4, left: rect.left });
    }
    setOpen((v) => !v);
  }

  useEffect(() => {
    if (!open) return undefined;
    function closeOnReflow() {
      setOpen(false);
    }
    window.addEventListener('scroll', closeOnReflow, true);
    window.addEventListener('resize', closeOnReflow);
    return () => {
      window.removeEventListener('scroll', closeOnReflow, true);
      window.removeEventListener('resize', closeOnReflow);
    };
  }, [open]);

  return { open, setOpen, toggleOpen, pos, btnRef };
}

function FilterIcon({ active }) {
  return (
    <svg
      className={`h-3.5 w-3.5 shrink-0 ${active ? 'text-primary' : 'text-text/40'}`}
      fill={active ? 'currentColor' : 'none'}
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5h16l-6 7v6l-4 2v-8L4 5z" />
    </svg>
  );
}

function CalendarIcon({ active }) {
  return (
    <svg
      className={`h-3.5 w-3.5 shrink-0 ${active ? 'text-primary' : 'text-text/40'}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <rect x="4" y="5" width="16" height="15" rx="2" strokeWidth={2} />
      <path strokeLinecap="round" strokeWidth={2} d="M4 9h16M8 3v3M16 3v3" />
    </svg>
  );
}

function SearchIcon({ active }) {
  return (
    <svg
      className={`h-3.5 w-3.5 shrink-0 ${active ? 'text-primary' : 'text-text/40'}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" strokeWidth={2} />
      <path strokeLinecap="round" strokeWidth={2} d="M20 20l-3.5-3.5" />
    </svg>
  );
}

function FilterButtonShell({ label, active, btnRef, onToggle, icon }) {
  return (
    <button
      ref={btnRef}
      type="button"
      onClick={onToggle}
      className={`inline-flex items-center gap-1 hover:text-primary transition-colors ${active ? 'text-primary' : ''}`}
    >
      {label}
      {icon}
    </button>
  );
}

function PopoverBox({ pos, onClose, children, width = 'w-56' }) {
  if (typeof document === 'undefined') return null;
  return createPortal(
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        className={`fixed z-50 ${width} bg-white rounded-xl border border-primary/20 shadow-lg p-2`}
        style={{ top: pos.top, left: pos.left }}
      >
        {children}
      </div>
    </>,
    document.body
  );
}

function FilterFooter({ onReset, onOk }) {
  return (
    <div className="flex items-center justify-between pt-2 border-t border-primary/10">
      <button type="button" onClick={onReset} className="text-xs text-text/50 hover:text-text px-2 py-1">
        Reset
      </button>
      <button
        type="button"
        onClick={onOk}
        className="text-xs bg-primary hover:bg-primary-dark text-white px-3 py-1.5 rounded-lg transition-colors"
      >
        OK
      </button>
    </div>
  );
}

function CheckboxFilterButton({ label, options, selected, onApply }) {
  const { open, setOpen, toggleOpen, pos, btnRef } = usePopoverPosition();
  const [pending, setPending] = useState(selected);
  const active = selected.length > 0;

  function handleToggleOpen() {
    if (!open) setPending(selected);
    toggleOpen();
  }

  function toggleValue(val) {
    setPending((prev) => (prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]));
  }

  return (
    <div className="inline-block">
      <FilterButtonShell
        label={label}
        active={active}
        btnRef={btnRef}
        onToggle={handleToggleOpen}
        icon={<FilterIcon active={active} />}
      />
      {open && (
        <PopoverBox pos={pos} onClose={() => setOpen(false)}>
          <div className="max-h-52 overflow-y-auto flex flex-col gap-0.5 mb-2">
            {options.length === 0 && <p className="text-xs text-text/40 px-2 py-1">Không có dữ liệu</p>}
            {options.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-2 text-sm text-text px-2 py-1.5 rounded-lg hover:bg-primary/5 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={pending.includes(opt.value)}
                  onChange={() => toggleValue(opt.value)}
                  className="accent-primary shrink-0"
                />
                <span className="truncate">{opt.label}</span>
              </label>
            ))}
          </div>
          <FilterFooter
            onReset={() => {
              setPending([]);
              onApply([]);
              setOpen(false);
            }}
            onOk={() => {
              onApply(pending);
              setOpen(false);
            }}
          />
        </PopoverBox>
      )}
    </div>
  );
}

function TextFilterButton({ label, selected, onApply, placeholder }) {
  const { open, setOpen, toggleOpen, pos, btnRef } = usePopoverPosition();
  const [pending, setPending] = useState(selected);
  const active = selected.trim().length > 0;

  function handleToggleOpen() {
    if (!open) setPending(selected);
    toggleOpen();
  }

  return (
    <div className="inline-block">
      <FilterButtonShell
        label={label}
        active={active}
        btnRef={btnRef}
        onToggle={handleToggleOpen}
        icon={<SearchIcon active={active} />}
      />
      {open && (
        <PopoverBox pos={pos} onClose={() => setOpen(false)}>
          <input
            type="text"
            value={pending}
            onChange={(e) => setPending(e.target.value)}
            placeholder={placeholder}
            autoFocus
            className="w-full rounded-lg border border-primary/30 px-2 py-1.5 text-sm mb-2 focus:outline-none focus:border-primary"
          />
          <FilterFooter
            onReset={() => {
              setPending('');
              onApply('');
              setOpen(false);
            }}
            onOk={() => {
              onApply(pending);
              setOpen(false);
            }}
          />
        </PopoverBox>
      )}
    </div>
  );
}

function DateRangeFilterButton({ label, selected, onApply }) {
  const { open, setOpen, toggleOpen, pos, btnRef } = usePopoverPosition();
  const [pending, setPending] = useState(selected);
  const active = Boolean(selected.from || selected.to);

  function handleToggleOpen() {
    if (!open) setPending(selected);
    toggleOpen();
  }

  return (
    <div className="inline-block">
      <FilterButtonShell
        label={label}
        active={active}
        btnRef={btnRef}
        onToggle={handleToggleOpen}
        icon={<CalendarIcon active={active} />}
      />
      {open && (
        <PopoverBox pos={pos} onClose={() => setOpen(false)} width="w-64">
          <div className="flex flex-col gap-2 mb-2">
            <div>
              <label className="block text-xs text-text/60 mb-1">Từ ngày</label>
              <input
                type="date"
                value={pending.from}
                onChange={(e) => setPending((p) => ({ ...p, from: e.target.value }))}
                className="w-full rounded-lg border border-primary/30 px-2 py-1.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-text/60 mb-1">Đến ngày</label>
              <input
                type="date"
                value={pending.to}
                onChange={(e) => setPending((p) => ({ ...p, to: e.target.value }))}
                className="w-full rounded-lg border border-primary/30 px-2 py-1.5 text-sm"
              />
            </div>
          </div>
          <FilterFooter
            onReset={() => {
              setPending({ from: '', to: '' });
              onApply({ from: '', to: '' });
              setOpen(false);
            }}
            onOk={() => {
              onApply(pending);
              setOpen(false);
            }}
          />
        </PopoverBox>
      )}
    </div>
  );
}

function OrderDetailModal({ order, onClose }) {
  const [lightboxImage, setLightboxImage] = useState(null);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <>
      <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg max-h-[85vh] overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl text-text">Chi tiết đơn hàng</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Đóng"
              className="w-8 h-8 rounded-full hover:bg-text/5 flex items-center justify-center text-text/60 hover:text-text transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-3 text-sm">
            <p className="text-text/40 text-xs font-mono">Mã đơn: {order._id}</p>

            <div className="flex justify-between gap-4">
              <span className="text-text/60">Khách hàng</span>
              <span className="text-text font-medium text-right">
                {order.customerId?.name || 'Khách vãng lai'}
                {order.source === 'manual' && (
                  <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-accent/40 text-text/70">Tại quầy</span>
                )}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-text/60">Số điện thoại</span>
              <span className="text-text font-medium">{order.customerId?.phone || '—'}</span>
            </div>

            <div className="pt-2 border-t border-primary/10">
              <p className="text-text/60 mb-1">Sản phẩm</p>
              <div className="space-y-2">
                {order.items.map((item, index) => {
                  const itemImage = item.image || item.productId?.images?.[0];
                  return (
                  <div key={index} className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => itemImage && setLightboxImage(itemImage)}
                      disabled={!itemImage}
                      className="w-12 h-12 rounded-lg overflow-hidden bg-accent/20 shrink-0 disabled:cursor-default"
                    >
                      {itemImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={cloudinaryThumbUrl(itemImage, 96)}
                          alt=""
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-text/30 text-xs">
                          🎂
                        </div>
                      )}
                    </button>
                    <div className="flex-1 flex justify-between gap-4">
                      <span className="text-text">
                        {item.productId?.name?.vi ||
                          (order.source === 'manual' ? 'Bán tại quầy' : 'Sản phẩm đã xoá')}
                        {item.sizeLabel ? ` (${item.sizeLabel})` : ''} x{item.quantity}
                        {item.note && (
                          <span className="block text-text/50 italic text-xs">Ghi chú: {item.note}</span>
                        )}
                      </span>
                      <span className="text-text/70 whitespace-nowrap">
                        {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 border-t border-primary/10 space-y-2">
              <div className="flex justify-between gap-4">
                <span className="text-text/60">Ngày nhận</span>
                <span className="text-text font-medium">{formatDateTime(order.deliveryDate)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-text/60">Nhận hàng</span>
                <span className="text-text font-medium">
                  {order.deliveryMethod === 'pickup' ? 'Tự lấy tại tiệm' : 'Giao tận nơi'}
                </span>
              </div>
              {order.deliveryMethod === 'delivery' && order.address && (
                <div className="flex justify-between gap-4">
                  <span className="text-text/60 shrink-0">Địa chỉ</span>
                  <span className="text-text text-right">{order.address}</span>
                </div>
              )}
              <div className="flex justify-between gap-4">
                <span className="text-text/60">Thanh toán</span>
                <span className="text-text font-medium">
                  {order.paymentMethod === 'qr' ? 'QR' : 'COD'} —{' '}
                  {order.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chờ thanh toán'}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-text/60">Trạng thái</span>
                <span className="text-text font-medium">{STATUS_LABELS[order.status]}</span>
              </div>
              {order.createdAt && (
                <div className="flex justify-between gap-4">
                  <span className="text-text/60">Ngày tạo đơn</span>
                  <span className="text-text/70">{formatDateTime(order.createdAt)}</span>
                </div>
              )}
              <div className="flex justify-between gap-4 pt-2 border-t border-primary/10">
                <span className="text-text font-medium">Tổng tiền</span>
                <span className="text-primary-dark font-semibold">
                  {order.totalAmount.toLocaleString('vi-VN')}đ
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {lightboxImage && (
        <div
          className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxImage(null)}
            aria-label="Đóng"
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightboxImage}
            alt=""
            className="max-w-full max-h-full rounded-xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>,
    document.body
  );
}

function OrderEditModal({ order, onClose, onSaved }) {
  const isManual = order.source === 'manual';
  const [quantity, setQuantity] = useState(order.items?.[0]?.quantity || 1);
  const [price, setPrice] = useState(order.items?.[0]?.price ?? '');
  const [note, setNote] = useState(order.items?.[0]?.note || '');
  const [date, setDate] = useState(
    isManual ? toDateInputValue(order.createdAt) : toDatetimeLocalValue(order.deliveryDate)
  );
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

  if (typeof document === 'undefined') return null;

  return createPortal(
    <>
      <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl text-text">Sửa đơn hàng</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Đóng"
              className="w-8 h-8 rounded-full hover:bg-text/5 flex items-center justify-center text-text/60 hover:text-text transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-text/70 text-sm mb-1">
                {isManual ? 'Ngày bán' : 'Ngày giờ nhận'}
              </label>
              <input
                type={isManual ? 'date' : 'datetime-local'}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-primary/40 bg-white px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-text/70 text-sm mb-1">Số lượng</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full rounded-xl border border-primary/40 bg-white px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-text/70 text-sm mb-1">Giá (đ)</label>
              <MoneyInput
                value={price}
                onChange={setPrice}
                className="w-full rounded-xl border border-primary/40 bg-white px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-text/70 text-sm mb-1">Ghi chú</label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full rounded-xl border border-primary/40 bg-white px-3 py-2 text-sm"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-text">
              <input
                type="checkbox"
                checked={countInRevenue}
                onChange={(e) => setCountInRevenue(e.target.checked)}
              />
              Tính vào doanh thu
            </label>
          </div>

          {error && <p className="text-red-600 text-sm mt-3">{error}</p>}

          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 border border-primary/40 text-text hover:border-primary disabled:opacity-50 px-4 py-2.5 rounded-xl transition-colors font-medium"
            >
              Huỷ
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={submitting}
              className="flex-1 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white px-4 py-2.5 rounded-xl transition-colors font-medium"
            >
              {submitting ? 'Đang lưu...' : 'Lưu'}
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}

export default function OrderAdminTable({ orders, canUpdateStatus }) {
  const router = useRouter();
  const confirm = useConfirm();
  const [pendingId, setPendingId] = useState(null);
  const [customerSearch, setCustomerSearch] = useState('');
  const [phoneSearch, setPhoneSearch] = useState('');
  const [viewOrder, setViewOrder] = useState(null);
  const [editOrder, setEditOrder] = useState(null);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [columnFilters, setColumnFilters] = useState({
    deliveryMethod: [],
    totalAmount: [],
    payment: [],
    status: [],
  });

  const uniqueValues = useMemo(() => {
    const result = {};
    CHECKBOX_COLUMNS.forEach(({ key }) => {
      const set = new Set(orders.map((order) => FIELD_VALUE[key](order)));
      result[key] = Array.from(set).sort((a, b) => a.localeCompare(b, 'vi'));
    });
    return result;
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const search = customerSearch.trim().toLowerCase();
    const phoneQuery = phoneSearch.trim().toLowerCase();
    return orders.filter((order) => {
      if (search && !FIELD_VALUE.customer(order).toLowerCase().includes(search)) return false;
      if (phoneQuery && !FIELD_VALUE.phone(order).toLowerCase().includes(phoneQuery)) return false;

      if (dateRange.from || dateRange.to) {
        const orderDateStr = toLocalDateStr(order.deliveryDate);
        if (dateRange.from && orderDateStr < dateRange.from) return false;
        if (dateRange.to && orderDateStr > dateRange.to) return false;
      }

      if (
        columnFilters.deliveryMethod.length &&
        !columnFilters.deliveryMethod.includes(FIELD_VALUE.deliveryMethod(order))
      )
        return false;
      if (columnFilters.totalAmount.length && !columnFilters.totalAmount.includes(FIELD_VALUE.totalAmount(order)))
        return false;
      if (columnFilters.payment.length && !columnFilters.payment.includes(FIELD_VALUE.payment(order))) return false;
      if (columnFilters.status.length && !columnFilters.status.includes(order.status)) return false;

      return true;
    });
  }, [orders, customerSearch, phoneSearch, dateRange, columnFilters]);

  const sortedOrders = useMemo(() => {
    return [...filteredOrders].sort(
      (a, b) => (STATUS_PRIORITY[a.status] ?? 99) - (STATUS_PRIORITY[b.status] ?? 99)
    );
  }, [filteredOrders]);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    setPage(1);
  }, [filteredOrders]);

  const pagedOrders = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return sortedOrders.slice(startIndex, startIndex + pageSize);
  }, [sortedOrders, page, pageSize]);

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

  async function handleDelete(order) {
    const ok = await confirm({ title: 'Xoá đơn hàng', message: 'Xoá đơn hàng này? Không thể hoàn tác.' });
    if (!ok) return;
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

  if (orders.length === 0) {
    return <p className="text-text/60">Không có đơn hàng nào.</p>;
  }

  return (
    <div>
      <HorizontalScroller className="overflow-x-auto">
        <table className="w-full min-w-[1040px] bg-white/60 rounded-2xl overflow-hidden">
          <thead>
            <tr className="text-left text-text/70 text-sm border-b border-primary/20">
              <th className="px-4 py-3">STT</th>
              <th className="px-4 py-3">
                <TextFilterButton
                  label="Khách hàng"
                  selected={customerSearch}
                  onApply={setCustomerSearch}
                  placeholder="Nhập tên khách..."
                />
              </th>
              <th className="px-4 py-3">
                <TextFilterButton
                  label="Số điện thoại"
                  selected={phoneSearch}
                  onApply={setPhoneSearch}
                  placeholder="Nhập số điện thoại..."
                />
              </th>
              <th className="px-4 py-3">Sản phẩm</th>
              <th className="px-4 py-3">
                <DateRangeFilterButton label="Ngày nhận" selected={dateRange} onApply={setDateRange} />
              </th>
              <th className="px-4 py-3">
                <CheckboxFilterButton
                  label="Nhận hàng"
                  options={uniqueValues.deliveryMethod.map((v) => ({ value: v, label: v }))}
                  selected={columnFilters.deliveryMethod}
                  onApply={(vals) => setColumnFilters((prev) => ({ ...prev, deliveryMethod: vals }))}
                />
              </th>
              <th className="px-4 py-3">
                <CheckboxFilterButton
                  label="Tổng tiền"
                  options={uniqueValues.totalAmount.map((v) => ({ value: v, label: v }))}
                  selected={columnFilters.totalAmount}
                  onApply={(vals) => setColumnFilters((prev) => ({ ...prev, totalAmount: vals }))}
                />
              </th>
              <th className="px-4 py-3">
                <CheckboxFilterButton
                  label="Thanh toán"
                  options={uniqueValues.payment.map((v) => ({ value: v, label: v }))}
                  selected={columnFilters.payment}
                  onApply={(vals) => setColumnFilters((prev) => ({ ...prev, payment: vals }))}
                />
              </th>
              <th className="px-4 py-3">
                <CheckboxFilterButton
                  label="Trạng thái"
                  options={STATUS_OPTIONS.map((s) => ({ value: s, label: STATUS_LABELS[s] }))}
                  selected={columnFilters.status}
                  onApply={(vals) => setColumnFilters((prev) => ({ ...prev, status: vals }))}
                />
              </th>
              <th className="px-4 py-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-6 text-center text-text/50 text-sm">
                  Không có đơn hàng phù hợp với bộ lọc.
                </td>
              </tr>
            ) : (
              pagedOrders.map((order, rowIndex) => (
                <tr key={order._id} className="border-b border-primary/10 last:border-0 align-top">
                  <td className="px-4 py-3 text-text/70 text-sm whitespace-nowrap">
                    {(page - 1) * pageSize + rowIndex + 1}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-text">{order.customerId?.name || 'Khách vãng lai'}</p>
                      {order.source === 'manual' && (
                        <span className="px-2 py-0.5 rounded-full text-xs bg-accent/40 text-text/70 shrink-0">
                          Tại quầy
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-text/70 text-sm whitespace-nowrap">
                    {order.customerId?.phone}
                  </td>
                  <td className="px-4 py-3 text-text/70 text-sm">
                    {order.items.map((item, index) => (
                      <p key={index} className="whitespace-nowrap">
                        {item.productId?.name?.vi ||
                          (order.source === 'manual' ? 'Bán tại quầy' : 'Sản phẩm đã xoá')}
                        {item.sizeLabel ? ` (${item.sizeLabel})` : ''} x{item.quantity}
                        {item.note && (
                          <span className="block text-text/50 italic whitespace-normal">Ghi chú: {item.note}</span>
                        )}
                      </p>
                    ))}
                  </td>
                  <td className="px-4 py-3 text-text/70 text-sm whitespace-nowrap">
                    {formatDateTime(order.deliveryDate)}
                  </td>
                  <td className="px-4 py-3 text-text/70 text-sm whitespace-nowrap">
                    {order.deliveryMethod === 'pickup' ? 'Tự lấy tại tiệm' : 'Giao tận nơi'}
                  </td>
                  <td className="px-4 py-3 text-text font-medium whitespace-nowrap">
                    {order.totalAmount.toLocaleString('vi-VN')}đ
                  </td>
                  <td className="px-4 py-3 text-text/70 text-sm whitespace-nowrap">
                    {order.paymentMethod === 'qr' ? 'QR' : 'COD'} —{' '}
                    {order.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chờ thanh toán'}
                  </td>
                  <td className="px-4 py-3">
                    {canUpdateStatus ? (
                      <select
                        value={order.status}
                        disabled={pendingId === order._id}
                        onChange={(e) => handleStatusChange(order, e.target.value)}
                        className="bg-transparent text-sm text-text hover:text-primary focus:outline-none disabled:opacity-50 cursor-pointer transition-colors"
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
                  <td className="px-4 py-3">
                    <div className="flex gap-3 text-sm whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => setViewOrder(order)}
                        className="text-primary-dark hover:underline"
                      >
                        Xem
                      </button>
                      {canUpdateStatus && (
                        <button
                          type="button"
                          onClick={() => setEditOrder(order)}
                          className="text-primary-dark hover:underline"
                        >
                          Sửa
                        </button>
                      )}
                      {canUpdateStatus && (
                        <button
                          type="button"
                          disabled={pendingId === order._id}
                          onClick={() => handleDelete(order)}
                          className="text-red-600 hover:underline disabled:opacity-50"
                        >
                          Xoá
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </HorizontalScroller>
      <Pagination
        total={filteredOrders.length}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(n) => {
          setPageSize(n);
          setPage(1);
        }}
        itemLabel="đơn hàng"
      />
      {viewOrder && <OrderDetailModal order={viewOrder} onClose={() => setViewOrder(null)} />}
      {editOrder && (
        <OrderEditModal
          order={editOrder}
          onClose={() => setEditOrder(null)}
          onSaved={() => {
            setEditOrder(null);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
