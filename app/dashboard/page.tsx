'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/shared/Navigation';
import { KPICard } from '@/components/dashboard/KPICard';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    if (typeof window !== 'undefined') {
      const isLoggedIn = localStorage.getItem('demo_logged_in');
      if (!isLoggedIn) {
        router.push('/login');
      }
    }
  }, [router]);

  // Placeholder data - will be replaced with real data from Supabase
  const kpis = {
    revenue: 12345,
    orders: 387,
    aov: 31.89,
    returning_pct: 42.5,
    gross_profit: 8641,
  };

  const trends = {
    revenue: 8.3,
    orders: 5.2,
    aov: 2.9,
    returning: 3.1,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">
            Welcome back! Here's what's happening with your shop.
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <KPICard
            label="Revenue"
            value={kpis.revenue}
            format="currency"
            trend={{ direction: 'up', value: trends.revenue }}
          />
          <KPICard
            label="Orders"
            value={kpis.orders}
            format="number"
            trend={{ direction: 'up', value: trends.orders }}
          />
          <KPICard
            label="Average Order Value"
            value={kpis.aov}
            format="currency"
            trend={{ direction: 'up', value: trends.aov }}
          />
          <KPICard
            label="Returning Customers"
            value={kpis.returning_pct}
            format="percentage"
            trend={{ direction: 'up', value: trends.returning }}
          />
        </div>

        {/* Info Banner */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-blue-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Setup Required
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  This dashboard is showing placeholder data. To see real analytics:
                </p>
                <ol className="list-decimal list-inside mt-2 space-y-1">
                  <li>Add your Supabase credentials to <code className="bg-blue-100 px-1 rounded">.env.local</code></li>
                  <li>Run the database schema in Supabase SQL Editor</li>
                  <li>Add your OpenAI API key to <code className="bg-blue-100 px-1 rounded">.env.local</code></li>
                  <li>Visit Settings to generate demo data</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
