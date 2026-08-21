import { getCurrentAdmin } from '@/lib/auth';
import { getProductCategories } from '@/lib/adminApi';
import ProductForm from '@/components/admin/ProductForm';
import BackLink from '@/components/admin/BackLink';

export default async function AdminNewProductPage() {
  const admin = await getCurrentAdmin();

  if (admin.role !== 'owner') {
    return <p className="text-text/70">Bạn không có quyền truy cập trang này.</p>;
  }

  const categories = await getProductCategories();

  return (
    <div className="max-w-2xl mx-auto">
      <BackLink href="/admin/san-pham" label="← Danh sách mẫu bánh" />
      <h1 className="font-serif text-2xl text-text mb-6">Thêm mẫu bánh</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
