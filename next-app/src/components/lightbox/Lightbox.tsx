'use client';

import FocusTrap from 'focus-trap-react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { useCallback, useEffect } from 'react';
import { pickLocalized } from '@/lib/utils';
import type { Locale } from '@/i18n/config';
import type { MediaItem } from '@/types';

interface LightboxProps {
  items: MediaItem[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function Lightbox({ items, index, onClose, onPrev, onNext }: LightboxProps) {
  const t = useTranslations('archive');
  const locale = useLocale() as Locale;
  const item = items[index];

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') { e.preventDefault(); onClose(); }
    else if (e.key === 'ArrowRight') onNext();
    else if (e.key === 'ArrowLeft') onPrev();
  }, [onClose, onNext, onPrev]);

  useEffect(() => {
    document.addEventListener('keydown', handleKey, true);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey, true);
      document.body.style.overflow = '';
    };
  }, [handleKey]);

  if (!item) return null;

  const displayTitle = pickLocalized(item.title, locale);

  return (
    <FocusTrap focusTrapOptions={{ escapeDeactivates: false, initialFocus: false }}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={displayTitle}
        className="fixed inset-0 z-[60] bg-ink/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={t('closeLightbox')}
          className="absolute top-4 right-4 w-11 h-11 flex items-center justify-center text-celestial text-3xl z-10"
        >
          ×
        </button>

        <button
          type="button"
          onClick={onPrev}
          aria-label={t('prevItem')}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center text-celestial text-2xl z-10 rounded-full border border-line-strong hover:border-celestial hover:bg-celestial/10 transition-colors"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={onNext}
          aria-label={t('nextItem')}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center text-celestial text-2xl z-10 rounded-full border border-line-strong hover:border-celestial hover:bg-celestial/10 transition-colors"
        >
          ›
        </button>

        <figure className="max-w-5xl w-full max-h-full flex flex-col">
          <div className="relative flex-1 min-h-0 w-full rounded-sm overflow-hidden bg-ink-soft/60">
            {item.type === 'photo' ? (
              <Image
                src={item.src}
                alt={displayTitle}
                width={1920}
                height={1280}
                className="w-full h-auto max-h-[80vh] object-contain"
                priority
              />
            ) : (
              <video
                src={item.src}
                poster={item.poster}
                controls
                autoPlay
                playsInline
                className="w-full h-auto max-h-[80vh]"
                aria-label={displayTitle}
              />
            )}
          </div>
          <figcaption className="mt-4 flex items-center justify-between gap-4 text-sm text-celestial/70">
            <span className="font-ui text-[11px] tracking-widest2 uppercase">{displayTitle}</span>
            <span className="text-[11px] text-celestial/50">{index + 1} / {items.length}</span>
          </figcaption>
        </figure>
      </div>
    </FocusTrap>
  );
}
