const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function getProducts({ category } = {}) {
  const url = new URL('/api/products', API_URL);
  if (category) url.searchParams.set('category', category);

  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error('Không thể tải danh sách mẫu bánh:', err.message);
    return [];
  }
}

export async function getProductById(id) {
  try {
    const res = await fetch(`${API_URL}/api/products/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error('Không thể tải mẫu bánh:', err.message);
    return null;
  }
}
