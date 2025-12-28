import { getTranslations } from 'next-intl/server';

import { TranslatorMain } from '@/components/translate/TranslatorMain';

export async function generateMetadata() {
  const t = await getTranslations('Translate');
  return {
    title: t('page_title'),
    description: t('page_description'),
  };
}

export default async function TranslatePage() {
  const t = await getTranslations('Translate');

  return (
    <div className="container py-8">
      <div className="mb-8 text-center">
        <h1 className="font-serif text-3xl font-bold">{t('page_title')}</h1>
        <p className="mt-2 text-muted-foreground">{t('page_description')}</p>
      </div>
      <TranslatorMain />
    </div>
  );
}
