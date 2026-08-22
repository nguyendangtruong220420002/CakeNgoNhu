import { t } from '@/lib/i18n/getDictionary';

export default function Hero({ locale }) {
  return (
    <section className="px-4 pt-12 pb-16 md:pt-20 md:pb-24 text-center max-w-3xl mx-auto">
      <span className="inline-flex items-center gap-2 bg-white/60 border border-accent text-primary text-xs md:text-sm font-medium uppercase tracking-wider px-5 py-1.5 rounded-full mb-5 shadow-sm">
        <svg className="h-3.5 w-3.5 text-accent shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2l1.5 3.5L17 7l-3.5 1.5L12 12l-1.5-3.5L7 7l3.5-1.5L12 2z" />
          <path d="M5 15l.8 1.9L7.7 17.7l-1.9.8L5 20.4l-.8-1.9L2.3 17.7l1.9-.8L5 15z" />
          <path d="M19 14l.9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9L19 14z" />
        </svg>
        {t(locale, 'hero.badge')}
      </span>
      <h1 className="font-serif text-3xl md:text-5xl text-text leading-tight mb-4">
        {t(locale, 'hero.title')}
      </h1>
      <p className="text-text/70 text-base md:text-lg mb-2">{t(locale, 'hero.categories')}</p>
      <p className="text-text/70 text-base md:text-lg mb-8">{t(locale, 'hero.tagline')}</p>
      <a
        href="/san-pham"
        className="inline-block bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl transition-colors"
      >
        {t(locale, 'hero.cta')}
      </a>
    </section>
  );
}
