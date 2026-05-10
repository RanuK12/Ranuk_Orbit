'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { LOCATIONS } from '@/data/locations';
import { SOCIAL_LINKS } from '@/data/content';
import { pickLocalized } from '@/lib/utils';
import { useInView } from '@/hooks/useInView';
import type { Locale } from '@/i18n/config';

export default function POV() {
  const t = useTranslations('pov');
  const locale = useLocale() as Locale;
  const leftVideoRef = useRef<HTMLVideoElement>(null);
  const rightVideoRef = useRef<HTMLVideoElement>(null);
  const { ref, inView } = useInView<HTMLDivElement>();
  const [hover, setHover] = useState(false);

  // Collect POV clips across all locations, take a handful.
  const povClips = useMemo(() => {
    return LOCATIONS.flatMap((l) => l.media).filter((m) => m.type === 'pov').slice(0, 14);
  }, []);

  const leftClip = povClips[0];
  const rightClip = povClips[1] || leftClip;

  const marqueeText = t('marqueeText');

  return (
    <section id="pov" className="relative overflow-hidden" aria-labelledby="pov-title">
      {/* Ambient gradient */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 20% 10%, rgba(201,162,39,0.08) 0%, transparent 60%),' +
            'radial-gradient(ellipse at 80% 90%, rgba(30,111,164,0.08) 0%, transparent 60%)',
        }}
      />

      {/* Kinetic background text */}
      <div aria-hidden="true" className="absolute inset-0 flex items-center pointer-events-none overflow-hidden opacity-[0.06]">
        <div className="whitespace-nowrap anim-marquee flex gap-14 font-display text-[22vw] text-celestial">
          <span>{marqueeText}</span>
          <span>{marqueeText}</span>
        </div>
      </div>

      <div className="section relative">
        <p className="text-overline mb-4">{t('overline')}</p>
        <h2 id="pov-title" className="section-title max-w-3xl">{t('title')}</h2>
        <p className="section-sub">{t('sub')}</p>

        {/* Spectacle frame */}
        <div
          ref={ref}
          className="mt-16 flex flex-col md:flex-row items-center justify-center gap-0"
          onMouseEnter={() => {
            setHover(true);
            leftVideoRef.current?.play().catch(() => {});
            rightVideoRef.current?.play().catch(() => {});
          }}
          onMouseLeave={() => {
            setHover(false);
            leftVideoRef.current?.pause();
            rightVideoRef.current?.pause();
          }}
        >
          {[leftClip, rightClip].map((clip, i) =>
            clip ? (
              <div
                key={`${clip.id}-${i}`}
                className="relative w-60 h-60 md:w-80 md:h-80 rounded-full overflow-hidden border-[3px] border-desert/50 shadow-[0_20px_80px_rgba(0,0,0,0.6)]"
                style={{ transform: i === 1 ? 'translateX(-16px)' : undefined }}
                aria-hidden="true"
              >
                {inView && (
                  <video
                    ref={i === 0 ? leftVideoRef : rightVideoRef}
                    src={clip.src}
                    poster={clip.poster}
                    muted
                    loop
                    playsInline
                    preload="none"
                    className="w-full h-full object-cover"
                  />
                )}
                {/* Glass reflection */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.14) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.18) 100%)',
                  }}
                />
              </div>
            ) : null
          )}
        </div>
        {/* Bridge */}
        <div aria-hidden="true" className="hidden md:block h-[3px] w-8 bg-desert/60 mx-auto -mt-40 relative z-0" />

        {/* Stats */}
        <dl className="mt-20 grid grid-cols-3 gap-6 max-w-2xl mx-auto border-t border-b border-line py-10">
          {(['stat1', 'stat2', 'stat3'] as const).map((k) => (
            <div key={k} className="text-center">
              <dt className="sr-only">{t(`${k}Label`)}</dt>
              <dd className="font-display text-5xl text-celestial">{t(`${k}Number`)}</dd>
              <p className="text-overline mt-3">{t(`${k}Label`)}</p>
            </div>
          ))}
        </dl>

        {/* Marquee of clips */}
        <div className="mt-16 overflow-hidden">
          <div className="flex gap-4 anim-marquee" style={{ width: 'max-content' }}>
            {[...povClips, ...povClips].map((clip, i) => (
              <div key={`${clip.id}-${i}`} className="w-40 aspect-[9/16] rounded-md overflow-hidden border border-line bg-ink-soft/40 shrink-0 relative">
                <Image
                  src={clip.poster || clip.src}
                  alt={pickLocalized(clip.title, locale)}
                  fill
                  sizes="160px"
                  className="object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex justify-center">
          <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="btn-pill">
            {t('cta')} →
          </a>
        </div>
      </div>
    </section>
  );
}
