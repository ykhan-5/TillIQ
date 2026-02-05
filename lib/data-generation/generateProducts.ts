import { faker } from '@faker-js/faker';
import { CATEGORIES, PRODUCT_NAMES } from '@/lib/utils/constants';
import type { Product } from '@/lib/types';

export interface GeneratedProduct extends Omit<Product, 'id' | 'created_at'> {}

export function generateProducts(): GeneratedProduct[] {
  const products: GeneratedProduct[] = [];

  for (const category of CATEGORIES) {
    const productNames = PRODUCT_NAMES[category.name as keyof typeof PRODUCT_NAMES];
    const count = Math.min(category.count, productNames.length);

    for (let i = 0; i < count; i++) {
      const base_price = faker.number.float({
        min: category.price_range[0],
        max: category.price_range[1],
        fractionDigits: 2
      });

      products.push({
        name: productNames[i],
        category: category.name,
        base_price: parseFloat(base_price.toFixed(2)),
        cost: parseFloat((base_price * category.cost_pct).toFixed(2)),
        initial_stock: faker.number.int({ min: 200, max: 800 })
      });
    }
  }

  return products;
}
