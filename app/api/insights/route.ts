import { NextRequest, NextResponse } from 'next/server';
import { buildInsightsPayload } from '@/lib/analytics';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase/client';

// Force dynamic rendering since we use searchParams
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const timeRange = searchParams.get('time_range') || '30d';

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 503 }
      );
    }

    // Fetch all orders from Supabase using pagination to overcome 1000-row limit
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

      if (fetchError) throw fetchError;
      if (!orders || orders.length === 0) break;

      allOrders = allOrders.concat(orders);
      if (orders.length < pageSize) break;
      page++;
    }

    const orders = allOrders;
    const error = null;

    if (error) throw error;

    const insights = buildInsightsPayload(orders || [], timeRange);

    return NextResponse.json(insights);
  } catch (error) {
    console.error('Insights API error:', error);
    return NextResponse.json(
      { error: 'Failed to compute insights' },
      { status: 500 }
    );
  }
}
