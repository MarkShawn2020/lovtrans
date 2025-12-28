'use client';

import type { LanguageCode, LanguageSettings, TranslateResponse } from '@/types/Translate';
import { useTranslations } from 'next-intl';
import { useCallback, useState } from 'react';

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
  destinationLanguage: 'en',
  commonLanguage: 'en',
};

export function TranslatorMain() {
  const t = useTranslations('Translate');

  // Language settings
  const [settings] = useState<LanguageSettings>(DEFAULT_SETTINGS);
  const [targetLanguage, setTargetLanguage] = useState<LanguageCode>(
    settings.destinationLanguage,
  );

  // Input/Output state
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
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

  const handleTranslate = useCallback(async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
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
    } catch {
      setError(t('error'));
      setOutputText('');
    } finally {
      setIsLoading(false);
    }
  }, [inputText, targetLanguage, t]);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Language switcher */}
      <LanguageSwitcher
        settings={settings}
        activeTarget={targetLanguage}
        onTargetChange={setTargetLanguage}
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

      {/* Output area */}
      <TranslateOutput
        text={outputText}
        audioEnabled={ttsSupported}
        isPlaying={isPlaying}
        onPlayAudio={handlePlayAudio}
      />
    </div>
  );
}
