import { getCurrentAdmin } from '@/lib/auth';
import { getAdminOrders } from '@/lib/adminApi';
import OrderAdminTable from '@/components/admin/OrderAdminTable';
import HorizontalScroller from '@/components/HorizontalScroller';

const STATUS_TABS = [
  { value: '', label: 'Tất cả' },
  { value: 'new', label: 'Mới nhận' },
  { value: 'in_progress', label: 'Đang làm' },
  { value: 'completed', label: 'Hoàn thành' },
  { value: 'delivered', label: 'Đã giao' },
  { value: 'cancelled', label: 'Đã huỷ' },
];

const BADGE_STATUSES = ['new', 'in_progress'];

export default async function AdminOrderListPage({ searchParams }) {
  const params = await searchParams;
  const status = params.status || '';

  const [admin, allOrders] = await Promise.all([getCurrentAdmin(), getAdminOrders('')]);
  const orders = status ? allOrders.filter((o) => o.status === status) : allOrders;

  const statusCounts = allOrders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="font-serif text-2xl text-text mb-6">Quản lý đơn hàng</h1>

      <div className="mb-6">
        <HorizontalScroller className="flex flex-nowrap gap-2 overflow-x-auto pt-1.5 pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
          {STATUS_TABS.map((tab) => {
            const count = BADGE_STATUSES.includes(tab.value) ? statusCounts[tab.value] || 0 : 0;
            return (
              <a
                key={tab.value}
                href={tab.value ? `/admin/don-hang?status=${tab.value}` : '/admin/don-hang'}
                className={`relative shrink-0 whitespace-nowrap px-4 py-2 rounded-xl border text-sm transition-colors ${
                  status === tab.value
                    ? 'bg-primary text-white border-primary'
                    : 'border-primary/40 text-text hover:border-primary'
                }`}
              >
                {tab.label}
                {count > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center leading-none">
                    {count}
                  </span>
                )}
              </a>
            );
          })}
        </HorizontalScroller>
      </div>

      <OrderAdminTable orders={orders} canUpdateStatus={admin.role === 'owner'} />
    </div>
  );
}
