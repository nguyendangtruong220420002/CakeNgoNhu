import { notFound } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/auth';
import { getProductById } from '@/lib/api';
import ProductForm from '@/components/admin/ProductForm';

export default async function AdminEditProductPage({ params }) {
  const admin = await getCurrentAdmin();

  if (admin.role !== 'owner') {
    return <p className="text-text/70">Bạn không có quyền truy cập trang này.</p>;
  }

  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-serif text-2xl text-text mb-6">Sửa mẫu bánh</h1>
      <ProductForm initialProduct={product} />
    </div>
  );
}
