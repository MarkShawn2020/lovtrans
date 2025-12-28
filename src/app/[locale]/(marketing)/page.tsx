import { getTranslations, setRequestLocale } from 'next-intl/server';

import { TranslatorMain } from '@/components/translate/TranslatorMain';

type IIndexProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: IIndexProps) {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'Translate',
  });

  return {
    title: t('page_title'),
    description: t('page_description'),
  };
}

export default async function Index(props: IIndexProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

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
