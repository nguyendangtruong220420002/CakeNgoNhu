import { t } from '@/lib/i18n/getDictionary';

export default function Footer({ settings, locale }) {
  if (!settings) return null;

  return (
    <footer className="border-t border-primary/10 px-4 py-8 mt-12 text-sm text-text/70">
      <div className="max-w-4xl mx-auto space-y-2">
        <p className="font-serif text-lg text-text">{settings.shopName}</p>
        {settings.address && <p>📍 {settings.address}</p>}
        {settings.hotline && (
          <p>
            📞{' '}
            <a href={`tel:${settings.hotline}`} className="hover:text-primary">
              {settings.hotline}
            </a>
          </p>
        )}
        <div className="flex flex-wrap gap-4 pt-2">
          {settings.facebookUrl && (
            <a
              href={settings.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary"
            >
              {t(locale, 'footer.facebook')}
            </a>
          )}
          {settings.googleMapsUrl && (
            <a
              href={settings.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary"
            >
              {t(locale, 'footer.maps')}
            </a>
          )}
          <a href="/lien-he" className="hover:text-primary">
            {t(locale, 'footer.contact')}
          </a>
        </div>
      </div>
    </footer>
  );
}
