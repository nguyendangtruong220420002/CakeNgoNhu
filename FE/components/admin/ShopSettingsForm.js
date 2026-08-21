'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function ShopSettingsForm({ initialSettings }) {
  const router = useRouter();
  const [shopName, setShopName] = useState(initialSettings?.shopName || '');
  const [hotline, setHotline] = useState(initialSettings?.hotline || '');
  const [address, setAddress] = useState(initialSettings?.address || '');
  const [googleMapsUrl, setGoogleMapsUrl] = useState(initialSettings?.googleMapsUrl || '');
  const [facebookUrl, setFacebookUrl] = useState(initialSettings?.facebookUrl || '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

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
