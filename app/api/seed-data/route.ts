import { NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/data-generation';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    // Generate and seed data
    const result = await seedDatabase();

    return NextResponse.json(result);
  } catch (error) {
    console.error('Seed data API error:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to seed database',
        products_created: 0,
        orders_created: 0,
        date_range: { start: '', end: '' }
      },
      { status: 500 }
    );
  }
}
