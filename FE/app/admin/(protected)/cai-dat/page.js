import { getCurrentAdmin } from '@/lib/auth';
import { getShopSettings } from '@/lib/api';
import ShopSettingsForm from '@/components/admin/ShopSettingsForm';
import BackLink from '@/components/admin/BackLink';

export default async function AdminSettingsPage() {
  const admin = await getCurrentAdmin();

  if (admin.role !== 'owner') {
    return <p className="text-text/70">Bạn không có quyền truy cập trang này.</p>;
  }

  const settings = await getShopSettings();

  return (
    <div className="max-w-xl mx-auto">
      <BackLink href="/admin" />
      <h1 className="font-serif text-2xl text-text mb-6">Cài đặt cửa hàng</h1>
      <ShopSettingsForm initialSettings={settings} />
    </div>
  );
}
