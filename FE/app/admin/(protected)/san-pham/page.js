import Link from 'next/link';
import { getCurrentAdmin } from '@/lib/auth';
import { getAdminProducts } from '@/lib/adminApi';
import ProductAdminTable from '@/components/admin/ProductAdminTable';

export default async function AdminProductListPage() {
  const admin = await getCurrentAdmin();

  if (admin.role !== 'owner') {
    return <p className="text-text/70">Bạn không có quyền truy cập trang này.</p>;
  }

  const products = await getAdminProducts();

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl text-text">Quản lý mẫu bánh</h1>
        <Link
          href="/admin/san-pham/moi"
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl transition-colors text-sm font-medium"
        >
          + Thêm mẫu bánh
        </Link>
      </div>

      <ProductAdminTable products={products} />
    </div>
  );
}
