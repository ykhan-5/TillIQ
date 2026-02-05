import { faker } from '@faker-js/faker';
import { subDays, startOfDay } from 'date-fns';
import { CATEGORIES, DATA_GENERATION_CONFIG } from '@/lib/utils/constants';
import type { Order } from '@/lib/types';
import type { GeneratedProduct } from './generateProducts';
import type { GeneratedCustomer } from './generateCustomers';

export interface GeneratedOrder extends Omit<Order, 'id' | 'created_at' | 'gross_profit'> {
  product_id: string;
}

interface InventoryMap {
  [product_id: string]: number;
}

interface CustomerOrderCount {
  [customer_id: string]: number;
}

export function generateOrders(
  products: (GeneratedProduct & { id: string })[],
  customers: GeneratedCustomer[],
  days: number = DATA_GENERATION_CONFIG.DAYS
): GeneratedOrder[] {
  const orders: GeneratedOrder[] = [];
  const today = new Date();

  // Initialize inventory tracking
  const inventory: InventoryMap = {};
  products.forEach(p => {
    inventory[p.id] = p.initial_stock;
  });

  // Track customer order counts
  const customerOrderCount: CustomerOrderCount = {};
  customers.forEach(c => {
    customerOrderCount[c.id] = 0;
  });

  // Generate orders for each day
  for (let dayOffset = 0; dayOffset < days; dayOffset++) {
    const date = startOfDay(subDays(today, days - dayOffset - 1));

    // Calculate daily order volume with trends
    const isWeekend = [0, 6].includes(date.getDay());
    const weekendMultiplier = isWeekend ? DATA_GENERATION_CONFIG.WEEKEND_MULTIPLIER : 1.0;
    const growthMultiplier = 1 + (dayOffset / days) * DATA_GENERATION_CONFIG.GROWTH_RATE;
    const randomVariance = faker.number.float({ min: 0.8, max: 1.2 });

    const dailyOrders = Math.round(
      DATA_GENERATION_CONFIG.BASE_DAILY_ORDERS *
      weekendMultiplier *
      growthMultiplier *
      randomVariance
    );

    // Generate orders for this day
    for (let i = 0; i < dailyOrders; i++) {
      // Pick product weighted by category popularity
      const product = pickWeightedProduct(products, inventory);
      if (!product) continue; // Skip if all products are out of stock

      // Check inventory
      if (inventory[product.id] < 1) continue;

      // Pick customer (prefer returning customers who haven't hit their order limit)
      const customer = pickCustomer(customers, customerOrderCount);

      // Generate order details
      const quantity = faker.number.int({ min: 1, max: 3 });
      const priceVariance = faker.number.float({
        min: 1 - DATA_GENERATION_CONFIG.PRICE_VARIANCE,
        max: 1 + DATA_GENERATION_CONFIG.PRICE_VARIANCE
      });
      const unit_price = parseFloat((product.base_price * priceVariance).toFixed(2));
      const total_price = parseFloat((unit_price * quantity).toFixed(2));
      const cost = parseFloat((product.cost * quantity).toFixed(2));

      // Add random hours/minutes to the date
      const orderDate = new Date(date);
      orderDate.setHours(faker.number.int({ min: 6, max: 20 }));
      orderDate.setMinutes(faker.number.int({ min: 0, max: 59 }));

      orders.push({
        order_date: orderDate.toISOString(),
        customer_id: customer.id,
        product_id: product.id,
        product_name: product.name,
        category: product.category,
        quantity,
        unit_price,
        total_price,
        cost
      });

      // Update inventory and customer order count
      inventory[product.id] -= quantity;
      customerOrderCount[customer.id]++;
    }
  }

  return orders;
}

function pickWeightedProduct(
  products: (GeneratedProduct & { id: string })[],
  inventory: InventoryMap
): (GeneratedProduct & { id: string }) | null {
  // Filter products with available stock
  const availableProducts = products.filter(p => inventory[p.id] > 0);
  if (availableProducts.length === 0) return null;

  // Get category weights
  const categoryWeights = CATEGORIES.reduce((acc, cat) => {
    acc[cat.name] = cat.weight;
    return acc;
  }, {} as { [key: string]: number });

  // Pick category first
  const random = Math.random();
  let cumulative = 0;
  let selectedCategory = CATEGORIES[0].name;

  for (const cat of CATEGORIES) {
    cumulative += cat.weight;
    if (random <= cumulative) {
      selectedCategory = cat.name;
      break;
    }
  }

  // Pick random product from that category
  const categoryProducts = availableProducts.filter(p => p.category === selectedCategory);
  if (categoryProducts.length === 0) {
    // Fallback to any available product
    return faker.helpers.arrayElement(availableProducts);
  }

  return faker.helpers.arrayElement(categoryProducts);
}

function pickCustomer(
  customers: GeneratedCustomer[],
  orderCount: CustomerOrderCount
): GeneratedCustomer {
  // Filter customers who haven't exceeded their expected orders
  const availableCustomers = customers.filter(
    c => orderCount[c.id] < c.expected_orders
  );

  if (availableCustomers.length === 0) {
    // All customers hit their limit, pick any customer
    return faker.helpers.arrayElement(customers);
  }

  // Prefer returning customers
  const returningCustomers = availableCustomers.filter(c => c.is_returning);
  if (returningCustomers.length > 0 && Math.random() < 0.6) {
    return faker.helpers.arrayElement(returningCustomers);
  }

  return faker.helpers.arrayElement(availableCustomers);
}
