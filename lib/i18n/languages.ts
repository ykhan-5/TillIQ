// Supported languages for Ask Your Shop
// Full dashboard localization is a future expansion

export interface SupportedLanguage {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'pt-BR', name: 'Portuguese (Brazil)', nativeName: 'Português (Brasil)', flag: '🇧🇷' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
];

export const DEFAULT_LANGUAGE = 'en';

export function getLanguageByCode(code: string): SupportedLanguage | undefined {
  return SUPPORTED_LANGUAGES.find(lang => lang.code === code);
}

export function getLanguageName(code: string): string {
  const lang = getLanguageByCode(code);
  return lang?.name || 'English';
}

export function detectBrowserLanguage(): string {
  if (typeof navigator === 'undefined') return DEFAULT_LANGUAGE;

  const browserLang = navigator.language || (navigator as { userLanguage?: string }).userLanguage || '';

  // Check for exact match first
  const exactMatch = SUPPORTED_LANGUAGES.find(lang => lang.code === browserLang);
  if (exactMatch) return exactMatch.code;

  // Check for partial match (e.g., 'es-MX' -> 'es')
  const baseLang = browserLang.split('-')[0];
  const partialMatch = SUPPORTED_LANGUAGES.find(lang => lang.code.startsWith(baseLang));
  if (partialMatch) return partialMatch.code;

  return DEFAULT_LANGUAGE;
}

// Language instruction for AI prompt
export function getLanguageInstruction(languageCode: string): string {
  const lang = getLanguageByCode(languageCode);
  if (!lang || lang.code === 'en') {
    return '';
  }

  return `

IMPORTANT LANGUAGE INSTRUCTIONS:
1. Respond entirely in ${lang.name} (${lang.nativeName}). All text in your response including summary, risks, opportunities, actions, and metric labels should be in ${lang.name}.
2. Keep numerical values, currency symbols, and metric formatting unchanged (e.g., "$12,345" stays as "$12,345").
3. ALSO include an "english_translation" object with the same structure containing the English version of your response. This allows users to toggle between languages.

Your JSON response should have this structure:
{
  "summary": "[${lang.name} summary]",
  "risks": ["[${lang.name} risk 1]", ...],
  "opportunities": ["[${lang.name} opportunity 1]", ...],
  "actions": ["[${lang.name} action 1]", ...],
  "numbers_used": [{"label": "[${lang.name} label]", "value": "$X,XXX"}, ...],
  "confidence": "high|medium|low",
  "english_translation": {
    "summary": "[English summary]",
    "risks": ["[English risk 1]", ...],
    "opportunities": ["[English opportunity 1]", ...],
    "actions": ["[English action 1]", ...],
    "numbers_used": [{"label": "[English label]", "value": "$X,XXX"}, ...],
    "confidence": "high|medium|low"
  }
}`;
}
