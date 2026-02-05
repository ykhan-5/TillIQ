'use client';

import { useState, useEffect } from 'react';
import { Navigation } from '@/components/shared/Navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ConfigStatus {
  supabase: boolean;
  openai: boolean;
}

export default function SettingsPage() {
  const [configStatus, setConfigStatus] = useState<ConfigStatus | null>(null);

  useEffect(() => {
    const checkConfig = async () => {
      try {
        const response = await fetch('/api/config-status');
        const data = await response.json();
        setConfigStatus(data);
      } catch (error) {
        console.error('Failed to check config status:', error);
      }
    };
    checkConfig();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="mt-2 text-sm text-gray-600">
            Application configuration and information
          </p>
        </div>

        <div className="space-y-6">
          {/* Configuration Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Configuration Status</CardTitle>
              <CardDescription>
                Check which services are properly configured
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-700">Supabase</span>
                  <p className="text-xs text-gray-500">Database and data storage</p>
                </div>
                {configStatus === null ? (
                  <Badge variant="secondary">Checking...</Badge>
                ) : configStatus.supabase ? (
                  <Badge className="bg-green-100 text-green-800 border-green-200">Configured</Badge>
                ) : (
                  <Badge variant="danger">Not Configured</Badge>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-700">OpenAI API</span>
                  <p className="text-xs text-gray-500">AI-powered insights</p>
                </div>
                {configStatus === null ? (
                  <Badge variant="secondary">Checking...</Badge>
                ) : configStatus.openai ? (
                  <Badge className="bg-green-100 text-green-800 border-green-200">Configured</Badge>
                ) : (
                  <Badge variant="danger">Not Configured</Badge>
                )}
              </div>
              {configStatus && configStatus.supabase && configStatus.openai && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium text-green-800">All services configured!</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Transparency */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">About This Demo</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>This is a demonstration application built for a PM job application at Square</li>
                <li>All data is synthetically generated and not based on real transactions</li>
                <li>AI insights are generated live using OpenAI&apos;s GPT models</li>
                <li>Demo login uses localStorage for session management</li>
                <li>Full production implementation would include proper authentication, data privacy controls, and real Square API integration</li>
              </ul>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <a href="/dashboard">
                  <Button variant="outline" size="sm">Go to Dashboard</Button>
                </a>
                <a href="/ask">
                  <Button variant="outline" size="sm">Ask your Shop</Button>
                </a>
                <a href="/reports">
                  <Button variant="outline" size="sm">Generate Report</Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
