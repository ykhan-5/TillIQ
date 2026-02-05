# SellerScope

**An AI-native seller workspace that transforms sales and inventory data into clear KPIs, trends, and concrete next actions.**

Built for a Square PM application to demonstrate product thinking, AI-native design, and end-to-end technical execution.

---

## Core Concept

SellerScope is a lightweight demo of a "Square seller workspace" that shows how AI can be embedded into commerce workflows. Instead of a generic chatbot, it provides:

- **Grounded AI outputs** that cite specific numbers and show assumptions
- **Structured insights** organized into Risks, Opportunities, and Actions
- **Commerce-aware analytics** (inventory risk, returning customers, gross profit)
- **End-to-end workflow**: Data → Insight → Action → Shareable Report

---

## Features

### 1. **Dashboard**
- KPI cards: Revenue, Orders, AOV, Returning Customers, Gross Profit
- Top products table with trend indicators
- Inventory risk panel showing low-stock items
- Weekly brief with key insights

### 2. **Metrics Pages**
- **Sales Analytics**: Revenue trends, order patterns, period-over-period comparisons
- **Product Performance**: Category breakdown, product movers (trending up/down)
- Time range selector (7d / 30d / 90d)

### 3. **Ask your Shop** (AI-powered Q&A)
- Preset prompts for common seller questions
- Structured AI responses with:
  - Summary
  - Risks
  - Opportunities
  - Recommended Actions
  - Numbers Used (citations)
  - Confidence level (High/Medium/Low)

### 4. **Reports**
- Weekly brief generator
- Export as PDF or copy to clipboard
- Shareable summaries

### 5. **Settings**
- Demo data generation (90 days of synthetic orders)
- Configuration status check
- Transparency info about the demo

---

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI GPT-4
- **Data Generation**: Faker.js, date-fns
- **Charts**: Recharts (for metrics visualizations)

---

## Project Structure

```
TillIQ/
├── app/                      # Next.js App Router pages
│   ├── login/                # Demo login page
│   ├── dashboard/            # Main seller dashboard
│   ├── metrics/              # Analytics pages (sales, products)
│   ├── ask/                  # AI Q&A interface
│   ├── reports/              # Weekly brief generator
│   ├── settings/             # Data management
│   └── api/                  # API routes
│       ├── seed-data/        # Generate demo data
│       ├── insights/         # Compute analytics payload
│       └── ask/              # AI query endpoint
├── components/
│   ├── ui/                   # Base UI components (Button, Card, etc.)
│   ├── dashboard/            # Dashboard-specific components
│   ├── shared/               # Shared components (Navigation)
│   └── ...
├── lib/
│   ├── types/                # TypeScript type definitions
│   ├── utils/                # Constants, formatters, helpers
│   ├── data-generation/      # Synthetic data generation
│   ├── analytics/            # KPI computation, trend analysis
│   ├── ai/                   # OpenAI prompts, response schemas
│   └── supabase/             # Supabase client, DB schema
└── public/                   # Static assets
```

---

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- A Supabase account (free tier works)
- An OpenAI API account

### 1. Clone and Install

```bash
cd TillIQ
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# App Configuration (optional)
NEXT_PUBLIC_APP_NAME=SellerScope
NEXT_PUBLIC_DEMO_USER_EMAIL=demo@sellerscope.app
```

#### Getting Supabase Credentials:

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to **Settings** → **API**
4. Copy your **Project URL** and **anon/public** key

#### Getting OpenAI API Key:

1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up or log in
3. Go to **API Keys** and create a new key
4. Copy the key (starts with `sk-...`)

### 3. Set Up Supabase Database

1. Go to your Supabase project
2. Navigate to **SQL Editor**
3. Copy the contents of `lib/supabase/schema.sql`
4. Paste and run the SQL to create tables

### 4. Generate Demo Data

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser:

1. Click **"Log in as Demo Seller"**
2. Navigate to **Settings**
3. Click **"Generate Data"**
4. Wait for ~10 seconds while 90 days of orders are generated

### 5. Explore the App

- **Dashboard**: View KPIs and top products
- **Metrics**: Analyze sales trends and product performance
- **Ask your Shop**: Try preset questions like "Summarize last 7 days" or "What should I reorder?"
- **Reports**: Generate a weekly brief

---

## Data Generation Details

The app generates realistic synthetic data:

- **25 products** across 5 categories (Coffee & Tea, Pastries, Food, Beverages, Merchandise)
- **~2,500 orders** over 90 days (~28 orders/day avg)
- **300 customers** (40% returning, 60% one-time)
- **Realistic patterns**:
  - Weekend dip (60% of weekday volume)
  - 15% growth trend over the period
  - Price variance (±10%)
  - Inventory depletion
  - Some products trending up, others declining

---

## AI Design Principles

### Grounded Outputs
- AI must cite specific numbers from the data
- Never hallucinate metrics
- Show assumptions explicitly

### Structured Responses
Every AI response includes:
- **Summary**: 2-3 sentence overview
- **Risks**: Potential issues with specific numbers
- **Opportunities**: Growth areas backed by data
- **Actions**: 1-3 concrete next steps
- **Numbers Used**: Citations showing which metrics were analyzed
- **Confidence**: High/Medium/Low based on data coverage

### Handling Edge Cases
- Missing data: "I don't have [metric] data. Here's what I can see..."
- Insufficient data: "Only X orders in this period. Consider a longer range."
- Ambiguous questions: Ask for clarification

---

## Key Files

### Critical Implementation Files

1. **`lib/data-generation/generateOrders.ts`**
   Generates 90 days of realistic synthetic orders with trends and variance

2. **`lib/analytics/buildInsightsPayload.ts`**
   Computes compact insights payload (KPIs + trends + anomalies) for AI

3. **`app/api/ask/route.ts`**
   AI endpoint that processes questions and returns structured responses

4. **`lib/ai/prompts.ts`**
   System prompt that ensures grounded, structured AI outputs

5. **`components/dashboard/KPICard.tsx`**
   Reusable KPI display component with trend indicators

---

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

---

## Architecture Highlights

### Data Flow

```
Orders in Supabase
    ↓
Analytics computation (computeKPIs, computeTrends, detectAnomalies)
    ↓
Insights payload (compact JSON <2000 tokens)
    ↓
OpenAI API (with grounded system prompt)
    ↓
Validated structured response (Zod schema)
    ↓
Rendered in UI with confidence badges
```

### Why This Approach?

1. **Token efficiency**: Send only computed insights to LLM, not raw orders
2. **Grounded outputs**: AI can only cite numbers we provide
3. **Validation**: Zod schema ensures AI returns expected structure
4. **Confidence levels**: Computed based on data availability, not fake precision

---

## What Makes This Demo Stand Out

### Product Thinking
- **Seller-first design**: Every page answers "What action should I take?"
- **Commerce-specific metrics**: Gross profit, inventory risk, returning customers
- **End-to-end workflow**: Insight → Action → Shareable Report

### AI-Native Design
- **Not a chatbot bolted on**: AI is embedded in the workflow
- **Transparency**: Shows assumptions, handles missing data gracefully
- **Structured outputs**: Risks/Opportunities/Actions, not generic text

### Technical Execution
- **Clean architecture**: Separation of concerns (data gen, analytics, AI, UI)
- **Type safety**: TypeScript throughout, Zod validation for AI
- **Production-ready patterns**: React Server Components, API routes, error handling

---

## Limitations (Intentional)

This is a **demo application** for a job application, not a production product:

- Demo login (localStorage only, no real auth)
- Synthetic data (not real Square transactions)
- No user management or multi-tenancy
- Simplified inventory tracking
- No payment processing or real Square API integration

---

## Future Enhancements (Out of Scope for Demo)

If this were a real product, we'd add:

- Real Square API integration (Orders API, Catalog API)
- Multi-store support with role-based access
- Advanced analytics (cohort analysis, customer segmentation)
- Mobile app for on-the-go insights
- Webhook notifications for critical alerts
- A/B testing for promotional campaigns
- Integration with marketing tools (Mailchimp, etc.)

---

## About

Built by **Yusuf** as part of a PM application to Square. The goal was to demonstrate:

1. **Product sense**: Deep understanding of seller pain points
2. **AI-first thinking**: Designing for transparency and trust
3. **Technical chops**: Clean code, modern stack, thoughtful architecture
4. **Attention to detail**: Realistic data, edge case handling, polish

---

## License

This is a demo project for a job application. Not licensed for commercial use.

---

## Questions?

If you're reviewing this for my application and have questions, feel free to reach out!

**Contact**: [Your email here]
**LinkedIn**: [Your LinkedIn profile]
**Portfolio**: [Your portfolio link]
