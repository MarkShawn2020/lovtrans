/**
 * Supported language codes
 */
export type LanguageCode =
  | 'zh' // Chinese
  | 'en' // English
  | 'ja' // Japanese
  | 'ko' // Korean
  | 'th' // Thai
  | 'vi' // Vietnamese
  | 'fr' // French
  | 'de' // German
  | 'es' // Spanish
  | 'it' // Italian
  | 'pt' // Portuguese
  | 'ru' // Russian
  | 'ar' // Arabic
  | 'hi' // Hindi
  | 'id' // Indonesian
  | 'ms' // Malay
  | 'tl'; // Tagalog/Filipino

/**
 * Language display info
 */
export type LanguageInfo = {
  code: LanguageCode;
  name: string; // Native name
  nameEn: string; // English name
  nameZh: string; // Chinese name
};

/**
 * User's 3-language setting
 */
export type LanguageSettings = {
  motherLanguage: LanguageCode;
  destinationLanguage: LanguageCode;
  commonLanguage: LanguageCode;
};

/**
 * Translation request
 */
export type TranslateRequest = {
  text: string;
  sourceLanguage?: LanguageCode; // Optional, auto-detect if not provided
  targetLanguage: LanguageCode;
};

/**
 * Translation response
 */
export type TranslateResponse = {
  translatedText: string;
  detectedLanguage?: LanguageCode;
};

/**
 * TTS request
 */
export type TTSRequest = {
  text: string;
  language: LanguageCode;
  voice?: string; // Optional voice ID
};

/**
 * ASR response
 */
export type ASRResponse = {
  text: string;
  language: LanguageCode;
  confidence?: number;
};

/**
 * Supported languages list
 */
export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: 'zh', name: '中文', nameEn: 'Chinese', nameZh: '中文' },
  { code: 'en', name: 'English', nameEn: 'English', nameZh: '英语' },
  { code: 'ja', name: '日本語', nameEn: 'Japanese', nameZh: '日语' },
  { code: 'ko', name: '한국어', nameEn: 'Korean', nameZh: '韩语' },
  { code: 'th', name: 'ไทย', nameEn: 'Thai', nameZh: '泰语' },
  { code: 'vi', name: 'Tiếng Việt', nameEn: 'Vietnamese', nameZh: '越南语' },
  { code: 'fr', name: 'Français', nameEn: 'French', nameZh: '法语' },
  { code: 'de', name: 'Deutsch', nameEn: 'German', nameZh: '德语' },
  { code: 'es', name: 'Español', nameEn: 'Spanish', nameZh: '西班牙语' },
  { code: 'it', name: 'Italiano', nameEn: 'Italian', nameZh: '意大利语' },
  { code: 'pt', name: 'Português', nameEn: 'Portuguese', nameZh: '葡萄牙语' },
  { code: 'ru', name: 'Русский', nameEn: 'Russian', nameZh: '俄语' },
  { code: 'ar', name: 'العربية', nameEn: 'Arabic', nameZh: '阿拉伯语' },
  { code: 'id', name: 'Indonesia', nameEn: 'Indonesian', nameZh: '印尼语' },
  { code: 'ms', name: 'Melayu', nameEn: 'Malay', nameZh: '马来语' },
];

/**
 * Get language info by code
 */
export function getLanguageInfo(code: LanguageCode): LanguageInfo | undefined {
  return SUPPORTED_LANGUAGES.find((lang) => lang.code === code);
}

/**
 * Get language name for display (based on UI language)
 */
export function getLanguageName(
  code: LanguageCode,
  uiLanguage: 'zh' | 'en' = 'zh',
): string {
  const info = getLanguageInfo(code);
  if (!info) return code;
  return uiLanguage === 'zh' ? info.nameZh : info.nameEn;
}
