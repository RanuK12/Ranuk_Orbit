'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import FocusTrap from 'focus-trap-react';
import { cn } from '@/lib/utils';
import LocaleSwitcher from './LocaleSwitcher';

export default function Nav() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const links: Array<{ href: string; label: string }> = [
    { href: `/${locale}#atlas`, label: t('atlas') },
    { href: `/${locale}#archive`, label: t('archive') },
    { href: `/${locale}#story`, label: t('story') },
    { href: `/${locale}#services`, label: t('services') },
    { href: `/${locale}#contact`, label: t('contact') },
  ];

  return (
    <>
      <nav
        aria-label="Primary"
        className={cn(
          'fixed top-0 left-0 right-0 z-40 flex items-center justify-between transition-all duration-300 ease-out',
          'px-[var(--gut)] py-5 border-b border-transparent',
          scrolled && 'bg-ink/85 backdrop-blur-xl py-3 border-line'
        )}
      >
        <Link href={`/${locale}`} className="flex items-center gap-2.5 font-display text-[22px]" aria-label="Ranuk Orbit">
          <span className="inline-block transition-transform duration-500 group-hover:rotate-180" aria-hidden="true">⊕</span>
          <span className="tracking-[0.04em]">Ranuk Orbit</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="relative font-ui text-[12px] tracking-[0.3em] uppercase text-celestial/70 hover:text-celestial transition-colors after:absolute after:left-0 after:-bottom-1.5 after:h-px after:w-0 after:bg-celestial after:transition-[width] after:duration-300 hover:after:w-full"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <LocaleSwitcher />
          <button
            ref={burgerRef}
            type="button"
            className="md:hidden flex flex-col justify-center gap-[5px] w-11 h-11 items-center"
            aria-label={t('openMenu')}
            aria-expanded={open}
            aria-controls="nav-overlay"
            onClick={() => setOpen(true)}
          >
            <span className="block w-5 h-px bg-celestial" />
            <span className="block w-5 h-px bg-celestial" />
            <span className="block w-3 h-px bg-celestial ml-auto" />
          </button>
        </div>
      </nav>

      {open && (
        <FocusTrap focusTrapOptions={{ escapeDeactivates: false, initialFocus: false }}>
          <div
            id="nav-overlay"
            role="dialog"
            aria-modal="true"
            aria-label={t('openMenu')}
            className="fixed inset-0 z-50 bg-ink/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 px-6"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t('closeMenu')}
              className="absolute top-5 right-5 w-11 h-11 flex items-center justify-center text-celestial text-3xl"
            >
              ×
            </button>
            <nav aria-label="Primary mobile">
              <ul className="flex flex-col items-center gap-6">
                {links.map((l, i) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="font-display text-4xl text-celestial animate-fade-up"
                      style={{ animationDelay: `${100 + i * 60}ms` }}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="mt-6">
              <LocaleSwitcher variant="overlay" />
            </div>
          </div>
        </FocusTrap>
      )}
    </>
  );
}
