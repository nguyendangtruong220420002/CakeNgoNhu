'use client';

import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch(`${API_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="text-sm font-medium text-text bg-white border border-primary/40 shadow-sm hover:border-primary hover:text-primary-dark px-3 py-2 rounded-xl transition-colors"
    >
      Đăng xuất
    </button>
  );
}
