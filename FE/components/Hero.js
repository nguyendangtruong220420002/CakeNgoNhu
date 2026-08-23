import { Cake, Sparkles, Truck, Store, Heart } from "lucide-react";
import { t } from "@/lib/i18n/getDictionary";

const FEATURES = [
  { icon: Cake, key: "home.feature.fresh" },
  { icon: Sparkles, key: "home.feature.custom" },
  { icon: Truck, key: "home.feature.delivery" },
  { icon: Store, key: "home.feature.pickup" },
];

export default function Hero({ locale }) {
  return (
    <section className="relative px-4 pt-6 pb-2 md:pt-10 md:pb-8 text-center max-w-3xl mx-auto">
      <span className="inline-flex items-center gap-2 text-primary text-[11px] font-semibold uppercase tracking-[0.15em] mb-4">
        <Cake className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        {t(locale, "hero.badge")}
        <Cake className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      </span>
      <Heart
        className="absolute top-2 right-8 md:right-16 h-3.5 w-3.5 text-accent fill-accent/40 -rotate-12"
        strokeWidth={1.75}
        aria-hidden="true"
      />

      <h1 className="font-serif font-bold text-[#1A1A1A] text-[26px] md:text-[32px] leading-snug mb-1 px-3 md:px-0">
        {t(locale, "hero.title")}
      </h1>

      <p className="text-text text-sm md:text-base leading-relaxed mb-6 max-w-xl mx-auto px-3 md:px-0">
        {t(locale, "hero.description")}
      </p>

      <div className="grid grid-cols-4 gap-2 md:gap-4 max-w-xl mx-auto">
        {FEATURES.map(({ icon: Icon, key }) => (
          <div key={key} className="flex flex-col items-center gap-1.5">
            <Icon
              className="h-[34px] w-[34px] md:h-[38px] md:w-[38px] text-primary"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <span className="text-text/80 text-xs md:text-sm leading-tight">
              {t(locale, key)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
