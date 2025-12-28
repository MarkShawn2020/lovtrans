'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type UseVoiceRecorderOptions = {
  language?: string;
  continuous?: boolean;
  onResult?: (text: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
};

type UseVoiceRecorderReturn = {
  isRecording: boolean;
  isSupported: boolean;
  transcript: string;
  startRecording: () => void;
  stopRecording: () => void;
  error: string | null;
};

/**
 * Hook for voice recording using Web Speech API
 * Falls back gracefully if not supported
 */
export function useVoiceRecorder(
  options: UseVoiceRecorderOptions = {},
): UseVoiceRecorderReturn {
  const { language = 'zh-CN', continuous = false, onResult, onError } = options;

  const [isRecording, setIsRecording] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Use any for Web Speech API which has incomplete TypeScript definitions
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  // Check browser support
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = window as any;
    const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);
  }, []);

  // Initialize recognition
  useEffect(() => {
    if (!isSupported) return undefined;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = window as any;
    const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecognition) return undefined;

    const recognition = new SpeechRecognition();

    recognition.continuous = continuous;
    recognition.interimResults = true;
    recognition.lang = language;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result && result[0]) {
          const text = result[0].transcript;
          if (result.isFinal) {
            finalTranscript += text;
          } else {
            interimTranscript += text;
          }
        }
      }

      const currentTranscript = finalTranscript || interimTranscript;
      setTranscript(currentTranscript);

      if (finalTranscript) {
        onResult?.(finalTranscript, true);
      } else if (interimTranscript) {
        onResult?.(interimTranscript, false);
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onerror = (event: any) => {
      const errorMessage = getErrorMessage(event.error);
      setError(errorMessage);
      onError?.(errorMessage);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
    };
  }, [isSupported, language, continuous, onResult, onError]);

  const startRecording = useCallback(() => {
    if (!recognitionRef.current || isRecording) return;

    setError(null);
    setTranscript('');

    try {
      recognitionRef.current.start();
      setIsRecording(true);
    } catch (err) {
      // Already started, ignore
      console.error('Failed to start recognition:', err);
    }
  }, [isRecording]);

  const stopRecording = useCallback(() => {
    if (!recognitionRef.current || !isRecording) return;

    recognitionRef.current.stop();
    setIsRecording(false);
  }, [isRecording]);

  return {
    isRecording,
    isSupported,
    transcript,
    startRecording,
    stopRecording,
    error,
  };
}

function getErrorMessage(error: string): string {
  switch (error) {
    case 'not-allowed':
      return '麦克风权限被拒绝';
    case 'no-speech':
      return '未检测到语音';
    case 'network':
      return '网络错误';
    case 'audio-capture':
      return '无法捕获音频';
    default:
      return `语音识别错误: ${error}`;
  }
}
