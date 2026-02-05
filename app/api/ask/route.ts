import { NextRequest, NextResponse } from 'next/server';
import { getOpenAIClient, isOpenAIConfigured } from '@/lib/ai/openaiClient';
import { SYSTEM_PROMPT } from '@/lib/ai/prompts';
import { AIResponseSchema } from '@/lib/ai/responseSchemas';
import { buildInsightsPayload } from '@/lib/analytics';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase/client';
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

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 503 }
      );
    }

    // Fetch orders directly from Supabase (same logic as insights API)
    const supabase = getSupabaseClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let allOrders: any[] = [];
    let page = 0;
    const pageSize = 1000;

    while (true) {
      const { data: orders, error: fetchError } = await supabase
        .from('orders')
        .select('*')
        .order('order_date', { ascending: true })
        .range(page * pageSize, (page + 1) * pageSize - 1);

      if (fetchError) {
        console.error('Supabase fetch error:', fetchError);
        return NextResponse.json(
          { error: 'Failed to fetch data from database' },
          { status: 502 }
        );
      }
      if (!orders || orders.length === 0) break;

      allOrders = allOrders.concat(orders);
      if (orders.length < pageSize) break;
      page++;
    }

    // Build insights payload directly
    const insights = buildInsightsPayload(allOrders, time_range);

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
