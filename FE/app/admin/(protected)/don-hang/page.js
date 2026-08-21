import { getCurrentAdmin } from '@/lib/auth';
import { getAdminOrders } from '@/lib/adminApi';
import OrderAdminTable from '@/components/admin/OrderAdminTable';
import BackLink from '@/components/admin/BackLink';

const STATUS_TABS = [
  { value: '', label: 'Tất cả' },
  { value: 'new', label: 'Mới nhận' },
  { value: 'in_progress', label: 'Đang làm' },
  { value: 'completed', label: 'Hoàn thành' },
  { value: 'delivered', label: 'Đã giao' },
  { value: 'cancelled', label: 'Đã huỷ' },
];

export default async function AdminOrderListPage({ searchParams }) {
  const params = await searchParams;
  const status = params.status || '';

  const [admin, orders] = await Promise.all([getCurrentAdmin(), getAdminOrders(status)]);

  return (
    <div className="max-w-6xl mx-auto">
      <BackLink href="/admin" />
      <h1 className="font-serif text-2xl text-text mb-6">Quản lý đơn hàng</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        {STATUS_TABS.map((tab) => (
          <a
            key={tab.value}
            href={tab.value ? `/admin/don-hang?status=${tab.value}` : '/admin/don-hang'}
            className={`px-4 py-2 rounded-xl border text-sm transition-colors ${
              status === tab.value
                ? 'bg-primary text-white border-primary'
                : 'border-primary/40 text-text hover:border-primary'
            }`}
          >
            {tab.label}
          </a>
        ))}
      </div>

      <OrderAdminTable orders={orders} canUpdateStatus={admin.role === 'owner'} />
    </div>
  );
}
