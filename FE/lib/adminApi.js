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

export async function getExpenses({ from, to } = {}) {
  const qs = new URLSearchParams();
  if (from) qs.set('from', from);
  if (to) qs.set('to', to);
  const suffix = qs.toString() ? `?${qs.toString()}` : '';

  const res = await adminFetch(`/api/expenses${suffix}`);
  if (!res.ok) return [];
  return res.json();
}

export async function getDailyRevenue({ from, to } = {}) {
  const qs = new URLSearchParams();
  if (from) qs.set('from', from);
  if (to) qs.set('to', to);
  const suffix = qs.toString() ? `?${qs.toString()}` : '';

  const res = await adminFetch(`/api/revenue/daily${suffix}`);
  if (!res.ok) return [];
  return res.json();
}

export async function getManualRevenueEntries({ from, to } = {}) {
  const qs = new URLSearchParams();
  if (from) qs.set('from', from);
  if (to) qs.set('to', to);
  const suffix = qs.toString() ? `?${qs.toString()}` : '';

  const res = await adminFetch(`/api/revenue/manual${suffix}`);
  if (!res.ok) return [];
  return res.json();
}

export async function getProductCategories() {
  const res = await adminFetch('/api/product-categories');
  if (!res.ok) return [];
  return res.json();
}

export async function getProfitReport({ from, to } = {}) {
  const qs = new URLSearchParams();
  if (from) qs.set('from', from);
  if (to) qs.set('to', to);
  const suffix = qs.toString() ? `?${qs.toString()}` : '';

  const res = await adminFetch(`/api/reports/profit${suffix}`);
  if (!res.ok) return { days: [], totals: { totalRevenue: 0, totalExpenses: 0, totalProfit: 0 } };
  return res.json();
}

export async function getCustomers(q) {
  const qs = q ? `?q=${encodeURIComponent(q)}` : '';
  const res = await adminFetch(`/api/customers${qs}`);
  if (!res.ok) return [];
  return res.json();
}
