import { getShopSettings } from '@/lib/api';

export const metadata = {
  title: 'Liên hệ — Ngô Như Cake Studio',
};

export default async function ContactPage() {
  const settings = await getShopSettings();

  return (
    <main className="min-h-screen px-4 py-8 md:py-12 max-w-3xl mx-auto">
      <h1 className="font-serif text-2xl md:text-3xl text-text text-center mb-8">Liên hệ</h1>

      {!settings ? (
        <p className="text-text/60 text-center">Không thể tải thông tin liên hệ lúc này.</p>
      ) : (
        <>
          <div className="bg-white/60 rounded-2xl p-6 space-y-3 mb-6">
            <p className="font-serif text-xl text-text">{settings.shopName}</p>
            {settings.address && <p className="text-text/80">📍 {settings.address}</p>}
            {settings.hotline && (
              <p className="text-text/80">
                📞{' '}
                <a href={`tel:${settings.hotline}`} className="text-primary-dark hover:underline">
                  {settings.hotline}
                </a>
              </p>
            )}

            <div className="flex flex-wrap gap-3 pt-2">
              {settings.hotline && (
                <a
                  href={`https://zalo.me/${settings.hotline.replace(/^0/, '84')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl transition-colors text-sm"
                >
                  Chat Zalo
                </a>
              )}
              {settings.facebookUrl && (
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-primary/40 text-text hover:border-primary px-4 py-2 rounded-xl transition-colors text-sm"
                >
                  Facebook
                </a>
              )}
              {settings.googleMapsUrl && (
                <a
                  href={settings.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-primary/40 text-text hover:border-primary px-4 py-2 rounded-xl transition-colors text-sm"
                >
                  Xem trên Google Maps
                </a>
              )}
            </div>
          </div>

          {settings.address && (
            <div className="rounded-2xl overflow-hidden aspect-video">
              <iframe
                title="Bản đồ"
                src={`https://www.google.com/maps?q=${encodeURIComponent(`${settings.shopName} ${settings.address}`)}&output=embed`}
                className="w-full h-full border-0"
                loading="lazy"
              />
            </div>
          )}
        </>
      )}
    </main>
  );
}
