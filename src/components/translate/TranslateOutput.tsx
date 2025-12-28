'use client';

import { Copy, Volume2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/utils/Helpers';

type TranslateOutputProps = {
  text: string;
  languageLabel?: string;
  onPlayAudio?: () => void;
  audioEnabled?: boolean;
  isPlaying?: boolean;
};

export function TranslateOutput({
  text,
  languageLabel,
  onPlayAudio,
  audioEnabled = false,
  isPlaying = false,
}: TranslateOutputProps) {
  const t = useTranslations('Translate');
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!text) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 p-6">
        <p className="text-muted-foreground">{t('output_placeholder')}</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      {/* Language label */}
      {languageLabel && (
        <div className="mb-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {languageLabel}
          </span>
        </div>
      )}
      {/* Large text display for showing to others */}
      <div className="mb-4 min-h-[100px]">
        <p className="font-serif text-3xl leading-relaxed md:text-4xl">{text}</p>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-end gap-2">
        {audioEnabled && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onPlayAudio}
            disabled={isPlaying}
            className="gap-2"
          >
            <Volume2 className={cn('size-4', isPlaying && 'animate-pulse')} />
            {isPlaying ? t('playing') : t('play')}
          </Button>
        )}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="gap-2"
        >
          <Copy className="size-4" />
          {copied ? t('copied') : t('copy')}
        </Button>
      </div>
    </div>
  );
}
