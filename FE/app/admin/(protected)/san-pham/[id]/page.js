import { notFound } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/auth';
import { getProductById } from '@/lib/api';
import { getProductCategories } from '@/lib/adminApi';
import ProductForm from '@/components/admin/ProductForm';
import BackLink from '@/components/admin/BackLink';

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

  const categories = await getProductCategories();

  return (
    <div className="max-w-2xl mx-auto">
      <BackLink href="/admin/san-pham" label="← Danh sách mẫu bánh" />
      <h1 className="font-serif text-2xl text-text mb-6">Sửa mẫu bánh</h1>
      <ProductForm initialProduct={product} categories={categories} />
    </div>
  );
}
