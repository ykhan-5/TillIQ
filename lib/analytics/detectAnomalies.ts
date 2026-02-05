import type { Order } from '@/lib/types/database.types';
import type { Anomaly } from '@/lib/types/analytics.types';
import { AI_CONFIG } from '@/lib/utils/constants';

export function detectAnomalies(
  orders: Order[],
  currentRevenue: number,
  previousRevenue: number,
  productStockLevels?: Map<string, number>
): Anomaly[] {
  const anomalies: Anomaly[] = [];

  // Check for revenue dip
  if (previousRevenue > 0) {
    const revenueChange = (currentRevenue - previousRevenue) / previousRevenue;
    if (revenueChange <= AI_CONFIG.ANOMALY_THRESHOLDS.REVENUE_DIP) {
      anomalies.push({
        type: 'revenue_dip',
        description: `Revenue declined by ${Math.abs(revenueChange * 100).toFixed(1)}% compared to previous period`,
        severity: revenueChange <= -0.25 ? 'high' : 'medium',
        metric_value: currentRevenue
      });
    }
  }

  // Check for products with zero sales in recent period
  if (orders.length > 0) {
    const productSales = new Map<string, number>();
    orders.forEach(order => {
      const current = productSales.get(order.product_name) || 0;
      productSales.set(order.product_name, current + 1);
    });

    // Get all unique products that have ever been sold
    const allProducts = new Set(orders.map(o => o.product_name));

    allProducts.forEach(productName => {
      if (!productSales.has(productName) || productSales.get(productName) === 0) {
        anomalies.push({
          type: 'zero_sales',
          description: `${productName} has had no sales in the selected period`,
          severity: 'low',
          product_name: productName
        });
      }
    });
  }

  // Check for low stock levels
  if (productStockLevels) {
    productStockLevels.forEach((stock, productName) => {
      if (stock <= AI_CONFIG.ANOMALY_THRESHOLDS.LOW_STOCK && stock > 0) {
        anomalies.push({
          type: 'inventory_risk',
          description: `${productName} is low on stock (${stock} units remaining)`,
          severity: stock <= 10 ? 'high' : 'medium',
          product_name: productName,
          metric_value: stock
        });
      } else if (stock === 0) {
        anomalies.push({
          type: 'stockout',
          description: `${productName} is out of stock`,
          severity: 'high',
          product_name: productName,
          metric_value: 0
        });
      }
    });
  }

  return anomalies;
}
