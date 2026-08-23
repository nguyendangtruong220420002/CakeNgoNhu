'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = ''; // gọi qua rewrite cùng origin, xem next.config.js

export default function ShopSettingsForm({ initialSettings }) {
  const router = useRouter();
  const [shopName, setShopName] = useState(initialSettings?.shopName || '');
  const [hotline, setHotline] = useState(initialSettings?.hotline || '');
  const [address, setAddress] = useState(initialSettings?.address || '');
  const [googleMapsUrl, setGoogleMapsUrl] = useState(initialSettings?.googleMapsUrl || '');
  const [facebookUrl, setFacebookUrl] = useState(initialSettings?.facebookUrl || '');
  const [businessHours, setBusinessHours] = useState(initialSettings?.businessHours || '');
  const [notificationEmails, setNotificationEmails] = useState(
    initialSettings?.notificationEmails?.length ? initialSettings.notificationEmails : ['']
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  function updateEmail(index, value) {
    setNotificationEmails((prev) => prev.map((e, i) => (i === index ? value : e)));
  }

  function addEmail() {
    setNotificationEmails((prev) => [...prev, '']);
  }

  function removeEmail(index) {
    setNotificationEmails((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setSubmitting(true);

    try {
      const res = await fetch(`${API_URL}/api/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          shopName: shopName.trim(),
          hotline: hotline.trim(),
          address: address.trim(),
          googleMapsUrl: googleMapsUrl.trim(),
          facebookUrl: facebookUrl.trim(),
          businessHours: businessHours.trim(),
          notificationEmails: notificationEmails.map((e) => e.trim()).filter(Boolean),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Lưu thất bại');
        return;
      }

      setSuccess(true);
      router.refresh();
    } catch (err) {
      setError('Không thể kết nối tới server');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
      <div>
        <label className="block text-text font-medium mb-2" htmlFor="shopName">
          Tên tiệm
        </label>
        <input
          id="shopName"
          type="text"
          value={shopName}
          onChange={(e) => setShopName(e.target.value)}
          className="w-full rounded-xl border border-primary/40 bg-white px-4 py-3 text-text focus:outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="block text-text font-medium mb-2" htmlFor="hotline">
          Hotline / Zalo
        </label>
        <input
          id="hotline"
          type="text"
          value={hotline}
          onChange={(e) => setHotline(e.target.value)}
          placeholder="VD: 0981398552"
          className="w-full rounded-xl border border-primary/40 bg-white px-4 py-3 text-text focus:outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="block text-text font-medium mb-2" htmlFor="address">
          Địa chỉ
        </label>
        <input
          id="address"
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full rounded-xl border border-primary/40 bg-white px-4 py-3 text-text focus:outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="block text-text font-medium mb-2" htmlFor="googleMapsUrl">
          Link Google Maps
        </label>
        <input
          id="googleMapsUrl"
          type="text"
          value={googleMapsUrl}
          onChange={(e) => setGoogleMapsUrl(e.target.value)}
          placeholder="https://maps.app.goo.gl/..."
          className="w-full rounded-xl border border-primary/40 bg-white px-4 py-3 text-text focus:outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="block text-text font-medium mb-2" htmlFor="facebookUrl">
          Link Facebook
        </label>
        <input
          id="facebookUrl"
          type="text"
          value={facebookUrl}
          onChange={(e) => setFacebookUrl(e.target.value)}
          placeholder="https://facebook.com/..."
          className="w-full rounded-xl border border-primary/40 bg-white px-4 py-3 text-text focus:outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="block text-text font-medium mb-2" htmlFor="businessHours">
          Giờ mở cửa
        </label>
        <input
          id="businessHours"
          type="text"
          value={businessHours}
          onChange={(e) => setBusinessHours(e.target.value)}
          placeholder="VD: 08:00 - 20:00 (Mỗi ngày)"
          className="w-full rounded-xl border border-primary/40 bg-white px-4 py-3 text-text focus:outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="block text-text font-medium mb-2">Email nhận thông báo đơn hàng mới</label>
        <p className="text-text/50 text-sm mb-3">
          Mỗi khi khách đặt hàng, hệ thống sẽ gửi email chi tiết đơn hàng tới các địa chỉ dưới đây.
        </p>
        <div className="space-y-2">
          {notificationEmails.map((email, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => updateEmail(index, e.target.value)}
                placeholder="vd: chutiem@gmail.com"
                className="flex-1 rounded-xl border border-primary/40 bg-white px-4 py-3 text-text focus:outline-none focus:border-primary"
              />
              {notificationEmails.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeEmail(index)}
                  className="px-3 text-text/60 hover:text-red-600"
                >
                  Xoá
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addEmail}
          className="mt-2 text-sm text-primary-dark hover:underline"
        >
          + Thêm email
        </button>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}
      {success && <p className="text-primary-dark text-sm">Đã lưu thông tin cửa hàng.</p>}

      <button
        type="submit"
        disabled={submitting}
        className="bg-primary hover:bg-primary-dark disabled:opacity-50 text-white px-6 py-3 rounded-xl transition-colors font-medium"
      >
        {submitting ? 'Đang lưu...' : 'Lưu thay đổi'}
      </button>
    </form>
  );
}
