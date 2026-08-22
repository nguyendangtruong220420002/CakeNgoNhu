import { MapPin, Phone } from 'lucide-react';
import { t } from '@/lib/i18n/getDictionary';

function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94z" />
    </svg>
  );
}

const ICON_SIZE = 14;

const LINK_ICONS = {
  facebook: <FacebookIcon width={ICON_SIZE} height={ICON_SIZE} />,
};

export default function Footer({ settings, locale }) {
  if (!settings) return null;

  const links = [
    settings.facebookUrl && {
      key: 'facebook',
      href: settings.facebookUrl,
      label: t(locale, 'footer.facebook'),
      external: true,
    },
  ].filter(Boolean);

  return (
    <footer className="mt-12 border-t-2 border-accent/60 bg-white/40 pb-[76px] md:pb-0">
      <div className="max-w-4xl mx-auto px-4 pt-8 pb-5 flex flex-col items-center text-center md:items-start md:text-left gap-3">
        <div className="flex flex-col items-center md:items-start gap-3 w-full">
          <p className="font-serif text-xl text-text">{settings.shopName}</p>
          <div className="flex items-start gap-3 w-full">
            <div className="space-y-2.5 text-sm text-text/70">
              {settings.address && (
                <p className="flex items-start gap-2.5">
                  <span className="shrink-0 w-6 h-6 flex items-center justify-center rounded-lg border border-primary/40 text-text mt-0.5">
                    <MapPin size={ICON_SIZE} />
                  </span>
                  <span className="text-left">{settings.address}</span>
                </p>
              )}
              {settings.hotline && (
                <p className="flex items-center gap-2.5">
                  <span className="shrink-0 w-6 h-6 flex items-center justify-center rounded-lg border border-primary/40 text-text">
                    <Phone size={ICON_SIZE} />
                  </span>
                  <a href={`tel:${settings.hotline}`} className="hover:text-primary transition-colors">
                    {settings.hotline}
                  </a>
                </p>
              )}
              {links.map((link) => (
                <p key={link.key} className="flex items-center gap-2.5">
                  <span className="shrink-0 w-6 h-6 flex items-center justify-center rounded-lg border border-primary/40 text-text">
                    {LINK_ICONS[link.key]}
                  </span>
                  <a
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    className="hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </p>
              ))}
            </div>

            {settings.address && (
              <a
                href={settings.googleMapsUrl || `https://www.google.com/maps?q=${encodeURIComponent(`${settings.shopName} ${settings.address}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t(locale, 'footer.maps')}
                className="shrink-0 w-32 h-32 md:w-auto md:flex-1 rounded-lg overflow-hidden border border-primary/30 block"
              >
                <iframe
                  title="Bản đồ nhỏ"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(`${settings.shopName} ${settings.address}`)}&output=embed`}
                  className="w-full h-full border-0 pointer-events-none"
                  loading="lazy"
                  tabIndex={-1}
                />
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="border-t border-primary/10 py-3 text-center text-sm text-text/40">
        © {new Date().getFullYear()} {settings.shopName}
      </div>
    </footer>
  );
}
