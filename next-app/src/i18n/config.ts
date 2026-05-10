export const locales = ['en', 'es', 'it'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  it: 'Italiano',
};

export const localeCodes: Record<Locale, string> = {
  en: 'EN',
  es: 'ES',
  it: 'IT',
};

export const ogLocales: Record<Locale, string> = {
  en: 'en_US',
  es: 'es_AR',
  it: 'it_IT',
};
