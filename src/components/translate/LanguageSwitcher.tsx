'use client';

import type { LanguageCode, LanguageSettings } from '@/types/Translate';
import { useLocale } from 'next-intl';

import { SUPPORTED_LANGUAGES } from '@/types/Translate';
import { cn } from '@/utils/Helpers';

type LanguageSwitcherProps = {
  settings: LanguageSettings;
  activeTarget: LanguageCode;
  onTargetChange: (lang: LanguageCode) => void;
  onSettingsChange?: (settings: LanguageSettings) => void;
};

export function LanguageSwitcher({
  settings,
  activeTarget,
  onTargetChange,
}: LanguageSwitcherProps) {
  const locale = useLocale() as 'zh' | 'en';

  const getLanguageLabel = (code: LanguageCode) => {
    const lang = SUPPORTED_LANGUAGES.find((l) => l.code === code);
    if (!lang) return code;
    return locale === 'zh' ? lang.nameZh : lang.nameEn;
  };

  const targets = [
    { code: settings.motherLanguage, label: getLanguageLabel(settings.motherLanguage) },
    { code: settings.destinationLanguage, label: getLanguageLabel(settings.destinationLanguage) },
    { code: settings.commonLanguage, label: getLanguageLabel(settings.commonLanguage) },
  ];

  // Remove duplicates
  const uniqueTargets = targets.filter(
    (t, i, arr) => arr.findIndex((x) => x.code === t.code) === i,
  );

  return (
    <div className="flex items-center justify-center gap-2">
      {uniqueTargets.map((target) => (
        <button
          key={target.code}
          type="button"
          onClick={() => onTargetChange(target.code)}
          className={cn(
            'px-4 py-2 rounded-lg font-medium transition-colors',
            activeTarget === target.code
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80',
          )}
        >
          {target.label}
        </button>
      ))}
    </div>
  );
}
