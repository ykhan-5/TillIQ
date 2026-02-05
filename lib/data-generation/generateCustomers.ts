import { faker } from '@faker-js/faker';
import { DATA_GENERATION_CONFIG } from '@/lib/utils/constants';

export interface GeneratedCustomer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  is_returning: boolean;
  expected_orders: number;
}

export function generateCustomers(count: number = DATA_GENERATION_CONFIG.CUSTOMER_COUNT): GeneratedCustomer[] {
  const customers: GeneratedCustomer[] = [];

  for (let i = 0; i < count; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const isReturning = faker.datatype.boolean({
      probability: DATA_GENERATION_CONFIG.RETURNING_CUSTOMER_RATE
    });

    customers.push({
      id: faker.string.uuid(),
      first_name: firstName,
      last_name: lastName,
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
      is_returning: isReturning,
      expected_orders: isReturning ? faker.number.int({ min: 2, max: 10 }) : 1
    });
  }

  return customers;
}
