import type { Order } from '@/lib/types/database.types';
import type { KPIs } from '@/lib/types/analytics.types';

export function computeKPIs(orders: Order[]): KPIs {
  if (orders.length === 0) {
    return {
      revenue: 0,
      orders: 0,
      aov: 0,
      returning_pct: 0,
      gross_profit: 0,
      gross_margin_pct: 0
    };
  }

  // Calculate revenue and gross profit
  const revenue = orders.reduce((sum, order) => sum + order.total_price, 0);
  const totalCost = orders.reduce((sum, order) => sum + order.cost, 0);
  const gross_profit = revenue - totalCost;
  const gross_margin_pct = revenue > 0 ? (gross_profit / revenue) * 100 : 0;

  // Calculate AOV (Average Order Value)
  const aov = revenue / orders.length;

  // Calculate returning customer percentage
  const customerOrders = new Map<string, number>();
  orders.forEach(order => {
    const count = customerOrders.get(order.customer_id) || 0;
    customerOrders.set(order.customer_id, count + 1);
  });

  const returningCustomers = Array.from(customerOrders.values()).filter(count => count > 1).length;
  const returning_pct = (returningCustomers / customerOrders.size) * 100;

  return {
    revenue: parseFloat(revenue.toFixed(2)),
    orders: orders.length,
    aov: parseFloat(aov.toFixed(2)),
    returning_pct: parseFloat(returning_pct.toFixed(1)),
    gross_profit: parseFloat(gross_profit.toFixed(2)),
    gross_margin_pct: parseFloat(gross_margin_pct.toFixed(1))
  };
}
