import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/auth';
import { getShopSettings } from '@/lib/api';
import AdminHeaderAction from '@/components/admin/AdminHeaderAction';

export default async function AdminLayout({ children }) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect('/admin/login');
  }

  const settings = await getShopSettings();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-primary/20 px-4 py-3 flex items-center justify-between gap-3">
        <Link href="/" className="min-w-0 hover:opacity-80 transition-opacity">
          <p className="font-serif text-lg text-text truncate">
            {settings?.shopName || 'Ngô Như Cake Studio'} Admin
          </p>
          <p className="text-text/60 text-sm truncate">
            {admin.name} — {admin.role === 'owner' ? 'Chủ tiệm' : 'Nhân viên'}
          </p>
        </Link>
        <div className="shrink-0 flex items-center gap-2">
          <AdminHeaderAction />
        </div>
      </header>
      <main className="p-4">{children}</main>
    </div>
  );
}
