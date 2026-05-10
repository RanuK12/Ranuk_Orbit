import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { Italiana, Marcellus, Cormorant_Garamond, DM_Sans } from 'next/font/google';
import type { ReactNode } from 'react';
import Script from 'next/script';
import { locales, type Locale, ogLocales } from '@/i18n/config';
import { SITE, SOCIAL_LINKS } from '@/data/content';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import SkipLink from '@/components/layout/SkipLink';
import '../globals.css';

const italiana = Italiana({ weight: '400', subsets: ['latin'], variable: '--font-italiana', display: 'swap' });
const marcellus = Marcellus({ weight: '400', subsets: ['latin'], variable: '--font-marcellus', display: 'swap' });
const cormorant = Cormorant_Garamond({ weight: '400', style: 'italic', subsets: ['latin'], variable: '--font-cormorant', display: 'swap' });
const dmSans = DM_Sans({ weight: ['300', '400', '500'], subsets: ['latin'], variable: '--font-dm-sans', display: 'swap' });

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;
  if (!locales.includes(locale as Locale)) return {};
  unstable_setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'meta' });
  const canonical = `${SITE.url}/${locale}`;
  return {
    metadataBase: new URL(SITE.url),
    title: {
      default: t('title'),
      template: `%s — ${SITE.name}`,
    },
    description: t('description'),
    applicationName: SITE.name,
    authors: [{ name: SITE.author }],
    creator: SITE.author,
    keywords: ['drone', 'aerial photography', 'travel photography', 'Ray-Ban Meta', 'cinematic', 'Patagonia', 'Italy', 'Morocco', 'DJI'],
    alternates: {
      canonical,
      languages: Object.fromEntries(locales.map((l) => [l, `${SITE.url}/${l}`])),
    },
    openGraph: {
      type: 'website',
      url: canonical,
      title: t('title'),
      description: t('description'),
      siteName: SITE.name,
      locale: ogLocales[locale as Locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocales[l]),
      images: [{ url: '/api/og', width: 1200, height: 630, alt: t('title') }],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: ['/api/og'],
    },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  themeColor: '#0A0A0A',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;
  if (!locales.includes(locale as Locale)) notFound();

  unstable_setRequestLocale(locale);
  const messages = await getMessages({ locale });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: SITE.author,
    alternateName: SITE.name,
    url: SITE.url,
    jobTitle: 'Drone cinematographer & travel photographer',
    address: { '@type': 'PostalAddress', addressLocality: 'Mar del Plata', addressCountry: 'AR' },
    knowsAbout: ['Drone cinematography', 'Aerial photography', 'Travel storytelling', 'Ray-Ban Meta POV'],
    makesOffer: [
      { '@type': 'Offer', name: 'Drone capture', priceCurrency: 'EUR', price: '890' },
      { '@type': 'Offer', name: 'Travel Story', priceCurrency: 'EUR', price: '1790' },
    ],
    sameAs: [SOCIAL_LINKS.instagram, SOCIAL_LINKS.linkedin, SOCIAL_LINKS.twitter, SOCIAL_LINKS.vsco],
  };

  return (
    <html lang={locale} className={`${italiana.variable} ${marcellus.variable} ${cormorant.variable} ${dmSans.variable}`}>
      <body>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <SkipLink />
          <Nav />
          <main id="main" tabIndex={-1}>
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
        <Script
          id="ld-person"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
