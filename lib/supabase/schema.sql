-- Supabase Database Schema for SellerScope
-- Run this SQL in your Supabase SQL Editor to create the required tables

-- Demo Users Table
CREATE TABLE IF NOT EXISTS demo_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert demo user
INSERT INTO demo_users (email, display_name)
VALUES ('demo@sellerscope.app', 'Demo Seller')
ON CONFLICT (email) DO NOTHING;

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  base_price DECIMAL(10,2) NOT NULL,
  cost DECIMAL(10,2) NOT NULL,
  initial_stock INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on category for faster queries
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_date TIMESTAMPTZ NOT NULL,
  customer_id UUID NOT NULL,
  product_id UUID NOT NULL REFERENCES products(id),
  product_name TEXT NOT NULL,
  category TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  cost DECIMAL(10,2) NOT NULL,
  gross_profit DECIMAL(10,2) GENERATED ALWAYS AS (total_price - cost) STORED,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indices for faster queries
CREATE INDEX IF NOT EXISTS idx_orders_date ON orders(order_date DESC);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_product ON orders(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_category ON orders(category);

-- Inventory Snapshots Table (optional)
CREATE TABLE IF NOT EXISTS inventory_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_date DATE NOT NULL,
  product_id UUID NOT NULL REFERENCES products(id),
  stock_on_hand INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(snapshot_date, product_id)
);

-- Create index on snapshot date
CREATE INDEX IF NOT EXISTS idx_inventory_date ON inventory_snapshots(snapshot_date DESC);

-- Customers Table (optional)
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) - optional for demo
-- ALTER TABLE products ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policies for demo access (optional)
-- CREATE POLICY "Allow all access to products" ON products FOR ALL USING (true);
-- CREATE POLICY "Allow all access to orders" ON orders FOR ALL USING (true);
