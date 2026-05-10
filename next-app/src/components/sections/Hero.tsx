'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { HERO_SEQUENCE } from '@/data/locations';
import { pickLocalized } from '@/lib/utils';
import type { Locale } from '@/i18n/config';

const SLIDE_DURATION = 8000;

function MuteIcon({ muted }: { muted: boolean }) {
  return muted ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M11 5L6 9H2v6h4l5 4V5z" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M11 5L6 9H2v6h4l5 4V5z" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}

/** Renders a string character-by-character with CSS-staggered animation.
 *  Uses --char-index custom property; zero JS timing. */
function StaggeredText({ text, startIndex = 0, className }: { text: string; startIndex?: number; className?: string }) {
  const chars = useMemo(() => [...text], [text]);
  return (
    <span className={className}>
      {chars.map((ch, i) => (
        <span
          key={i}
          className="hero-char"
          style={{ ['--char-index' as string]: startIndex + i }}
          aria-hidden={ch === ' '}
        >
          {ch === ' ' ? '\u00A0' : ch}
        </span>
      ))}
    </span>
  );
}

export default function Hero() {
  const t = useTranslations('hero');
  const locale = useLocale() as Locale;
  const [active, setActive] = useState(0);
  const [muted, setMuted] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const sequence = HERO_SEQUENCE;

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (isMobile || sequence.length < 2) return;
    let paused = false;
    const onVis = () => { paused = document.hidden; };
    document.addEventListener('visibilitychange', onVis);
    const interval = setInterval(() => {
      if (!paused) setActive((a) => (a + 1) % sequence.length);
    }, SLIDE_DURATION);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [isMobile, sequence.length]);

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      const next = !m;
      videoRefs.current.forEach((v) => { if (v) v.muted = next; });
      return next;
    });
  }, []);

  const headlineLine1 = t('headlineLine1');
  const headlineEm = t('headlineEm');
  const headlineTail = t('headlineTail');

  // Build a flat char-index offset for continuous staggering across words
  const line1Len = headlineLine1.length + 1; // +1 for space
  const emLen = headlineEm.length + 1;

  return (
    <section id="home" className="relative h-[100svh] min-h-[600px] overflow-hidden">
      {/* Background layer ------------------------------------------------- */}
      <div className="absolute inset-0">
        {sequence.map((clip, i) => {
          const isActive = i === active;
          const next = (active + 1) % sequence.length;
          const shouldLoadVideo = !isMobile && (i === active || i === next);
          return (
            <div
              key={clip.src}
              className="absolute inset-0 transition-opacity duration-[1400ms]"
              style={{ opacity: isActive ? 1 : 0 }}
              aria-hidden={!isActive}
            >
              {shouldLoadVideo ? (
                <video
                  ref={(el) => { videoRefs.current[i] = el; }}
                  className="w-full h-full object-cover anim-kenburns"
                  src={clip.src}
                  poster={clip.poster}
                  autoPlay
                  muted={muted}
                  loop
                  playsInline
                  preload={isActive ? 'auto' : 'metadata'}
                />
              ) : (
                <Image
                  src={clip.poster}
                  alt=""
                  fill
                  priority={i === 0}
                  sizes="100vw"
                  className="object-cover anim-kenburns"
                />
              )}
            </div>
          );
        })}
        {/* Gradient overlay for legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink/35 via-ink/10 to-ink" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink/60 to-transparent" />
      </div>

      {/* Content ---------------------------------------------------------- */}
      <div className="relative z-10 h-full max-w-page mx-auto px-[var(--gut)] flex flex-col justify-end pb-28 md:pb-32">
        <p className="text-overline mb-8 animate-fade-up" style={{ animationDelay: '0.3s' }}>
          {t('overline')}
        </p>
        <h1
          className="font-display text-celestial"
          style={{
            fontSize: 'clamp(44px, 9vw, 132px)',
            lineHeight: 0.92,
            letterSpacing: '-0.01em',
            maxWidth: '16ch',
          }}
        >
          <span className="block">
            <StaggeredText text={headlineLine1} startIndex={0} />
          </span>
          <span className="block">
            <span className="font-italic italic text-desert">
              <StaggeredText text={headlineEm} startIndex={line1Len} />
            </span>
            <span className="hero-char" style={{ ['--char-index' as string]: line1Len + emLen - 1 }} aria-hidden="true">{'\u00A0'}</span>
            <StaggeredText text={headlineTail} startIndex={line1Len + emLen} />
          </span>
        </h1>
        <p
          className="mt-6 font-italic italic text-celestial-warm max-w-2xl animate-fade-up"
          style={{ fontSize: 'clamp(16px, 1.8vw, 22px)', animationDelay: '1.4s' }}
        >
          {t('sub')}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-6 animate-fade-up" style={{ animationDelay: '1.6s' }}>
          <Link href={`/${locale}#atlas`} className="btn-pill">
            {t('cta')}
            <span aria-hidden="true">→</span>
          </Link>
          <Link href={`/${locale}#archive`} className="btn-link">
            {t('ctaSecondary')}
          </Link>
        </div>
      </div>

      {/* Slide indicators ------------------------------------------------- */}
      {!isMobile && sequence.length > 1 && (
        <div className="absolute bottom-10 left-[var(--gut)] z-10 flex items-center gap-5">
          <div className="flex items-center gap-2">
            {sequence.map((clip, i) => (
              <button
                key={clip.src}
                type="button"
                onClick={() => setActive(i)}
                aria-label={t('slideLabel', { n: i + 1, label: pickLocalized(clip.label, locale) })}
                aria-current={i === active ? 'true' : undefined}
                className="h-11 w-11 flex items-center justify-center"
              >
                <span
                  className={
                    i === active
                      ? 'block h-2 w-7 rounded bg-celestial transition-all duration-300'
                      : 'block h-2 w-2 rounded-full bg-celestial/40 hover:bg-celestial transition-all duration-300'
                  }
                />
              </button>
            ))}
          </div>
          <span className="text-overline" aria-live="polite">
            {pickLocalized(sequence[active]!.label, locale)}
          </span>
        </div>
      )}

      {/* Mute toggle ------------------------------------------------------ */}
      <button
        type="button"
        onClick={toggleMute}
        aria-label={muted ? t('unmuted') : t('muted')}
        aria-pressed={!muted}
        className="absolute top-24 right-[var(--gut)] z-10 w-11 h-11 rounded-full border border-line-strong bg-ink/50 backdrop-blur-md flex items-center justify-center text-celestial hover:border-celestial transition-colors"
      >
        <MuteIcon muted={muted} />
      </button>

      {/* Scroll hint ------------------------------------------------------ */}
      <a
        href={`#atlas`}
        className="hidden md:flex absolute bottom-10 right-[var(--gut)] z-10 flex-col items-center gap-2 text-celestial/60 hover:text-celestial transition-colors"
        aria-label={t('scroll')}
      >
        <span className="block h-10 w-px bg-celestial/40 overflow-hidden relative">
          <span className="absolute left-0 right-0 h-3 bg-celestial animate-[scroll-hint_2.2s_ease-in-out_infinite]" />
        </span>
        <span className="text-overline">{t('scroll')}</span>
      </a>

      <style jsx>{`
        @keyframes scroll-hint {
          0% { transform: translateY(-100%); opacity: 0; }
          40% { opacity: 1; }
          100% { transform: translateY(400%); opacity: 0; }
        }
      `}</style>
    </section>
  );
}
