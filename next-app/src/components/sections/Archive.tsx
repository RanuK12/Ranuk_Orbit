'use client';

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { useCallback, useMemo, useState } from 'react';
import { LOCATIONS } from '@/data/locations';
import { pickLocalized, cn } from '@/lib/utils';
import Lightbox from '@/components/lightbox/Lightbox';
import SectionHead from '@/components/ui/SectionHead';
import type { Locale } from '@/i18n/config';
import type { MediaItem, MediaType } from '@/types';

type FilterKey = 'all' | 'drone' | 'pov' | 'photo';

export default function Archive() {
  const t = useTranslations('archive');
  const locale = useLocale() as Locale;
  const [filter, setFilter] = useState<FilterKey>('all');
  const [lbIndex, setLbIndex] = useState<number | null>(null);

  const items = useMemo(() => {
    const all = LOCATIONS.flatMap((loc) =>
      loc.media.map((m) => ({ ...m, locationId: loc.id, locationName: loc.name, flag: loc.flag, accentColor: loc.accentColor }))
    );
    switch (filter) {
      case 'drone':
        return all.filter((m) => m.type === 'video' || (m.type === 'photo' && m.src.includes('fotos-drone')));
      case 'pov':
        return all.filter((m) => m.type === 'pov');
      case 'photo':
        return all.filter((m) => m.type === 'photo');
      default:
        return all;
    }
  }, [filter]);

  const openAt = useCallback((idx: number) => setLbIndex(idx), []);
  const close = useCallback(() => setLbIndex(null), []);
  const next = useCallback(() => setLbIndex((i) => (i === null ? null : (i + 1) % items.length)), [items.length]);
  const prev = useCallback(() => setLbIndex((i) => (i === null ? null : (i - 1 + items.length) % items.length)), [items.length]);

  const filters: Array<{ id: FilterKey; label: string }> = [
    { id: 'all', label: t('filterAll') },
    { id: 'drone', label: t('filterDrone') },
    { id: 'pov', label: t('filterPov') },
    { id: 'photo', label: t('filterPhoto') },
  ];

  return (
    <section id="archive" className="section">
      <SectionHead overline={t('overline')} title={t('title')} sub={t('sub')} />

      <div role="group" aria-label={t('overline')} className="flex flex-wrap gap-3 mb-10">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            className={cn('chip', filter === f.id && 'is-active')}
            aria-pressed={filter === f.id}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {items.length === 0 ? (
        <p className="text-celestial/60 font-italic italic">{t('empty')}</p>
      ) : (
        <div className="masonry">
          {items.map((item, i) => (
            <GalleryTile
              key={item.id}
              item={item}
              displayTitle={pickLocalized(item.title, locale)}
              locationLabel={pickLocalized(item.locationName, locale)}
              onOpen={() => openAt(i)}
            />
          ))}
        </div>
      )}

      {lbIndex !== null && (
        <Lightbox items={items} index={lbIndex} onClose={close} onPrev={prev} onNext={next} />
      )}
    </section>
  );
}

function GalleryTile({
  item,
  displayTitle,
  locationLabel,
  onOpen,
}: {
  item: MediaItem & { flag: string; accentColor: string };
  displayTitle: string;
  locationLabel: string;
  onOpen: () => void;
}) {
  const isVideo: boolean = item.type !== 'photo';
  const thumb = item.type === 'photo' ? item.src : item.poster || item.src;

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group block w-full text-left rounded-sm overflow-hidden border border-line bg-ink-soft/40 relative"
      style={{ ['--accent' as string]: item.accentColor }}
      aria-label={`${displayTitle} — ${locationLabel}`}
    >
      <Image
        src={thumb}
        alt={displayTitle}
        width={800}
        height={1000}
        sizes="(min-width: 1180px) 25vw, (min-width: 768px) 33vw, 50vw"
        className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.05]"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity" />
      <div className="absolute left-4 right-4 bottom-4 flex items-end justify-between opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity">
        <div className="flex items-start gap-2">
          <span aria-hidden="true" className="text-lg leading-none">{item.flag}</span>
          <div>
            <p className="font-ui text-[10px] tracking-widest2 uppercase text-celestial/70">{locationLabel} · {item.year}</p>
            <p className="font-italic italic text-lg text-celestial">{displayTitle}</p>
          </div>
        </div>
        {isVideo && (
          <span aria-hidden="true" className="w-10 h-10 rounded-full bg-celestial/10 border border-celestial/30 flex items-center justify-center text-celestial">▶</span>
        )}
      </div>
    </button>
  );
}

export type { MediaType };
