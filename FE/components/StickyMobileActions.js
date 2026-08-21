import { t } from '@/lib/i18n/getDictionary';

export default function StickyMobileActions({ settings, locale }) {
  const phone = settings?.hotline || '0123456789';
  const zaloUrl = `https://zalo.me/${phone.replace(/^0/, '84')}`;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-t border-primary/20 px-4 py-3 flex gap-2">
      <a
        href={`tel:${phone}`}
        aria-label={t(locale, 'sticky.call')}
        className="shrink-0 w-12 h-12 flex items-center justify-center border border-primary text-primary rounded-xl"
      >
        📞
      </a>
      <a
        href={zaloUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t(locale, 'sticky.zalo')}
        className="shrink-0 w-12 h-12 flex items-center justify-center border border-primary text-primary rounded-xl text-xs font-medium"
      >
        Zalo
      </a>
      <a
        href="/san-pham"
        className="flex-1 text-center bg-primary hover:bg-primary-dark text-white font-medium px-4 py-3 rounded-xl transition-colors"
      >
        {t(locale, 'sticky.order')}
      </a>
    </div>
  );
}
