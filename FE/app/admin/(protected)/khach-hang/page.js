import { getCurrentAdmin } from '@/lib/auth';
import { getCustomers } from '@/lib/adminApi';
import ManualSaleForm from '@/components/admin/ManualSaleForm';
import CustomerSearch from '@/components/admin/CustomerSearch';
import CustomerList from '@/components/admin/CustomerList';

export default async function AdminCustomersPage({ searchParams }) {
  const admin = await getCurrentAdmin();

  if (admin.role !== 'owner') {
    return <p className="text-text/70">Bạn không có quyền truy cập trang này.</p>;
  }

  const params = await searchParams;
  const query = params.q || '';

  const customers = await getCustomers(query);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="font-serif text-2xl text-text mb-6">Khách hàng</h1>

      <div className="mb-8">
        <ManualSaleForm />
      </div>

      <h2 className="font-serif text-xl text-text mb-4">Lịch sử mua hàng</h2>
      <CustomerSearch initialQuery={query} />
      <CustomerList customers={customers} />
    </div>
  );
}
