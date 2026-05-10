'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { SERVICES, FAQ, PROCESS } from '@/data/content';
import { pickLocalized, cn } from '@/lib/utils';
import SectionHead from '@/components/ui/SectionHead';
import type { Locale } from '@/i18n/config';

export default function Services() {
  const t = useTranslations('services');
  const locale = useLocale() as Locale;

  return (
    <section id="services" className="section">
      <SectionHead overline={t('overline')} title={t('title')} sub={t('sub')} />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {SERVICES.map((pkg) => (
          <article
            key={pkg.id}
            className={cn(
              'card flex flex-col h-full',
              pkg.popular && 'card--featured ring-1 ring-desert/30 relative'
            )}
          >
            {pkg.popular && (
              <span className="absolute -top-3 left-6 px-3 py-1 text-[10px] tracking-widest2 uppercase font-ui bg-desert text-ink rounded-full">
                {t('popular')}
              </span>
            )}
            <p className="text-overline mb-3">{pickLocalized(pkg.tag, locale)}</p>
            <h3 className="font-display text-3xl text-celestial">{pickLocalized(pkg.title, locale)}</h3>
            <p className="mt-2 flex items-baseline gap-1 font-ui tracking-widest2 text-celestial">
              <span className="text-2xl font-display tracking-normal">{pkg.price}</span>
              <span className="text-[11px] text-celestial/50 uppercase">{pickLocalized(pkg.unit, locale)}</span>
            </p>
            <p className="mt-4 text-sm text-celestial/70 leading-[1.6]">{pickLocalized(pkg.desc, locale)}</p>
            <ul className="mt-6 space-y-2 flex-1">
              {pkg.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-celestial/80">
                  <span aria-hidden="true" className="text-desert mt-0.5">⊕</span>
                  <span>{pickLocalized(f, locale)}</span>
                </li>
              ))}
            </ul>
            <a href="#contact" className="mt-8 btn-link self-start">{t('cta')} →</a>
          </article>
        ))}
      </div>

      {/* Trust badges */}
      <div className="mt-16 pt-10 border-t border-line">
        <p className="text-overline mb-5">{t('trustTitle')}</p>
        <ul className="flex flex-wrap gap-3">
          {(['worldwide', 'fourK', 'licensed', 'insured'] as const).map((k) => (
            <li key={k} className="chip pointer-events-none">
              {t(`trustBadges.${k}`)}
            </li>
          ))}
        </ul>
      </div>

      {/* Process */}
      <div className="mt-24">
        <p className="text-overline mb-3">{t('processOverline')}</p>
        <h3 className="font-display text-3xl md:text-5xl text-celestial mb-3">{t('processTitle')}</h3>
        <p className="font-italic italic text-celestial-warm max-w-xl mb-10">{t('processSub')}</p>
        <ol className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {PROCESS.map((step) => (
            <li key={step.n} className="border-t border-line pt-6">
              <span className="font-display text-4xl text-desert">{step.n}</span>
              <h4 className="mt-3 font-ui text-sm tracking-widest2 uppercase text-celestial">{pickLocalized(step.title, locale)}</h4>
              <p className="mt-2 text-sm text-celestial/70 leading-[1.6]">{pickLocalized(step.body, locale)}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* FAQ */}
      <div className="mt-24">
        <p className="text-overline mb-3">{t('faqOverline')}</p>
        <h3 className="font-display text-3xl md:text-5xl text-celestial mb-10">{t('faqTitle')}</h3>
        <div className="divide-y divide-line border-t border-b border-line">
          {FAQ.map((item, i) => (
            <FaqRow key={i} q={pickLocalized(item.q, locale)} a={pickLocalized(item.a, locale)} id={`faq-${i}`} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqRow({ q, a, id }: { q: string; a: string; id: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left text-celestial hover:text-desert transition-colors"
      >
        <span className="font-ui text-[13px] tracking-[0.22em] uppercase">{q}</span>
        <span aria-hidden="true" className={cn('transition-transform duration-300', open && 'rotate-45')}>+</span>
      </button>
      <div id={`${id}-panel`} className="accordion-panel" data-open={open}>
        <div>
          <p className="pb-6 text-celestial/75 font-italic italic text-lg max-w-3xl">{a}</p>
        </div>
      </div>
    </div>
  );
}
