import Link from 'next/link';
import { getCurrentAdmin } from '@/lib/auth';

export default async function AdminDashboardPage() {
  const admin = await getCurrentAdmin();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="font-serif text-2xl text-text mb-6">Xin chào, {admin.name}</h1>

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
            <Link href="/admin/loi-nhuan" className="bg-white/60 rounded-2xl p-4 hover:shadow-md transition-shadow">
              <p className="font-medium text-text mb-1">Lợi nhuận</p>
              <p className="text-text/60 text-sm">Doanh thu − chi tiêu, lọc theo ngày</p>
            </Link>
            <Link href="/admin/khach-hang" className="bg-white/60 rounded-2xl p-4 hover:shadow-md transition-shadow">
              <p className="font-medium text-text mb-1">Khách hàng</p>
              <p className="text-text/60 text-sm">Ghi nhận bán tại quầy, lịch sử mua hàng</p>
            </Link>
            <Link href="/admin/cai-dat" className="bg-white/60 rounded-2xl p-4 hover:shadow-md transition-shadow">
              <p className="font-medium text-text mb-1">Cài đặt cửa hàng</p>
              <p className="text-text/60 text-sm">Tên tiệm, hotline/Zalo, địa chỉ, Facebook</p>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
