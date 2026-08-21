import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/auth';
import LogoutButton from '@/components/admin/LogoutButton';

export default async function AdminLayout({ children }) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-primary/20 px-4 py-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="font-serif text-lg text-text truncate">CakeNgonNhu Admin</p>
          <p className="text-text/60 text-sm truncate">
            {admin.name} — {admin.role === 'owner' ? 'Chủ tiệm' : 'Nhân viên'}
          </p>
        </div>
        <div className="shrink-0">
          <LogoutButton />
        </div>
      </header>
      <main className="p-4">{children}</main>
    </div>
  );
}
