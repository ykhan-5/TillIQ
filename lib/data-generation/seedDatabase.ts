import { generateProducts } from './generateProducts';
import { generateCustomers } from './generateCustomers';
import { generateOrders } from './generateOrders';
import { DATA_GENERATION_CONFIG } from '@/lib/utils/constants';
import { createClient } from '@supabase/supabase-js';

export interface SeedResult {
  products_created: number;
  orders_created: number;
  date_range: {
    start: string;
    end: string;
  };
  status: 'success' | 'error';
  message?: string;
}

export async function seedDatabase(): Promise<SeedResult> {
  try {
    // Step 1: Generate data
    const products = generateProducts();
    const customers = generateCustomers(DATA_GENERATION_CONFIG.CUSTOMER_COUNT);

    // Products need IDs for order generation, so we'll generate temporary UUIDs
    const productsWithIds = products.map(p => ({
      ...p,
      id: crypto.randomUUID()
    }));

    const orders = generateOrders(
      productsWithIds,
      customers,
      DATA_GENERATION_CONFIG.DAYS
    );

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Step 2: Clear existing data
    await supabase.from('orders').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // Step 3: Insert products
    const { data: insertedProducts, error: productsError } = await supabase
      .from('products')
      .insert(products)
      .select();
    if (productsError) throw productsError;

    // Step 4: Map product IDs and insert orders
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const productMap = new Map(insertedProducts.map((p: any) => [p.name, p.id]));
    const ordersWithCorrectIds = orders.map(o => ({
      ...o,
      product_id: productMap.get(o.product_name)
    }));

    // Step 5: Insert orders in batches
    const batchSize = 500;
    for (let i = 0; i < ordersWithCorrectIds.length; i += batchSize) {
      const batch = ordersWithCorrectIds.slice(i, i + batchSize);
      const { error: ordersError } = await supabase.from('orders').insert(batch);
      if (ordersError) throw ordersError;
    }

    const sortedOrders = orders.sort((a, b) =>
      new Date(a.order_date).getTime() - new Date(b.order_date).getTime()
    );

    return {
      products_created: products.length,
      orders_created: orders.length,
      date_range: {
        start: sortedOrders[0]?.order_date || new Date().toISOString(),
        end: sortedOrders[sortedOrders.length - 1]?.order_date || new Date().toISOString()
      },
      status: 'success',
      message: 'Data seeded to Supabase successfully'
    };
  } catch (error) {
    console.error('Seed database error:', error);
    return {
      products_created: 0,
      orders_created: 0,
      date_range: { start: '', end: '' },
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
