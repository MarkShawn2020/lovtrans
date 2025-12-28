'use client';

import type { LanguageCode, LanguageSettings, TranslateResponse } from '@/types/Translate';
import { getLanguageName } from '@/types/Translate';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useState } from 'react';

import { useAudioPlayer } from '@/hooks/useAudioPlayer';

import { LanguageSwitcher } from './LanguageSwitcher';
import { TranslateInput } from './TranslateInput';
import { TranslateOutput } from './TranslateOutput';

// Map language code to Web Speech API locale
function getVoiceLanguage(code: LanguageCode): string {
  const map: Record<LanguageCode, string> = {
    zh: 'zh-CN',
    en: 'en-US',
    ja: 'ja-JP',
    ko: 'ko-KR',
    th: 'th-TH',
    vi: 'vi-VN',
    fr: 'fr-FR',
    de: 'de-DE',
    es: 'es-ES',
    it: 'it-IT',
    pt: 'pt-BR',
    ru: 'ru-RU',
    ar: 'ar-SA',
    hi: 'hi-IN',
    id: 'id-ID',
    ms: 'ms-MY',
    tl: 'tl-PH',
  };
  return map[code] || 'zh-CN';
}

const DEFAULT_SETTINGS: LanguageSettings = {
  motherLanguage: 'zh',
  destinationLanguage: 'ja', // 日语 - 热门旅游目的地
  commonLanguage: 'en',
};

const STORAGE_KEY = 'lovtrans-language-settings';

function loadSettings(): LanguageSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    }
  } catch {
    // ignore
  }
  return DEFAULT_SETTINGS;
}

export function TranslatorMain() {
  const t = useTranslations('Translate');

  // Language settings - lazy init from localStorage
  const [settings, setSettings] = useState<LanguageSettings>(DEFAULT_SETTINGS);
  const [targetLanguage, setTargetLanguage] = useState<LanguageCode>(DEFAULT_SETTINGS.destinationLanguage);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = loadSettings();
    setSettings(saved);
    setTargetLanguage(saved.destinationLanguage);
    setIsHydrated(true);
  }, []);

  // Persist to localStorage when settings change
  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings, isHydrated]);

  // Input/Output state
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [outputTextEn, setOutputTextEn] = useState(''); // 英语翻译结果
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // TTS player
  const { isPlaying, isSupported: ttsSupported, speak, stop } = useAudioPlayer({
    language: getVoiceLanguage(targetLanguage),
  });

  const handlePlayAudio = useCallback(() => {
    if (isPlaying) {
      stop();
    } else if (outputText) {
      speak(outputText);
    }
  }, [isPlaying, outputText, speak, stop]);

  // 判断是否需要同时翻译英语
  const shouldTranslateToEnglish = useCallback(() => {
    // 如果目标语言已经是英语，不需要额外翻译
    if (targetLanguage === 'en') return false;
    // 如果源语言（母语）是英语，不需要额外翻译
    if (settings.motherLanguage === 'en') return false;
    return true;
  }, [targetLanguage, settings.motherLanguage]);

  const handleTranslate = useCallback(async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    setError(null);
    setOutputTextEn('');

    try {
      // 翻译到目标语言
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputText,
          targetLanguage,
        }),
      });

      if (!response.ok) {
        throw new Error('Translation failed');
      }

      const data: TranslateResponse = await response.json();
      setOutputText(data.translatedText);

      // 如果需要，同时翻译到英语
      if (shouldTranslateToEnglish()) {
        const responseEn = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: inputText,
            targetLanguage: 'en',
          }),
        });

        if (responseEn.ok) {
          const dataEn: TranslateResponse = await responseEn.json();
          setOutputTextEn(dataEn.translatedText);
        }
      }
    } catch {
      setError(t('error'));
      setOutputText('');
    } finally {
      setIsLoading(false);
    }
  }, [inputText, targetLanguage, t, shouldTranslateToEnglish]);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Language switcher */}
      <LanguageSwitcher
        settings={settings}
        activeTarget={targetLanguage}
        onTargetChange={setTargetLanguage}
        onSettingsChange={setSettings}
      />

      {/* Input area */}
      <TranslateInput
        value={inputText}
        onChange={setInputText}
        onSubmit={handleTranslate}
        isLoading={isLoading}
        voiceLanguage={getVoiceLanguage(settings.motherLanguage)}
      />

      {/* Error message */}
      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Output area - 目标语言 */}
      <TranslateOutput
        text={outputText}
        languageLabel={getLanguageName(targetLanguage)}
        audioEnabled={ttsSupported}
        isPlaying={isPlaying}
        onPlayAudio={handlePlayAudio}
      />

      {/* Output area - 英语（如果需要） */}
      {outputTextEn && (
        <TranslateOutput
          text={outputTextEn}
          languageLabel="English"
          audioEnabled={ttsSupported}
          isPlaying={false}
          onPlayAudio={() => speak(outputTextEn)}
        />
      )}
    </div>
  );
}
