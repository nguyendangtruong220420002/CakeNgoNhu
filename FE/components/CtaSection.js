import { t } from '@/lib/i18n/getDictionary';

export default function CtaSection({ locale }) {
  return (
    <section className="px-4 pt-3 pb-3 max-w-4xl mx-auto">
      <div className="relative bg-white/50 rounded-3xl shadow-sm overflow-hidden p-5 md:p-10">
        <div className="text-left max-w-[60%] md:max-w-[55%]">
          <p className="font-serif italic text-text text-sm md:text-lg leading-relaxed mb-4">
            {t(locale, 'home.ctaQuote')}
          </p>
          <a
            href="/san-pham"
            className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary-dark text-white px-5 py-2 md:px-6 md:py-2.5 rounded-full transition-colors font-medium text-xs md:text-sm"
          >
            {t(locale, 'hero.cta')}
            <span aria-hidden="true">→</span>
          </a>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/thu-removebg-preview1.png"
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="absolute bottom-0 right-0 w-44 md:w-56 object-contain drop-shadow-[0_10px_10px_rgba(74,46,30,0.3)]"
        />
      </div>
    </section>
  );
}
