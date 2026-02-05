// Database type definitions for Supabase tables

export interface DemoUser {
  id: string;
  email: string;
  display_name: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  base_price: number;
  cost: number;
  initial_stock: number;
  created_at: string;
}

export interface Order {
  id: string;
  order_date: string;
  customer_id: string;
  product_id: string;
  product_name: string;
  category: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  cost: number;
  gross_profit?: number;
  created_at: string;
}

export interface InventorySnapshot {
  id: string;
  snapshot_date: string;
  product_id: string;
  stock_on_hand: number;
  created_at: string;
}

export interface Customer {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  created_at: string;
}

// Database table names
export type TableName = 'demo_users' | 'products' | 'orders' | 'inventory_snapshots' | 'customers';
