import { Cake } from 'lucide-react';
import { t } from '@/lib/i18n/getDictionary';
import ContactOptionsMenu from './ContactOptionsMenu';

export default function IdeaCtaSection({ locale, settings }) {
  return (
    <section className="px-4 pb-3 max-w-4xl mx-auto">
      <div className="bg-white/40 border border-[#E8D5BC] rounded-2xl shadow-sm px-5 py-5 flex items-start gap-4 text-left">
        <Cake className="h-20 w-20 text-primary shrink-0" strokeWidth={1.25} aria-hidden="true" />
        <div className="flex-1 min-w-0">
          <p className="font-serif text-text text-lg mb-1">{t(locale, 'home.ideaTitle')}</p>
          <p className="text-text/70 text-xs mb-3">{t(locale, 'home.ideaDesc')}</p>
          <ContactOptionsMenu locale={locale} settings={settings} />
        </div>
      </div>
    </section>
  );
}
