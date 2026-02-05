'use client';

import { Navigation } from '@/components/shared/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Weekly Brief</h1>
          <p className="mt-2 text-sm text-gray-600">
            Generate and export performance reports
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Generate Report</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Create a comprehensive weekly brief with KPIs, top products, trends, and actionable insights.
            </p>
            <div className="flex gap-3">
              <Button>Generate Weekly Brief</Button>
              <Button variant="outline">Export as PDF</Button>
              <Button variant="outline">Copy Summary</Button>
            </div>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">
                Report generation requires Supabase and OpenAI API keys to be configured.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
