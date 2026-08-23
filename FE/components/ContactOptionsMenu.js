'use client';

import { useEffect, useRef, useState } from 'react';
import { MessageCircle, Phone } from 'lucide-react';
import { t } from '@/lib/i18n/getDictionary';

function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94z" />
    </svg>
  );
}

function ZaloBadge(props) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" {...props}>
      <rect width="48" height="48" rx="10" fill="#0068FF" />
      <text
        x="24"
        y="30"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontWeight="700"
        fontSize="15"
        fill="#fff"
      >
        Zalo
      </text>
    </svg>
  );
}

export default function ContactOptionsMenu({ locale, settings }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const phone = settings?.hotline || '';
  const zaloUrl = phone ? `https://zalo.me/${phone.replace(/^0/, '84')}` : null;
  const facebookUrl = settings?.facebookUrl || null;

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary-dark text-white px-3.5 py-1.5 rounded-full transition-colors font-medium text-xs"
      >
        <MessageCircle className="h-3 w-3" aria-hidden="true" />
        {t(locale, 'home.ideaCta')}
      </button>

      {open && (
        <div className="absolute z-20 top-full left-0 mt-2 flex items-center gap-2 bg-white rounded-full shadow-lg border border-accent/30 px-2.5 py-2">
          {zaloUrl && (
            <a
              href={zaloUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Zalo"
              className="w-9 h-9 rounded-full overflow-hidden shrink-0"
            >
              <ZaloBadge className="w-full h-full" />
            </a>
          )}
          {facebookUrl && (
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: '#1877F2' }}
            >
              <FacebookIcon className="w-5 h-5 text-white" />
            </a>
          )}
          {phone && (
            <a
              href={`tel:${phone}`}
              aria-label={t(locale, 'sticky.call')}
              className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: '#22C55E' }}
            >
              <Phone className="w-4 h-4 text-white" fill="white" aria-hidden="true" />
            </a>
          )}
        </div>
      )}
    </div>
  );
}
