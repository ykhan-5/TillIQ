// Analytics and metrics type definitions

export interface KPIs {
  revenue: number;
  orders: number;
  aov: number; // Average Order Value
  returning_pct: number;
  gross_profit: number;
  gross_margin_pct: number;
}

export interface TrendData {
  revenue_change_pct: number;
  orders_change_pct: number;
  aov_change_pct: number;
  period_label: string; // e.g., "vs previous 30d"
}

export interface TopProduct {
  name: string;
  category: string;
  revenue: number;
  units: number;
  trend_pct: number; // percentage change vs previous period
}

export interface CategoryBreakdown {
  category: string;
  revenue: number;
  pct_of_total: number;
  units: number;
}

export interface Anomaly {
  type: 'revenue_dip' | 'stockout' | 'zero_sales' | 'inventory_risk';
  description: string;
  severity: 'high' | 'medium' | 'low';
  product_name?: string;
  metric_value?: number;
}

export interface SampleOrder {
  date: string;
  product: string;
  total: number;
  category: string;
}

export interface InsightsPayload {
  time_range: string;
  kpis: KPIs;
  trends: TrendData;
  top_products: TopProduct[];
  category_breakdown: CategoryBreakdown[];
  anomalies: Anomaly[];
  sample_orders: SampleOrder[];
}

export interface TimeRange {
  start_date: Date;
  end_date: Date;
  label: string;
}

export type TimeRangeOption = '7d' | '30d' | '90d' | 'custom';

export interface ChartDataPoint {
  date: string;
  revenue: number;
  orders: number;
  aov: number;
}

export interface ProductMover {
  product_name: string;
  category: string;
  current_units: number;
  previous_units: number;
  change_pct: number;
  direction: 'up' | 'down' | 'flat';
}

export interface InventoryRisk {
  product_id: string;
  product_name: string;
  category: string;
  current_stock: number;
  daily_sales_avg: number;
  days_until_stockout: number;
  recommended_order_qty: number;
}
