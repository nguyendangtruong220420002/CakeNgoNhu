import { ClipboardList, Truck, Store } from 'lucide-react';
import { t } from '@/lib/i18n/getDictionary';

const CARDS = [
  { icon: ClipboardList, titleKey: 'home.card.custom.title', descKey: 'home.card.custom.desc' },
  { icon: Truck, titleKey: 'home.card.delivery.title', descKey: 'home.card.delivery.desc' },
  { icon: Store, titleKey: 'home.card.pickup.title', descKey: 'home.card.pickup.desc' },
];

export default function FeatureCardsSection({ locale, maxWidth = 'max-w-4xl' }) {
  return (
    <section className={`px-4 pt-3 pb-3 md:pb-4 mx-auto ${maxWidth}`}>
      <div className="grid grid-cols-3 gap-2 md:gap-4">
        {CARDS.map(({ icon: Icon, titleKey, descKey }) => (
          <div
            key={titleKey}
            className="bg-white/60 rounded-2xl shadow-sm p-3 md:p-5 flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-1.5 md:gap-3"
          >
            <span className="w-7 h-7 md:w-9 md:h-9 shrink-0 flex items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon className="h-3.5 w-3.5 md:h-4 md:w-4" aria-hidden="true" />
            </span>
            <div>
              <p className="font-serif font-bold text-text text-[11px] md:text-base leading-tight mb-0.5 md:mb-1">
                {t(locale, titleKey)}
              </p>
              <p className="text-text/70 text-[9px] md:text-sm leading-snug md:leading-relaxed">
                {t(locale, descKey)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
