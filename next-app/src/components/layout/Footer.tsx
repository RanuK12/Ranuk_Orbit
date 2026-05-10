import { getLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { SITE, SOCIAL_LINKS } from '@/data/content';

export default async function Footer() {
  const t = await getTranslations('footer');
  const locale = await getLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line mt-[120px] px-[var(--gut)] pt-20 pb-10 max-w-page mx-auto">
      <div className="grid gap-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Link href={`/${locale}`} className="flex items-center gap-2.5 font-display text-[22px]" aria-label="Ranuk Orbit">
            <span aria-hidden="true">⊕</span>
            <span>Ranuk Orbit</span>
          </Link>
          <p className="mt-4 font-italic italic text-celestial-warm max-w-sm text-lg">
            {t('tagline')}. {t('builtWith')}
          </p>
        </div>

        <div>
          <p className="text-overline mb-4">{t('atlasTitle')}</p>
          <ul className="flex flex-col gap-3 text-sm text-celestial/75">
            <li><Link className="hover:text-celestial transition-colors" href={`/${locale}#atlas`}>{t('atlasTitle')}</Link></li>
            <li><Link className="hover:text-celestial transition-colors" href={`/${locale}#archive`}>Archive</Link></li>
            <li><Link className="hover:text-celestial transition-colors" href={`/${locale}#story`}>Story</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-overline mb-4">{t('servicesTitle')}</p>
          <ul className="flex flex-col gap-3 text-sm text-celestial/75">
            <li><Link className="hover:text-celestial transition-colors" href={`/${locale}#services`}>{t('servicesTitle')}</Link></li>
            <li><Link className="hover:text-celestial transition-colors" href={`/${locale}#contact`}>Contact</Link></li>
            <li><Link className="hover:text-celestial transition-colors" href={`mailto:${SOCIAL_LINKS.email}`}>{SOCIAL_LINKS.email}</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-overline mb-4">{t('socialTitle')}</p>
          <ul className="flex flex-col gap-3 text-sm text-celestial/75">
            <li><a className="hover:text-celestial transition-colors" href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer">Instagram</a></li>
            <li><a className="hover:text-celestial transition-colors" href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
            <li><a className="hover:text-celestial transition-colors" href={SOCIAL_LINKS.vsco} target="_blank" rel="noopener noreferrer">VSCO</a></li>
          </ul>
        </div>
      </div>

      <div className="mt-16 pt-8 border-t border-line flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[11px] tracking-widest2 uppercase font-ui text-celestial/55">
        <p>© {year} {SITE.author}. {t('copyright')}</p>
        <p>{SITE.location}</p>
      </div>
    </footer>
  );
}
