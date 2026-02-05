import { z } from 'zod';

// Zod schema for validating AI responses
export const AIResponseSchema = z.object({
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

export type ValidatedAIResponse = z.infer<typeof AIResponseSchema>;
