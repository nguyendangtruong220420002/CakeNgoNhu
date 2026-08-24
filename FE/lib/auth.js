import { cache } from 'react';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Nhiều page.js dưới admin/(protected) đều tự gọi lại getCurrentAdmin() dù layout.js
// đã gọi rồi — bọc trong React cache() để dùng chung 1 kết quả duy nhất trong cùng
// 1 lượt render, tránh gọi API /auth/me lặp lại nhiều lần và tránh race hiếm gặp
// khiến 1 trong các lần gọi đó trả về null giữa chừng làm trang bị lỗi.
export const getCurrentAdmin = cache(async function getCurrentAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return null;

  try {
    const res = await fetch(`${API_URL}/api/auth/me`, {
      headers: { Cookie: `token=${token}` },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error('Không thể xác thực admin:', err.message);
    return null;
  }
});
