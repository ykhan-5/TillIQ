import { NextRequest, NextResponse } from 'next/server';
import { getOpenAIClient, isOpenAIConfigured } from '@/lib/ai/openaiClient';
import { SYSTEM_PROMPT } from '@/lib/ai/prompts';
import { AIResponseSchema } from '@/lib/ai/responseSchemas';
import type { AskRequest } from '@/lib/types';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body: AskRequest = await request.json();
    const { question, time_range } = body;

    if (!question) {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      );
    }

    if (!isOpenAIConfigured()) {
      return NextResponse.json(
        { error: 'OpenAI API not configured' },
        { status: 503 }
      );
    }

    // Fetch insights payload
    const insightsResponse = await fetch(
      `${request.nextUrl.origin}/api/insights?time_range=${time_range}`
    );

    if (!insightsResponse.ok) {
      const errorText = await insightsResponse.text();
      console.error('Insights fetch failed:', insightsResponse.status, errorText.substring(0, 200));
      return NextResponse.json(
        { error: 'Failed to fetch data. Please ensure the database is seeded.' },
        { status: 502 }
      );
    }

    const insights = await insightsResponse.json();

    // Call OpenAI
    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Data context:\n${JSON.stringify(insights, null, 2)}\n\nQuestion: ${question}`
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 1000
    });

    const rawResponse = JSON.parse(completion.choices[0].message.content || '{}');
    const validatedResponse = AIResponseSchema.parse(rawResponse);

    return NextResponse.json(validatedResponse);
  } catch (error) {
    console.error('Ask API error:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate insights',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
