'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { LOCATIONS, YEARS } from '@/data/locations';
import { pickLocalized, cn } from '@/lib/utils';
import { useInView, useReducedMotion } from '@/hooks/useInView';
import GlobeFallback from '@/components/globe/GlobeFallback';
import SectionHead from '@/components/ui/SectionHead';
import type { Locale } from '@/i18n/config';

const Globe3D = dynamic(() => import('@/components/globe/Globe3D'), {
  ssr: false,
  loading: () => <div className="aspect-square w-full max-w-[580px] mx-auto rounded-full border border-line bg-ink-soft/40 animate-pulse" />,
});

export default function Atlas() {
  const t = useTranslations('atlas');
  const locale = useLocale() as Locale;
  const reducedMotion = useReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin: '300px 0px' });

  const [year, setYear] = useState<'all' | number>('all');
  const [activeId, setActiveId] = useState<string | undefined>(undefined);

  const filtered = useMemo(() => {
    return year === 'all' ? LOCATIONS : LOCATIONS.filter((l) => l.year === year);
  }, [year]);

  const canUseWebGL = typeof window !== 'undefined' && !reducedMotion;

  return (
    <section id="atlas" className="section">
      <SectionHead
        overline={t('overline')}
        title={t('title', { n: LOCATIONS.length })}
        sub={t('sub')}
      />

      <div className="flex flex-wrap gap-3 mb-12" role="group" aria-label={t('filterByYear')}>
        <button
          type="button"
          className={cn('chip', year === 'all' && 'is-active')}
          aria-pressed={year === 'all'}
          onClick={() => setYear('all')}
        >
          {t('yearAll')}
        </button>
        {YEARS.map((y) => (
          <button
            key={y}
            type="button"
            className={cn('chip', year === y && 'is-active')}
            aria-pressed={year === y}
            onClick={() => setYear(y)}
          >
            {y}
          </button>
        ))}
        <span className="chip border-transparent bg-transparent text-celestial/40">
          {t('locations')}: {filtered.length}
        </span>
      </div>

      <div ref={ref} className="grid gap-10 lg:grid-cols-[1.1fr_1fr] items-start">
        {/* Globe (lazy) */}
        <div className="min-h-[400px]">
          {inView && canUseWebGL ? (
            <Globe3D onSelect={setActiveId} activeId={activeId} />
          ) : (
            <GlobeFallback onSelect={setActiveId} activeId={activeId} />
          )}
        </div>

        {/* Sidebar */}
        <div className="max-h-[580px] overflow-y-auto pr-2 scroll-smooth">
          <ul className="flex flex-col gap-4">
            {filtered.map((loc) => {
              const isActive = loc.id === activeId;
              return (
                <li key={loc.id}>
                  <button
                    type="button"
                    onClick={() => setActiveId(loc.id)}
                    className={cn(
                      'group w-full text-left flex items-start gap-4 p-4 rounded-md border border-line bg-ink-soft/40 transition-all',
                      isActive ? 'border-celestial/50' : 'hover:border-line-strong'
                    )}
                    style={{ ['--accent' as string]: loc.accentColor }}
                  >
                    <div className="relative w-20 h-20 shrink-0 rounded overflow-hidden border border-line">
                      <Image
                        src={loc.cover}
                        alt=""
                        fill
                        sizes="80px"
                        className="object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span aria-hidden="true">{loc.flag}</span>
                        <span className="text-[10px] tracking-widest2 uppercase font-ui text-celestial/50">{pickLocalized(loc.country, locale)} · {loc.year}</span>
                      </div>
                      <h3 className="font-ui text-sm tracking-widest2 uppercase text-celestial mb-2">{pickLocalized(loc.name, locale)}</h3>
                      <p className="text-sm text-celestial/65 line-clamp-2 font-sans">{pickLocalized(loc.description, locale)}</p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
