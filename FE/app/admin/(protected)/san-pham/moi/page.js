import { getCurrentAdmin } from '@/lib/auth';
import ProductForm from '@/components/admin/ProductForm';

export default async function AdminNewProductPage() {
  const admin = await getCurrentAdmin();

  if (admin.role !== 'owner') {
    return <p className="text-text/70">Bạn không có quyền truy cập trang này.</p>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-serif text-2xl text-text mb-6">Thêm mẫu bánh</h1>
      <ProductForm />
    </div>
  );
}
