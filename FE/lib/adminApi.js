import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

async function adminFetch(path, options = {}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const headers = { ...(options.headers || {}) };
  if (token) headers.Cookie = `token=${token}`;

  return fetch(`${API_URL}${path}`, { ...options, headers, cache: 'no-store' });
}

export async function getAdminProducts() {
  const res = await adminFetch('/api/products/admin/all');
  if (!res.ok) return [];
  return res.json();
}

export async function getAdminOrders(status) {
  const qs = status ? `?status=${encodeURIComponent(status)}` : '';
  const res = await adminFetch(`/api/orders${qs}`);
  if (!res.ok) return [];
  return res.json();
}

export async function getExpenseCategories() {
  const res = await adminFetch('/api/expense-categories');
  if (!res.ok) return [];
  return res.json();
}

export async function getExpenses() {
  const res = await adminFetch('/api/expenses');
  if (!res.ok) return [];
  return res.json();
}

export async function getDailyRevenue() {
  const res = await adminFetch('/api/revenue/daily');
  if (!res.ok) return [];
  return res.json();
}
