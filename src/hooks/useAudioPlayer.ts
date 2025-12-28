'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type UseAudioPlayerOptions = {
  language?: string;
  rate?: number;
  pitch?: number;
  onEnd?: () => void;
  onError?: (error: string) => void;
};

type UseAudioPlayerReturn = {
  isPlaying: boolean;
  isSupported: boolean;
  speak: (text: string) => void;
  stop: () => void;
  error: string | null;
};

/**
 * Hook for text-to-speech using Web Speech API
 */
export function useAudioPlayer(
  options: UseAudioPlayerOptions = {},
): UseAudioPlayerReturn {
  const { language = 'zh-CN', rate = 1, pitch = 1, onEnd, onError } = options;

  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Check browser support
  useEffect(() => {
    setIsSupported('speechSynthesis' in window);
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!isSupported || !text.trim()) return;

      // Stop any current speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.rate = rate;
      utterance.pitch = pitch;

      // Find a voice for the language
      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find((v) => v.lang.startsWith(language.split('-')[0] || ''));
      if (voice) {
        utterance.voice = voice;
      }

      utterance.onstart = () => {
        setIsPlaying(true);
        setError(null);
      };

      utterance.onend = () => {
        setIsPlaying(false);
        onEnd?.();
      };

      utterance.onerror = (event) => {
        setIsPlaying(false);
        const errorMessage = `语音播放失败: ${event.error}`;
        setError(errorMessage);
        onError?.(errorMessage);
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [isSupported, language, rate, pitch, onEnd, onError],
  );

  const stop = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  }, [isSupported]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  return {
    isPlaying,
    isSupported,
    speak,
    stop,
    error,
  };
}
