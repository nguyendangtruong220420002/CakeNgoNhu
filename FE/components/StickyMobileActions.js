const SHOP_PHONE = process.env.NEXT_PUBLIC_SHOP_PHONE || '0123456789';

export default function StickyMobileActions() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-t border-primary/20 px-4 py-3 flex gap-3">
      <a
        href={`tel:${SHOP_PHONE}`}
        className="flex-1 text-center border border-primary text-primary font-medium px-4 py-3 rounded-xl"
      >
        Gọi ngay
      </a>
      <a
        href="/san-pham"
        className="flex-1 text-center bg-primary hover:bg-primary-dark text-white font-medium px-4 py-3 rounded-xl transition-colors"
      >
        Đặt bánh ngay
      </a>
    </div>
  );
}
