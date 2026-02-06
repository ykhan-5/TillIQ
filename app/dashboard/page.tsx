'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navigation } from '@/components/shared/Navigation';
import { OnboardingModal } from '@/components/shared/OnboardingModal';
import { KPICard } from '@/components/dashboard/KPICard';
import { SalesChart } from '@/components/dashboard/SalesChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { InsightsPayload, TopProduct } from '@/lib/types';

const TIME_RANGES = [
  { value: '7d', label: '7 days' },
  { value: '30d', label: '30 days' },
  { value: '90d', label: '90 days' },
];

function TrendArrow({ value }: { value: number }) {
  if (value > 0) {
    return (
      <span className="text-green-600 flex items-center text-xs">
        <svg className="w-3 h-3 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
        {value.toFixed(1)}%
      </span>
    );
  } else if (value < 0) {
    return (
      <span className="text-red-600 flex items-center text-xs">
        <svg className="w-3 h-3 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
        {Math.abs(value).toFixed(1)}%
      </span>
    );
  }
  return <span className="text-gray-500 text-xs">0%</span>;
}

function TopProductsTable({ products }: { products: TopProduct[] }) {
  return (
    <div className="overflow-x-auto -mx-2 sm:mx-0">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-2 sm:px-3 py-2 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
            <th className="px-2 sm:px-3 py-2 text-right text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Units</th>
            <th className="px-2 sm:px-3 py-2 text-right text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
            <th className="px-2 sm:px-3 py-2 text-right text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {products.slice(0, 5).map((product, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              <td className="px-2 sm:px-3 py-2">
                <div className="text-xs sm:text-sm font-medium text-gray-900 truncate max-w-[120px] sm:max-w-none">{product.name}</div>
                <div className="text-[10px] sm:text-xs text-gray-500">{product.category}</div>
              </td>
              <td className="px-2 sm:px-3 py-2 text-right text-xs sm:text-sm text-gray-700 hidden sm:table-cell">{product.units}</td>
              <td className="px-2 sm:px-3 py-2 text-right text-xs sm:text-sm text-gray-700">${product.revenue.toLocaleString()}</td>
              <td className="px-2 sm:px-3 py-2 text-right">
                <TrendArrow value={product.trend_pct} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [insights, setInsights] = useState<InsightsPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isLoggedIn = localStorage.getItem('demo_logged_in');
      if (!isLoggedIn) {
        router.push('/login');
      }
    }
  }, [router]);

  useEffect(() => {
    const fetchInsights = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/insights?time_range=${timeRange}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch insights');
        }

        setInsights(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInsights();
  }, [timeRange]);

  return (
    <div className="min-h-screen bg-gray-50">
      <OnboardingModal />
      <Navigation />

      <main className="mx-auto max-w-7xl px-3 py-4 sm:px-6 sm:py-8 lg:px-8">
        {/* Header */}
        <div className="mb-4 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600">
              Welcome back! Here&apos;s what&apos;s happening with your shop.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm text-gray-600">Time range:</span>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="rounded-md border border-gray-300 bg-white text-gray-900 px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {TIME_RANGES.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-2 text-gray-500">
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Loading insights...
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error loading data</h3>
                <p className="mt-2 text-sm text-red-700">{error}</p>
                <p className="mt-2 text-sm text-red-700">
                  Make sure you&apos;ve seeded the database from the{' '}
                  <Link href="/settings" className="underline font-medium">Settings page</Link>.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        {insights && !isLoading && (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4 mb-4 sm:mb-8">
              <KPICard
                label="Revenue"
                value={insights.kpis.revenue}
                format="currency"
                trend={{
                  direction: insights.trends.revenue_change_pct >= 0 ? 'up' : 'down',
                  value: Math.abs(insights.trends.revenue_change_pct)
                }}
              />
              <KPICard
                label="Orders"
                value={insights.kpis.orders}
                format="number"
                trend={{
                  direction: insights.trends.orders_change_pct >= 0 ? 'up' : 'down',
                  value: Math.abs(insights.trends.orders_change_pct)
                }}
              />
              <KPICard
                label="Average Order Value"
                value={insights.kpis.aov}
                format="currency"
                trend={{
                  direction: insights.trends.aov_change_pct >= 0 ? 'up' : 'down',
                  value: Math.abs(insights.trends.aov_change_pct)
                }}
              />
              <KPICard
                label="Returning Customers"
                value={insights.kpis.returning_pct}
                format="percentage"
              />
            </div>

            {/* Two Column Layout */}
            <div className="grid lg:grid-cols-2 gap-3 sm:gap-6 mb-4 sm:mb-8">
              {/* Top Products */}
              <Card>
                <CardHeader className="pb-2 sm:pb-4">
                  <CardTitle className="text-sm sm:text-base">Top Products</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {insights.top_products.length > 0 ? (
                    <TopProductsTable products={insights.top_products} />
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      <p className="text-sm">No product data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Sales Over Time */}
              <Card>
                <CardHeader className="pb-2 sm:pb-4">
                  <CardTitle className="text-sm sm:text-base">Sales Over Time</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <SalesChart chartData={insights.chart_data} timeRange={timeRange} />
                </CardContent>
              </Card>
            </div>

            {/* Weekly Brief CTA */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="py-4 sm:py-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                  <div className="text-center sm:text-left">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">Get deeper insights</h3>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                      Ask questions about your data and get AI-powered recommendations
                    </p>
                  </div>
                  <Link href="/ask" className="w-full sm:w-auto">
                    <Button className="w-full sm:w-auto">
                      Open Ask your Shop
                      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  );
}
