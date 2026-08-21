import { getCurrentAdmin } from '@/lib/auth';
import { getDailyRevenue } from '@/lib/adminApi';
import RevenueTable from '@/components/admin/RevenueTable';
import RevenueManualForm from '@/components/admin/RevenueManualForm';

export default async function AdminRevenuePage() {
  const admin = await getCurrentAdmin();

  if (admin.role !== 'owner') {
    return <p className="text-text/70">Bạn không có quyền truy cập trang này.</p>;
  }

  const days = await getDailyRevenue();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="font-serif text-2xl text-text mb-6">Doanh thu theo ngày</h1>

      <div className="mb-8">
        <RevenueManualForm />
      </div>

      <RevenueTable days={days} />
    </div>
  );
}
