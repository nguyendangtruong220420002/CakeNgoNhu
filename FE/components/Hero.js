import { t } from '@/lib/i18n/getDictionary';

export default function Hero({ locale }) {
  return (
    <section className="px-4 pt-12 pb-16 md:pt-20 md:pb-24 text-center max-w-3xl mx-auto">
      <span className="inline-block bg-accent/50 text-text text-sm px-4 py-1 rounded-full mb-4">
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
