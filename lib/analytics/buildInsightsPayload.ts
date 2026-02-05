import { subDays } from 'date-fns';
import type { Order } from '@/lib/types/database.types';
import type {
  InsightsPayload,
  TopProduct,
  CategoryBreakdown,
  DailyChartData
} from '@/lib/types/analytics.types';
import { computeKPIs } from './computeKPIs';
import { computeTrends, filterOrdersByDateRange, getPreviousPeriodDates } from './computeTrends';
import { detectAnomalies } from './detectAnomalies';
import { AI_CONFIG } from '@/lib/utils/constants';

export function buildInsightsPayload(
  allOrders: Order[],
  timeRange: string
): InsightsPayload {
  // Parse time range
  const days = parseInt(timeRange.replace('d', ''));
  const endDate = new Date();
  const startDate = subDays(endDate, days);

  // Filter orders for current period
  const currentOrders = filterOrdersByDateRange(allOrders, startDate, endDate);

  // Get previous period orders for comparison
  const { start: prevStart, end: prevEnd } = getPreviousPeriodDates(days);
  const previousOrders = filterOrdersByDateRange(allOrders, prevStart, prevEnd);

  // Compute KPIs
  const kpis = computeKPIs(currentOrders);
  const previousKPIs = computeKPIs(previousOrders);

  // Compute trends
  const trends = computeTrends(
    currentOrders,
    previousOrders,
    `vs previous ${days}d`
  );

  // Calculate top products
  const top_products = calculateTopProducts(currentOrders, previousOrders);

  // Calculate category breakdown
  const category_breakdown = calculateCategoryBreakdown(currentOrders);

  // Detect anomalies
  const anomalies = detectAnomalies(
    currentOrders,
    kpis.revenue,
    previousKPIs.revenue
  );

  // Get sample orders
  const sample_orders = currentOrders
    .slice(-AI_CONFIG.MAX_SAMPLE_ORDERS)
    .map(o => ({
      date: o.order_date,
      product: o.product_name,
      total: o.total_price,
      category: o.category
    }));

  // Calculate daily chart data for the full date range
  const chart_data = calculateDailyChartData(currentOrders, startDate, endDate);

  return {
    time_range: timeRange,
    kpis,
    trends,
    top_products,
    category_breakdown,
    anomalies,
    sample_orders,
    chart_data
  };
}

function calculateTopProducts(
  currentOrders: Order[],
  previousOrders: Order[]
): TopProduct[] {
  // Aggregate current period sales by product
  const productStats = new Map<string, {
    name: string;
    category: string;
    revenue: number;
    units: number;
  }>();

  currentOrders.forEach(order => {
    const existing = productStats.get(order.product_name);
    if (existing) {
      existing.revenue += order.total_price;
      existing.units += order.quantity;
    } else {
      productStats.set(order.product_name, {
        name: order.product_name,
        category: order.category,
        revenue: order.total_price,
        units: order.quantity
      });
    }
  });

  // Calculate previous period units for trend
  const previousUnits = new Map<string, number>();
  previousOrders.forEach(order => {
    const current = previousUnits.get(order.product_name) || 0;
    previousUnits.set(order.product_name, current + order.quantity);
  });

  // Convert to array and calculate trends
  const products: TopProduct[] = Array.from(productStats.values()).map(p => {
    const prevUnits = previousUnits.get(p.name) || 0;
    const trend_pct = prevUnits > 0
      ? parseFloat((((p.units - prevUnits) / prevUnits) * 100).toFixed(1))
      : p.units > 0 ? 100 : 0;

    return {
      name: p.name,
      category: p.category,
      revenue: parseFloat(p.revenue.toFixed(2)),
      units: p.units,
      trend_pct
    };
  });

  // Sort by revenue and take top products
  return products
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, AI_CONFIG.MAX_TOP_PRODUCTS);
}

function calculateCategoryBreakdown(orders: Order[]): CategoryBreakdown[] {
  const categoryStats = new Map<string, { revenue: number; units: number }>();
  const totalRevenue = orders.reduce((sum, o) => sum + o.total_price, 0);

  orders.forEach(order => {
    const existing = categoryStats.get(order.category);
    if (existing) {
      existing.revenue += order.total_price;
      existing.units += order.quantity;
    } else {
      categoryStats.set(order.category, {
        revenue: order.total_price,
        units: order.quantity
      });
    }
  });

  return Array.from(categoryStats.entries())
    .map(([category, stats]) => ({
      category,
      revenue: parseFloat(stats.revenue.toFixed(2)),
      pct_of_total: totalRevenue > 0
        ? parseFloat(((stats.revenue / totalRevenue) * 100).toFixed(1))
        : 0,
      units: stats.units
    }))
    .sort((a, b) => b.revenue - a.revenue);
}

function calculateDailyChartData(
  orders: Order[],
  startDate: Date,
  endDate: Date
): DailyChartData[] {
  // Create a map to aggregate revenue and orders by date
  const dailyStats = new Map<string, { revenue: number; orders: number }>();

  // Initialize all days in the range with zero values
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const dateKey = currentDate.toISOString().split('T')[0];
    dailyStats.set(dateKey, { revenue: 0, orders: 0 });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Aggregate orders by date
  orders.forEach(order => {
    const dateKey = order.order_date.split('T')[0];
    const existing = dailyStats.get(dateKey);
    if (existing) {
      existing.revenue += order.total_price;
      existing.orders += 1;
    }
  });

  // Convert to array and sort by date
  return Array.from(dailyStats.entries())
    .map(([date, stats]) => ({
      date,
      displayDate: new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      }),
      revenue: parseFloat(stats.revenue.toFixed(2)),
      orders: stats.orders
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}
