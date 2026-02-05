import { subDays } from 'date-fns';
import type { Order } from '@/lib/types/database.types';
import type { TrendData } from '@/lib/types/analytics.types';
import { computeKPIs } from './computeKPIs';

export function computeTrends(
  currentOrders: Order[],
  previousOrders: Order[],
  periodLabel: string
): TrendData {
  const currentKPIs = computeKPIs(currentOrders);
  const previousKPIs = computeKPIs(previousOrders);

  const calculateChange = (current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return parseFloat((((current - previous) / previous) * 100).toFixed(1));
  };

  return {
    revenue_change_pct: calculateChange(currentKPIs.revenue, previousKPIs.revenue),
    orders_change_pct: calculateChange(currentKPIs.orders, previousKPIs.orders),
    aov_change_pct: calculateChange(currentKPIs.aov, previousKPIs.aov),
    period_label: periodLabel
  };
}

export function filterOrdersByDateRange(
  orders: Order[],
  startDate: Date,
  endDate: Date
): Order[] {
  return orders.filter(order => {
    const orderDate = new Date(order.order_date);
    return orderDate >= startDate && orderDate <= endDate;
  });
}

export function getPreviousPeriodDates(days: number): { start: Date; end: Date } {
  const end = subDays(new Date(), days + 1);
  const start = subDays(end, days);
  return { start, end };
}
