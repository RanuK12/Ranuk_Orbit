'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { TESTIMONIALS } from '@/data/content';
import { pickLocalized, cn } from '@/lib/utils';
import type { Locale } from '@/i18n/config';

export default function Testimonials() {
  const t = useTranslations('testimonials');
  const locale = useLocale() as Locale;
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % TESTIMONIALS.length), 7000);
    return () => clearInterval(id);
  }, [paused]);

  const current = TESTIMONIALS[idx]!;

  return (
    <section
      className="section"
      aria-labelledby="testimonials-title"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <p className="text-overline mb-3">{t('overline')}</p>
      <h2 id="testimonials-title" className="section-title mb-14">{t('title')}</h2>

      <blockquote className="max-w-4xl">
        <p className="font-display text-3xl md:text-5xl text-celestial leading-[1.2]" aria-live="polite">
          &ldquo;{pickLocalized(current.quote, locale)}&rdquo;
        </p>
        <footer className="mt-8 font-ui text-[12px] tracking-widest2 uppercase text-celestial/60">
          <span className="text-celestial">{current.name}</span>
          <span className="mx-2 text-celestial/30">/</span>
          <span>{pickLocalized(current.role, locale)}</span>
        </footer>
      </blockquote>

      <div className="mt-12 flex gap-2" role="tablist" aria-label={t('title')}>
        {TESTIMONIALS.map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === idx}
            aria-label={t('slideLabel', { n: i + 1, total: TESTIMONIALS.length })}
            onClick={() => setIdx(i)}
            className="h-11 w-11 flex items-center justify-center"
          >
            <span
              className={cn(
                'block h-2 rounded-full transition-all',
                i === idx ? 'w-6 bg-desert' : 'w-2 bg-celestial/30 hover:bg-celestial/70'
              )}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
