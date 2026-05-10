'use client';

import { useLocale } from 'next-intl';
import { useState } from 'react';
import { LOCATIONS, VISITED_DOTS } from '@/data/locations';
import { pickLocalized } from '@/lib/utils';
import type { Locale } from '@/i18n/config';

/** Equirectangular projection of visited + filmed points onto a rectangle.
 *  This is the reduced-motion / no-WebGL alternative to the 3D globe. */
export default function GlobeFallback({ onSelect, activeId }: { onSelect?: (id: string) => void; activeId?: string }) {
  const locale = useLocale() as Locale;
  const [hover, setHover] = useState<string | null>(null);

  const toXY = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    return { x, y };
  };

  return (
    <div
      role="img"
      aria-label="Interactive map of visited locations"
      className="relative aspect-[2/1] w-full rounded-lg border border-line bg-ink-soft/40 overflow-hidden"
    >
      {/* subtle grid */}
      <svg
        viewBox="0 0 100 50"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full opacity-40"
        aria-hidden="true"
      >
        {Array.from({ length: 12 }, (_, i) => i).map((i) => (
          <line key={`v${i}`} x1={(i / 12) * 100} y1={0} x2={(i / 12) * 100} y2={50} stroke="rgba(143,168,192,0.12)" strokeWidth="0.08" />
        ))}
        {Array.from({ length: 6 }, (_, i) => i).map((i) => (
          <line key={`h${i}`} x1={0} y1={(i / 6) * 50} x2={100} y2={(i / 6) * 50} stroke="rgba(143,168,192,0.12)" strokeWidth="0.08" />
        ))}
        <ellipse cx="50" cy="25" rx="42" ry="20" fill="none" stroke="rgba(30,111,164,0.2)" strokeWidth="0.15" />
      </svg>

      {/* Visited dots (decorative) */}
      {VISITED_DOTS.map((d, i) => {
        const { x, y } = toXY(d.coords.lat, d.coords.lng);
        return (
          <div
            key={`v-${i}`}
            className="absolute w-1.5 h-1.5 rounded-full bg-celestial/40"
            style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%,-50%)' }}
            title={`${d.flag} ${pickLocalized(d.name, locale)}`}
            aria-hidden="true"
          />
        );
      })}

      {/* Filmed locations (interactive) */}
      {LOCATIONS.map((l) => {
        const { x, y } = toXY(l.coords.lat, l.coords.lng);
        const isActive = l.id === activeId;
        const isHover = l.id === hover;
        return (
          <button
            key={l.id}
            type="button"
            onClick={() => onSelect?.(l.id)}
            onMouseEnter={() => setHover(l.id)}
            onMouseLeave={() => setHover(null)}
            onFocus={() => setHover(l.id)}
            onBlur={() => setHover(null)}
            aria-label={`${l.flag} ${pickLocalized(l.name, locale)}, ${pickLocalized(l.country, locale)}`}
            className="absolute w-11 h-11 flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${x}%`, top: `${y}%`, color: l.accentColor }}
          >
            <span className={`block rounded-full transition-all ${isActive || isHover ? 'w-4 h-4' : 'w-2.5 h-2.5'}`} style={{ background: l.accentColor }} />
            {(isActive || isHover) && (
              <span className="absolute top-full mt-2 whitespace-nowrap text-[10px] tracking-widest2 uppercase font-ui text-celestial bg-ink/90 px-2 py-1 rounded border border-line-strong">
                {pickLocalized(l.name, locale)}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
