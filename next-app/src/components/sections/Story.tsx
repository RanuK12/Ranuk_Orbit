'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { PROFILE_PHOTOS, STATS } from '@/data/locations';
import { PRESS } from '@/data/content';
import SectionHead from '@/components/ui/SectionHead';

export default function Story() {
  const t = useTranslations('story');
  const [photoIdx, setPhotoIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setPhotoIdx((i) => (i + 1) % PROFILE_PHOTOS.length), 4500);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <section id="story" className="section">
      <SectionHead overline={t('overline')} title={t('title')} sub={t('sub')} />

      <div className="grid gap-14 lg:grid-cols-[1fr_1.3fr] items-start">
        <figure
          className="relative aspect-[4/5] max-w-md rounded-sm overflow-hidden border border-line"
          aria-live="polite"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          {PROFILE_PHOTOS.map((src, i) => (
            <Image
              key={src}
              src={src}
              alt={i === photoIdx ? t('photoAlt') : ''}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover transition-opacity duration-1000"
              style={{ opacity: i === photoIdx ? 1 : 0 }}
              priority={i === 0}
              aria-hidden={i !== photoIdx}
            />
          ))}
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? 'Resume slideshow' : 'Pause slideshow'}
            aria-pressed={paused}
            className="absolute bottom-4 right-4 w-11 h-11 rounded-full bg-ink/60 backdrop-blur-md border border-line-strong text-celestial flex items-center justify-center hover:border-celestial transition-colors"
          >
            {paused ? '▶' : '❚❚'}
          </button>
        </figure>

        <div className="space-y-5 max-w-2xl">
          {(['p1', 'p2', 'p3', 'p4'] as const).map((k) => (
            <p key={k} className="text-celestial/80 text-lg leading-[1.7]">{t(k)}</p>
          ))}
          <blockquote className="border-l border-desert pl-6 mt-8 font-italic italic text-2xl text-celestial">
            &ldquo;{t('pull')}&rdquo;
          </blockquote>
        </div>
      </div>

      {/* Stats */}
      <dl className="mt-20 grid gap-8 sm:grid-cols-3 border-t border-line pt-14">
        <Stat value={STATS.countries} label={t('statCountries')} />
        <Stat value={STATS.hours_flown} label={t('statHours')} suffix="h" />
        <Stat value={STATS.projects} label={t('statProjects')} />
      </dl>

      {/* Press */}
      <div className="mt-20 pt-10 border-t border-line">
        <p className="text-overline mb-6">{t('pressTitle')}</p>
        <ul className="flex flex-wrap gap-x-10 gap-y-4 items-center text-celestial/55">
          {PRESS.map((p) => (
            <li key={p.name} className="font-ui text-[12px] tracking-widest2 uppercase">{p.name} · {p.year}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Stat({ value, label, suffix = '' }: { value: number; label: string; suffix?: string }) {
  return (
    <div className="flex flex-col">
      <span className="font-display text-6xl md:text-7xl text-celestial" aria-label={`${value}${suffix ? ' ' + suffix : ''} ${label}`}>
        <span aria-hidden="true">{value.toLocaleString()}{suffix}</span>
      </span>
      <span className="text-overline mt-3">{label}</span>
    </div>
  );
}
