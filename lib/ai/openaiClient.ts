import OpenAI from 'openai';

// OpenAI client initialization
// Once you have your OpenAI API key, this will create the client

export function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error(
      'Missing OpenAI API key. Please set OPENAI_API_KEY in .env.local'
    );
  }

  return new OpenAI({ apiKey });
}

// Helper to check if OpenAI is configured
export function isOpenAIConfigured(): boolean {
  return !!process.env.OPENAI_API_KEY;
}
