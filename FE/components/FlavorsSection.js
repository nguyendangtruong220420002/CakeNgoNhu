import { Sparkles } from 'lucide-react';
import HorizontalScroller from './HorizontalScroller';
import { t } from '@/lib/i18n/getDictionary';

const FLAVORS = [
  { image: '/images/mousse-removebg-preview-noshadow-square.png', key: 'home.flavor.mousse' },
  { image: '/images/tiramisu-removebg-preview-noshadow-square.png', key: 'home.flavor.tiramisu' },
  { image: '/images/banhkem-removebg-preview-noshadow-square.png', key: 'home.flavor.creamCake' },
  { image: '/images/bento-removebg-preview-noshadow-square.png', key: 'home.flavor.bento' },
  { image: '/images/bonglantrungmuoi-removebg-preview-noshadow-square.png', key: 'home.flavor.saltedEgg' },
  { image: '/images/fondant-removebg-preview-noshadow-square.png', key: 'home.flavor.fondant' },
];

export default function FlavorsSection({ locale }) {
  return (
    <section className="px-4 pt-1 pb-3 max-w-4xl mx-auto">
      <div className="bg-white/40 border border-[#E8D5BC] rounded-2xl shadow-sm px-4 pt-5 pb-3 text-center">
        <h2 className="font-serif font-bold italic text-text text-base md:text-lg inline-flex items-center gap-2 mb-4">
          <Sparkles className="h-4 w-4 text-accent" aria-hidden="true" />
          {t(locale, 'home.flavorsTitle')}
          <Sparkles className="h-4 w-4 text-accent" aria-hidden="true" />
        </h2>

        <HorizontalScroller className="overflow-x-auto">
          <div className="flex gap-1 md:gap-8 justify-start md:justify-center px-2 w-max mx-auto">
            {FLAVORS.map(({ image, key }) => (
              <div key={key} className="flex flex-col items-center gap-2 shrink-0 w-20">
                <span className="w-[72px] h-[72px] shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image}
                    alt={t(locale, key)}
                    loading="lazy"
                    className="w-full h-full object-contain drop-shadow-[0_6px_6px_rgba(74,46,30,0.25)]"
                  />
                </span>
                <span className="text-text font-semibold text-xs leading-tight">{t(locale, key)}</span>
              </div>
            ))}
          </div>
        </HorizontalScroller>
      </div>
    </section>
  );
}
