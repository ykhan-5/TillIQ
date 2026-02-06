import { z } from 'zod';

// Base response structure (used for both main response and translation)
const BaseResponseSchema = z.object({
  summary: z.string().min(1),
  risks: z.array(z.string()),
  opportunities: z.array(z.string()),
  actions: z.array(z.string()),
  numbers_used: z.array(
    z.object({
      label: z.string(),
      value: z.string()
    })
  ),
  confidence: z.enum(['high', 'medium', 'low'])
});

// Zod schema for validating AI responses (includes optional English translation)
export const AIResponseSchema = BaseResponseSchema.extend({
  english_translation: BaseResponseSchema.optional()
});

export type ValidatedAIResponse = z.infer<typeof AIResponseSchema>;
