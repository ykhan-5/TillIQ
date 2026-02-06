// AI-related type definitions

export type ConfidenceLevel = 'high' | 'medium' | 'low';

export interface NumberUsed {
  label: string;
  value: string;
}

export interface AIResponse {
  summary: string;
  risks: string[];
  opportunities: string[];
  actions: string[];
  numbers_used: NumberUsed[];
  confidence: ConfidenceLevel;
}

export interface AskRequest {
  question: string;
  time_range: string;
  language?: string;
}

export interface AIResponseWithTranslation extends AIResponse {
  english_translation?: AIResponse;
  response_language?: string;
}

export interface PresetPrompt {
  id: string;
  label: string;
  question: string;
  icon?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string | AIResponse;
  timestamp: Date;
  confidence?: ConfidenceLevel;
  language?: string;
  englishTranslation?: AIResponse;
}

export interface AIError {
  error: string;
  message: string;
  details?: string;
}
