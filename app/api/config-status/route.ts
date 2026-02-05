import { NextResponse } from 'next/server';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { isOpenAIConfigured } from '@/lib/ai/openaiClient';

export async function GET() {
  return NextResponse.json({
    supabase: isSupabaseConfigured(),
    openai: isOpenAIConfigured(),
  });
}
