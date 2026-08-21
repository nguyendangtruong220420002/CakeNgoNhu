import { getCurrentAdmin } from '@/lib/auth';
import { getProfitReport } from '@/lib/adminApi';
import DateRangeFilter from '@/components/admin/DateRangeFilter';
import ProfitTable from '@/components/admin/ProfitTable';
import BackLink from '@/components/admin/BackLink';

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export default async function AdminProfitPage({ searchParams }) {
  const admin = await getCurrentAdmin();

  if (admin.role !== 'owner') {
    return <p className="text-text/70">Bạn không có quyền truy cập trang này.</p>;
  }

  const params = await searchParams;
  const isAll = params.all === '1';
  const from = isAll ? undefined : params.from || todayStr();
  const to = isAll ? undefined : params.to || todayStr();

  const report = await getProfitReport({ from, to });

  return (
    <div className="max-w-4xl mx-auto">
      <BackLink href="/admin" />
      <h1 className="font-serif text-2xl text-text mb-6">Báo cáo lợi nhuận</h1>
      <DateRangeFilter basePath="/admin/loi-nhuan" from={from} to={to} isAll={isAll} />
      <ProfitTable days={report.days} totals={report.totals} />
    </div>
  );
}
