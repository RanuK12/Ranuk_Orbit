import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Locale } from '@/i18n/config';
import type { Localized } from '@/types';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function pickLocalized(value: Localized, locale: Locale): string {
  return value[locale] ?? value.en;
}

export function formatNumber(n: number, locale: Locale): string {
  try {
    return new Intl.NumberFormat(locale === 'en' ? 'en-US' : locale === 'es' ? 'es-AR' : 'it-IT').format(n);
  } catch {
    return String(n);
  }
}
