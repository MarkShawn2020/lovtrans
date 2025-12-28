import type {
  LanguageCode,
  TranslateRequest,
  TranslateResponse,
} from '@/types/Translate';
import { getLanguageName } from '@/types/Translate';

import { Env } from './Env';

const ZENMUX_API_URL = Env.ZENMUX_API_URL || 'https://zenmux.ai/api';

/**
 * Translation service using ZenMux API (LLM-based)
 */
export class TranslateService {
  /**
   * Translate text using LLM for natural, conversational output
   */
  static async translate(request: TranslateRequest): Promise<TranslateResponse> {
    const { text, sourceLanguage, targetLanguage } = request;

    const targetLangName = getLanguageName(targetLanguage, 'en');
    const sourceLangHint = sourceLanguage
      ? `The source language is ${getLanguageName(sourceLanguage, 'en')}.`
      : 'Auto-detect the source language.';

    const prompt = `You are a travel translator. Translate the following text to ${targetLangName}.
Make the translation natural and conversational, as it will be spoken aloud.
Keep phrases short and easy to pronounce. Do not add any explanations.

${sourceLangHint}

Text: ${text}

Translation:`;

    const response = await fetch(`${ZENMUX_API_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Env.ZENMUX_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Translation failed: ${errorText}`);
    }

    const data = await response.json();
    const translatedText = data.choices?.[0]?.message?.content?.trim() || '';

    // Detect source language if not provided
    const detectedLanguage = sourceLanguage || (await this.detectLanguage(text));

    return {
      translatedText,
      detectedLanguage,
    };
  }

  /**
   * Detect the language of input text
   */
  static async detectLanguage(text: string): Promise<LanguageCode> {
    const prompt = `Identify the language of this text. Reply with ONLY the ISO 639-1 code (e.g., zh, en, ja, ko, th).

Text: ${text}

Language code:`;

    const response = await fetch(`${ZENMUX_API_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Env.ZENMUX_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 10,
        temperature: 0,
      }),
    });

    if (!response.ok) {
      return 'en'; // Default fallback
    }

    const data = await response.json();
    const detected = data.choices?.[0]?.message?.content?.trim().toLowerCase();

    // Validate it's a supported language code
    const supportedCodes = [
      'zh',
      'en',
      'ja',
      'ko',
      'th',
      'vi',
      'fr',
      'de',
      'es',
      'it',
      'pt',
      'ru',
      'ar',
      'id',
      'ms',
      'tl',
    ];

    if (supportedCodes.includes(detected)) {
      return detected as LanguageCode;
    }

    return 'en'; // Default fallback
  }
}
