import type { MetadataRoute } from 'next';
import { locales } from '@/i18n/config';
import { SITE } from '@/data/content';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return locales.map((locale) => ({
    url: `${SITE.url}/${locale}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: locale === 'en' ? 1 : 0.9,
    alternates: {
      languages: Object.fromEntries(locales.map((l) => [l, `${SITE.url}/${l}`])),
    },
  }));
}
