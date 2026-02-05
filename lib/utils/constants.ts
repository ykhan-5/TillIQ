// Application constants

export const CATEGORIES = [
  {
    name: 'Coffee & Tea',
    count: 8,
    price_range: [3, 7] as [number, number],
    cost_pct: 0.25,
    weight: 0.50 // 50% of all orders
  },
  {
    name: 'Pastries',
    count: 6,
    price_range: [3, 6] as [number, number],
    cost_pct: 0.30,
    weight: 0.25 // 25% of all orders
  },
  {
    name: 'Food',
    count: 5,
    price_range: [8, 15] as [number, number],
    cost_pct: 0.35,
    weight: 0.15 // 15% of all orders
  },
  {
    name: 'Beverages',
    count: 4,
    price_range: [2, 5] as [number, number],
    cost_pct: 0.20,
    weight: 0.08 // 8% of all orders
  },
  {
    name: 'Merchandise',
    count: 2,
    price_range: [10, 30] as [number, number],
    cost_pct: 0.40,
    weight: 0.02 // 2% of all orders
  }
];

export const PRODUCT_NAMES = {
  'Coffee & Tea': [
    'Espresso',
    'Cappuccino',
    'Latte',
    'Cold Brew',
    'Chai Latte',
    'Americano',
    'Green Tea',
    'Matcha Latte'
  ],
  'Pastries': [
    'Croissant',
    'Blueberry Muffin',
    'Chocolate Chip Cookie',
    'Cinnamon Roll',
    'Almond Scone',
    'Banana Bread'
  ],
  'Food': [
    'Avocado Toast',
    'Turkey Sandwich',
    'Caesar Salad',
    'Breakfast Burrito',
    'Veggie Wrap'
  ],
  'Beverages': [
    'Orange Juice',
    'Bottled Water',
    'Kombucha',
    'Smoothie'
  ],
  'Merchandise': [
    'Reusable Cup',
    'Coffee Beans (12oz)'
  ]
};

export const TIME_RANGES = {
  '7d': { days: 7, label: 'Last 7 days' },
  '30d': { days: 30, label: 'Last 30 days' },
  '90d': { days: 90, label: 'Last 90 days' }
};

export const DATA_GENERATION_CONFIG = {
  DAYS: 90,
  BASE_DAILY_ORDERS: 25,
  WEEKEND_MULTIPLIER: 0.6,
  GROWTH_RATE: 0.15, // 15% growth over the period
  PRICE_VARIANCE: 0.1, // ±10%
  MIN_STOCK_THRESHOLD: 20,
  CUSTOMER_COUNT: 300,
  RETURNING_CUSTOMER_RATE: 0.40 // 40% of customers are returning
};

export const AI_CONFIG = {
  MAX_TOP_PRODUCTS: 10,
  MAX_SAMPLE_ORDERS: 20,
  ANOMALY_THRESHOLDS: {
    REVENUE_DIP: -0.15, // -15% or more
    LOW_STOCK: 20,
    ZERO_SALES_DAYS: 14
  }
};

export const APP_CONFIG = {
  NAME: 'SellerScope',
  TAGLINE: 'Turn sales data into next actions',
  DEMO_USER_EMAIL: 'demo@sellerscope.app',
  DEMO_USER_NAME: 'Demo Seller'
};
