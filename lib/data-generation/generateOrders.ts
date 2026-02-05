import { faker } from '@faker-js/faker';
import { subDays, startOfDay } from 'date-fns';
import { CATEGORIES, DATA_GENERATION_CONFIG } from '@/lib/utils/constants';
import type { Order } from '@/lib/types';
import type { GeneratedProduct } from './generateProducts';
import type { GeneratedCustomer } from './generateCustomers';

export interface GeneratedOrder extends Omit<Order, 'id' | 'created_at' | 'gross_profit'> {
  product_id: string;
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
  const today = startOfDay(new Date());

  // Track customer order counts
  const customerOrderCount: CustomerOrderCount = {};
  customers.forEach(c => {
    customerOrderCount[c.id] = 0;
  });

  // Generate orders for each day, from oldest to most recent
  for (let dayOffset = 0; dayOffset < days; dayOffset++) {
    // dayOffset 0 = oldest day (days-1 days ago)
    // dayOffset days-1 = today
    const daysAgo = days - 1 - dayOffset;
    const date = subDays(today, daysAgo);

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
      // Pick a random product (no inventory constraints for demo data)
      const product = pickRandomProduct(products);

      // Pick customer
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

      customerOrderCount[customer.id]++;
    }
  }

  return orders;
}

function pickRandomProduct(
  products: (GeneratedProduct & { id: string })[]
): GeneratedProduct & { id: string } {
  // Pick category first based on weights
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
  const categoryProducts = products.filter(p => p.category === selectedCategory);
  if (categoryProducts.length === 0) {
    return faker.helpers.arrayElement(products);
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
