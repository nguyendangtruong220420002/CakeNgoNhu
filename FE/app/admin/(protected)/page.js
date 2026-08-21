import Link from 'next/link';
import { getCurrentAdmin } from '@/lib/auth';

export default async function AdminDashboardPage() {
  const admin = await getCurrentAdmin();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="font-serif text-2xl text-text mb-2">Xin chào, {admin.name}</h1>
      <p className="text-text/70 mb-6">
        Vai trò: {admin.role === 'owner' ? 'Chủ tiệm (toàn quyền)' : 'Nhân viên'}
      </p>

      <div className="grid sm:grid-cols-2 gap-4">
        <Link href="/admin/don-hang" className="bg-white/60 rounded-2xl p-4 hover:shadow-md transition-shadow">
          <p className="font-medium text-text mb-1">Đơn hàng</p>
          <p className="text-text/60 text-sm">Xem và cập nhật trạng thái đơn hàng</p>
        </Link>
        <Link href="/admin/chi-tieu" className="bg-white/60 rounded-2xl p-4 hover:shadow-md transition-shadow">
          <p className="font-medium text-text mb-1">Chi tiêu</p>
          <p className="text-text/60 text-sm">Nhập khoản chi theo mục</p>
        </Link>

        {admin.role === 'owner' && (
          <>
            <Link href="/admin/san-pham" className="bg-white/60 rounded-2xl p-4 hover:shadow-md transition-shadow">
              <p className="font-medium text-text mb-1">Mẫu bánh</p>
              <p className="text-text/60 text-sm">Quản lý CRUD mẫu bánh</p>
            </Link>
            <Link href="/admin/doanh-thu" className="bg-white/60 rounded-2xl p-4 hover:shadow-md transition-shadow">
              <p className="font-medium text-text mb-1">Doanh thu</p>
              <p className="text-text/60 text-sm">Doanh thu theo ngày (online + nhập tay)</p>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
