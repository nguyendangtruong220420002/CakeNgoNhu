'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const API_URL = ''; // gọi qua rewrite cùng origin, xem next.config.js

export default function AdminLoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Đăng nhập thất bại');
        return;
      }

      router.push('/admin');
      router.refresh();
    } catch (err) {
      setError('Không thể kết nối tới server');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white/60 rounded-2xl p-6">
        <h1 className="font-serif text-2xl text-text text-center mb-6">Đăng nhập</h1>

        <div className="mb-4">
          <label className="block text-text font-medium mb-2" htmlFor="identifier">
            Tên đăng nhập
          </label>
          <input
            id="identifier"
            type="text"
            required
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="w-full rounded-xl border border-primary/40 bg-white px-4 py-3 text-text focus:outline-none focus:border-primary"
          />
        </div>

        <div className="mb-6">
          <label className="block text-text font-medium mb-2" htmlFor="password">
            Mật khẩu
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-primary/40 bg-white px-4 py-3 text-text focus:outline-none focus:border-primary"
          />
        </div>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-primary hover:bg-primary-dark disabled:opacity-50 text-white px-6 py-3 rounded-xl transition-colors font-medium"
        >
          {submitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>

        <Link
          href="/"
          className="block text-center text-sm text-text/60 hover:text-primary mt-4 transition-colors"
        >
          ← Về trang chủ
        </Link>
      </form>
    </main>
  );
}
