import { NextRequest, NextResponse } from 'next/server';
// import { getOpenAIClient, isOpenAIConfigured } from '@/lib/ai/openaiClient';
import { SYSTEM_PROMPT } from '@/lib/ai/prompts';
import { AIResponseSchema } from '@/lib/ai/responseSchemas';
import type { AskRequest } from '@/lib/types';

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

    // TODO: Uncomment when OpenAI is configured
    // if (!isOpenAIConfigured()) {
    //   return NextResponse.json(
    //     { error: 'OpenAI API not configured' },
    //     { status: 503 }
    //   );
    // }

    // TODO: Fetch insights payload
    // const insightsResponse = await fetch(
    //   `${request.nextUrl.origin}/api/insights?time_range=${time_range}`
    // );
    // const insights = await insightsResponse.json();

    // TODO: Call OpenAI
    // const openai = getOpenAIClient();
    // const completion = await openai.chat.completions.create({
    //   model: 'gpt-4-turbo',
    //   messages: [
    //     { role: 'system', content: SYSTEM_PROMPT },
    //     {
    //       role: 'user',
    //       content: `Data context:\n${JSON.stringify(insights, null, 2)}\n\nQuestion: ${question}`
    //     }
    //   ],
    //   response_format: { type: 'json_object' },
    //   temperature: 0.7,
    //   max_tokens: 1000
    // });

    // const rawResponse = JSON.parse(completion.choices[0].message.content || '{}');
    // const validatedResponse = AIResponseSchema.parse(rawResponse);

    // For now, return a mock response
    const mockResponse = {
      summary: "This is a demo response. Configure your OpenAI API key to get real AI-powered insights.",
      risks: [
        "OpenAI API key not configured yet",
      ],
      opportunities: [
        "Set up Supabase to load real sales data",
        "Configure OpenAI API key for intelligent responses"
      ],
      actions: [
        "Add OPENAI_API_KEY to your .env.local file",
        "Add Supabase credentials to .env.local",
        "Visit Settings to generate demo data"
      ],
      numbers_used: [
        { label: "Configuration Status", value: "Not yet configured" }
      ],
      confidence: "low" as const
    };

    return NextResponse.json(mockResponse);
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
