import { z } from 'zod';

/**
 * Supported language codes
 */
const languageCodeSchema = z.enum([
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
]);

/**
 * Translation request validation
 */
export const TranslateRequestSchema = z.object({
  text: z.string().min(1, 'Text is required').max(5000, 'Text is too long'),
  sourceLanguage: languageCodeSchema.optional(),
  targetLanguage: languageCodeSchema,
});

export type TranslateRequestData = z.infer<typeof TranslateRequestSchema>;

/**
 * TTS request validation
 */
export const TTSRequestSchema = z.object({
  text: z.string().min(1, 'Text is required').max(2000, 'Text is too long'),
  language: languageCodeSchema,
  voice: z.string().optional(),
});

export type TTSRequestData = z.infer<typeof TTSRequestSchema>;

/**
 * Language settings validation
 */
export const LanguageSettingsSchema = z.object({
  motherLanguage: languageCodeSchema,
  destinationLanguage: languageCodeSchema,
  commonLanguage: languageCodeSchema,
});

export type LanguageSettingsData = z.infer<typeof LanguageSettingsSchema>;
