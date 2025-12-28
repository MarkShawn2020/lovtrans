'use client';

import type { LanguageCode, LanguageSettings } from '@/types/Translate';
import { ChevronDown } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SUPPORTED_LANGUAGES } from '@/types/Translate';
import { cn } from '@/utils/Helpers';

type LanguageSwitcherProps = {
  settings: LanguageSettings;
  activeTarget: LanguageCode;
  onTargetChange: (lang: LanguageCode) => void;
  onSettingsChange: (settings: LanguageSettings) => void;
};

export function LanguageSwitcher({
  settings,
  activeTarget,
  onTargetChange,
  onSettingsChange,
}: LanguageSwitcherProps) {
  const locale = useLocale() as 'zh' | 'en';
  const t = useTranslations('Translate');
  const [openDropdown, setOpenDropdown] = useState<'mother' | 'destination' | null>(null);

  const getLanguageLabel = (code: LanguageCode) => {
    const lang = SUPPORTED_LANGUAGES.find((l) => l.code === code);
    if (!lang) return code;
    return locale === 'zh' ? lang.nameZh : lang.nameEn;
  };

  const handleLanguageSelect = (type: 'mother' | 'destination', code: LanguageCode) => {
    const newSettings = { ...settings };
    if (type === 'mother') {
      newSettings.motherLanguage = code;
    } else {
      newSettings.destinationLanguage = code;
    }
    onSettingsChange(newSettings);
    setOpenDropdown(null);
    // 自动切换到新选择的语言
    onTargetChange(code);
  };

  const slots: Array<{
    type: 'mother' | 'destination' | 'common';
    code: LanguageCode;
    label: string;
    editable: boolean;
  }> = [
    { type: 'mother', code: settings.motherLanguage, label: t('mother_language'), editable: true },
    { type: 'destination', code: settings.destinationLanguage, label: t('destination_language'), editable: true },
    { type: 'common', code: settings.commonLanguage, label: t('common_language'), editable: false },
  ];

  return (
    <div className="flex items-center justify-center gap-2">
      {slots.map((slot) => (
        slot.editable ? (
          <DropdownMenu
            key={slot.type}
            open={openDropdown === slot.type}
            onOpenChange={(open) => setOpenDropdown(open ? slot.type as 'mother' | 'destination' : null)}
          >
            <DropdownMenuTrigger asChild>
              <Button
                variant={activeTarget === slot.code ? 'default' : 'outline'}
                className={cn(
                  'gap-1',
                  activeTarget === slot.code && 'bg-primary text-primary-foreground',
                )}
                onClick={(e) => {
                  // 单击直接切换，长按或右键打开下拉
                  if (!openDropdown) {
                    e.preventDefault();
                    onTargetChange(slot.code);
                  }
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setOpenDropdown(slot.type as 'mother' | 'destination');
                }}
              >
                {getLanguageLabel(slot.code)}
                <ChevronDown className="size-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => handleLanguageSelect(slot.type as 'mother' | 'destination', lang.code)}
                  className={cn(slot.code === lang.code && 'bg-muted')}
                >
                  {lang.name} ({locale === 'zh' ? lang.nameZh : lang.nameEn})
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            key={slot.type}
            variant={activeTarget === slot.code ? 'default' : 'outline'}
            onClick={() => onTargetChange(slot.code)}
            className={cn(
              activeTarget === slot.code && 'bg-primary text-primary-foreground',
            )}
          >
            {getLanguageLabel(slot.code)}
          </Button>
        )
      ))}
    </div>
  );
}
