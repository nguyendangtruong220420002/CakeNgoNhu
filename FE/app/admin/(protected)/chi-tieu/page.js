import { getCurrentAdmin } from '@/lib/auth';
import { getExpenseCategories, getExpenses } from '@/lib/adminApi';
import ExpenseForm from '@/components/admin/ExpenseForm';
import ExpenseTable from '@/components/admin/ExpenseTable';
import ExpenseCategoryManager from '@/components/admin/ExpenseCategoryManager';

export default async function AdminExpensePage() {
  const admin = await getCurrentAdmin();
  const categories = await getExpenseCategories();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="font-serif text-2xl text-text mb-6">Chi tiêu</h1>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <ExpenseForm categories={categories} />
        {admin.role === 'owner' && <ExpenseCategoryManager categories={categories} />}
      </div>

      {admin.role === 'owner' && <ExpenseTableSection />}
    </div>
  );
}

async function ExpenseTableSection() {
  const expenses = await getExpenses();
  return (
    <div>
      <h2 className="font-serif text-xl text-text mb-4">Lịch sử chi tiêu</h2>
      <ExpenseTable expenses={expenses} />
    </div>
  );
}
