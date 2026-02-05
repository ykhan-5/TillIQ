import { NextRequest, NextResponse } from 'next/server';
import { buildInsightsPayload } from '@/lib/analytics';
// import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase/client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const timeRange = searchParams.get('time_range') || '30d';

    // TODO: Uncomment when Supabase is configured
    // if (!isSupabaseConfigured()) {
    //   return NextResponse.json(
    //     { error: 'Supabase not configured' },
    //     { status: 503 }
    //   );
    // }

    // TODO: Fetch orders from Supabase
    // const supabase = getSupabaseClient();
    // const { data: orders, error } = await supabase
    //   .from('orders')
    //   .select('*')
    //   .order('order_date', { ascending: false });

    // if (error) throw error;

    // For now, return mock insights payload
    const mockOrders: any[] = [];
    const insights = buildInsightsPayload(mockOrders, timeRange);

    return NextResponse.json(insights);
  } catch (error) {
    console.error('Insights API error:', error);
    return NextResponse.json(
      { error: 'Failed to compute insights' },
      { status: 500 }
    );
  }
}
