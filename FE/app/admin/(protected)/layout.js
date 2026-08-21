import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/auth';
import { getShopSettings } from '@/lib/api';
import LogoutButton from '@/components/admin/LogoutButton';

export default async function AdminLayout({ children }) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect('/admin/login');
  }

  const settings = await getShopSettings();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-primary/20 px-4 py-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="font-serif text-lg text-text truncate">
            {settings?.shopName || 'Ngô Như Cake Studio'} Admin
          </p>
          <p className="text-text/60 text-sm truncate">
            {admin.name} — {admin.role === 'owner' ? 'Chủ tiệm' : 'Nhân viên'}
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          <Link
            href="/"
            className="text-sm font-medium text-text bg-white border border-primary/40 shadow-sm hover:border-primary hover:text-primary-dark px-3 py-2 rounded-xl transition-colors"
          >
            ← Về trang chủ
          </Link>
          <LogoutButton />
        </div>
      </header>
      <main className="p-4">{children}</main>
    </div>
  );
}
