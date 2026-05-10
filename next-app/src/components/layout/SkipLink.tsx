import { getTranslations } from 'next-intl/server';

export default async function SkipLink() {
  const t = await getTranslations();
  return (
    <a href="#main" className="skip-link">
      {t('skipToContent')}
    </a>
  );
}
