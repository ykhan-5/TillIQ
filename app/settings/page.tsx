'use client';

import { useState } from 'react';
import { Navigation } from '@/components/shared/Navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function SettingsPage() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<any>(null);

  const handleSeedData = async () => {
    setIsSeeding(true);
    setSeedResult(null);

    try {
      const response = await fetch('/api/seed-data', { method: 'POST' });
      const data = await response.json();
      setSeedResult(data);
    } catch (error) {
      setSeedResult({
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to seed data'
      });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your demo data and application configuration
          </p>
        </div>

        <div className="space-y-6">
          {/* Demo Data Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Demo Data Management</CardTitle>
              <CardDescription>
                Generate synthetic sales and inventory data for the demo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Generate Demo Data</h4>
                  <p className="text-sm text-gray-500">
                    Creates 90 days of synthetic orders, products, and customer data
                  </p>
                </div>
                <Button
                  onClick={handleSeedData}
                  disabled={isSeeding}
                >
                  {isSeeding ? 'Generating...' : 'Generate Data'}
                </Button>
              </div>

              {seedResult && (
                <div className={`p-4 rounded-lg ${
                  seedResult.status === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                }`}>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      {seedResult.status === 'success' ? (
                        <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="ml-3">
                      <h3 className={`text-sm font-medium ${
                        seedResult.status === 'success' ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {seedResult.status === 'success' ? 'Success!' : 'Error'}
                      </h3>
                      <div className={`mt-2 text-sm ${
                        seedResult.status === 'success' ? 'text-green-700' : 'text-red-700'
                      }`}>
                        <p>{seedResult.message}</p>
                        {seedResult.status === 'success' && (
                          <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>Products created: {seedResult.products_created}</li>
                            <li>Orders created: {seedResult.orders_created}</li>
                            <li>Date range: {seedResult.date_range?.start ? new Date(seedResult.date_range.start).toLocaleDateString() : 'N/A'} - {seedResult.date_range?.end ? new Date(seedResult.date_range.end).toLocaleDateString() : 'N/A'}</li>
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Configuration Status */}
          <Card>
            <CardHeader>
              <CardTitle>Configuration Status</CardTitle>
              <CardDescription>
                Check which services are properly configured
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Supabase</span>
                <Badge variant="secondary">Not Configured</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">OpenAI API</span>
                <Badge variant="secondary">Not Configured</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Transparency */}
          <Card>
            <CardHeader>
              <CardTitle>About This Demo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm text-gray-600">
                <ul className="space-y-2">
                  <li>This is a demonstration application built for a PM job application</li>
                  <li>All data is synthetically generated and not based on real transactions</li>
                  <li>AI insights are generated live using OpenAI's GPT models</li>
                  <li>Demo login uses localStorage for session management</li>
                  <li>Full production implementation would include proper authentication and data privacy controls</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
