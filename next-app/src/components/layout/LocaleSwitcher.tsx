'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useRef, useState, useTransition } from 'react';
import { locales, localeCodes, localeNames, type Locale } from '@/i18n/config';
import { cn } from '@/lib/utils';

export default function LocaleSwitcher({ variant = 'nav' }: { variant?: 'nav' | 'overlay' }) {
  const currentLocale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('nav');
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const switchTo = (next: Locale) => {
    if (next === currentLocale) {
      setOpen(false);
      return;
    }
    // Replace the leading /xx segment
    const segments = pathname.split('/');
    if (segments[1] && locales.includes(segments[1] as Locale)) {
      segments[1] = next;
    } else {
      segments.splice(1, 0, next);
    }
    const target = segments.join('/') || `/${next}`;
    startTransition(() => {
      router.replace(target);
      setOpen(false);
    });
  };

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${t('language')}: ${localeNames[currentLocale]}`}
        className={cn(
          'inline-flex items-center gap-2 rounded-full border border-line-strong px-4 min-h-[44px] py-2 font-ui text-[11px] tracking-widest2 uppercase text-celestial/80 hover:text-celestial hover:border-celestial transition-colors',
          variant === 'overlay' && 'text-lg tracking-widest2'
        )}
      >
        <span>{variant === 'overlay' ? localeNames[currentLocale] : localeCodes[currentLocale]}</span>
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
          <path d="M2 4l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute right-0 mt-2 min-w-[180px] rounded-md border border-line-strong bg-ink-soft/95 backdrop-blur-md py-1 z-50 shadow-2xl"
        >
          {locales.map((loc) => (
            <li key={loc}>
              <button
                type="button"
                role="option"
                aria-selected={loc === currentLocale}
                disabled={isPending}
                onClick={() => switchTo(loc)}
                className={cn(
                  'flex w-full items-center justify-between px-4 py-3 text-left font-ui text-[11px] tracking-widest2 uppercase transition-colors',
                  loc === currentLocale ? 'text-desert' : 'text-celestial/70 hover:text-celestial hover:bg-celestial/5'
                )}
              >
                <span>{localeCodes[loc]}</span>
                <span className="text-[10px] opacity-60 normal-case tracking-normal font-sans">{localeNames[loc]}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
