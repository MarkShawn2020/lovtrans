'use client';

import { Mic, MicOff } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useVoiceRecorder } from '@/hooks/useVoiceRecorder';
import { cn } from '@/utils/Helpers';

type TranslateInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
  voiceLanguage?: string;
};

export function TranslateInput({
  value,
  onChange,
  onSubmit,
  isLoading = false,
  voiceLanguage = 'zh-CN',
}: TranslateInputProps) {
  const t = useTranslations('Translate');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    isRecording,
    isSupported,
    transcript,
    startRecording,
    stopRecording,
    error,
  } = useVoiceRecorder({
    language: voiceLanguage,
    onResult: (text, isFinal) => {
      onChange(text);
      if (isFinal) {
        stopRecording();
      }
    },
  });

  // Auto-submit when voice input is final
  useEffect(() => {
    if (transcript && !isRecording && value.trim()) {
      // Small delay to allow user to see the text
      const timer = setTimeout(() => {
        onSubmit();
      }, 500);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isRecording, transcript, value, onSubmit]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !isLoading) {
        onSubmit();
      }
    }
  };

  const handleVoiceClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      onChange(''); // Clear previous text
      startRecording();
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isRecording ? t('listening') : t('input_placeholder')}
          className={cn(
            'min-h-[100px] resize-none text-lg pr-12',
            isRecording && 'border-primary',
          )}
          disabled={isLoading || isRecording}
        />
        {isRecording && (
          <div className="absolute right-3 top-3">
            <span className="relative flex size-3">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-destructive opacity-75" />
              <span className="relative inline-flex size-3 rounded-full bg-destructive" />
            </span>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <div className="flex items-center gap-2">
        <Button
          type="button"
          onClick={onSubmit}
          disabled={!value.trim() || isLoading || isRecording}
          className="flex-1"
        >
          {isLoading ? t('translating') : t('translate')}
        </Button>
        {isSupported && (
          <Button
            type="button"
            variant={isRecording ? 'destructive' : 'outline'}
            size="icon"
            onClick={handleVoiceClick}
            disabled={isLoading}
            title={isRecording ? t('stop_recording') : t('start_recording')}
          >
            {isRecording ? (
              <MicOff className="size-5" />
            ) : (
              <Mic className="size-5" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
