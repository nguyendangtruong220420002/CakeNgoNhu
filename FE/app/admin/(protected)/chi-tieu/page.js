import { getCurrentAdmin } from '@/lib/auth';
import { getExpenseCategories, getExpenses } from '@/lib/adminApi';
import ExpenseForm from '@/components/admin/ExpenseForm';
import ExpenseTable from '@/components/admin/ExpenseTable';
import ExpenseCategoryManager from '@/components/admin/ExpenseCategoryManager';
import DateRangeFilter from '@/components/admin/DateRangeFilter';
import BackLink from '@/components/admin/BackLink';

export default async function AdminExpensePage({ searchParams }) {
  const admin = await getCurrentAdmin();
  const categories = await getExpenseCategories();

  const params = await searchParams;
  const isAll = params.all === '1' || (!params.from && !params.to);
  const from = isAll ? undefined : params.from;
  const to = isAll ? undefined : params.to;

  return (
    <div className="max-w-4xl mx-auto">
      <BackLink href="/admin" />
      <h1 className="font-serif text-2xl text-text mb-6">Chi tiêu</h1>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <ExpenseForm categories={categories} />
        {admin.role === 'owner' && <ExpenseCategoryManager categories={categories} />}
      </div>

      {admin.role === 'owner' && (
        <ExpenseTableSection categories={categories} from={from} to={to} isAll={isAll} />
      )}
    </div>
  );
}

async function ExpenseTableSection({ categories, from, to, isAll }) {
  const expenses = await getExpenses({ from, to });
  return (
    <div>
      <h2 className="font-serif text-xl text-text mb-4">Lịch sử chi tiêu</h2>
      <DateRangeFilter basePath="/admin/chi-tieu" from={from} to={to} isAll={isAll} />
      <ExpenseTable expenses={expenses} categories={categories} />
    </div>
  );
}
