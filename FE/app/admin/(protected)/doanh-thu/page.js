import { getCurrentAdmin } from '@/lib/auth';
import { getDailyRevenue, getManualRevenueEntries } from '@/lib/adminApi';
import RevenueTable from '@/components/admin/RevenueTable';
import RevenueManualForm from '@/components/admin/RevenueManualForm';
import RevenueEntryList from '@/components/admin/RevenueEntryList';
import DateRangeFilter from '@/components/admin/DateRangeFilter';

export default async function AdminRevenuePage({ searchParams }) {
  const admin = await getCurrentAdmin();

  if (admin.role !== 'owner') {
    return <p className="text-text/70">Bạn không có quyền truy cập trang này.</p>;
  }

  const params = await searchParams;
  const isAll = params.all === '1' || (!params.from && !params.to);
  const from = isAll ? undefined : params.from;
  const to = isAll ? undefined : params.to;

  const [days, manualEntries] = await Promise.all([
    getDailyRevenue({ from, to }),
    getManualRevenueEntries({ from, to }),
  ]);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="font-serif text-2xl text-text mb-6">Doanh thu theo ngày</h1>

      <div className="mb-8">
        <RevenueManualForm />
      </div>

      <DateRangeFilter basePath="/admin/doanh-thu" from={from} to={to} isAll={isAll} />

      <RevenueTable days={days} />

      <h2 className="font-serif text-xl text-text mb-4 mt-8">Chi tiết doanh thu nhập tay</h2>
      <RevenueEntryList entries={manualEntries} />
    </div>
  );
}
