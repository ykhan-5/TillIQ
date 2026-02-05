'use client';

import { Navigation } from '@/components/shared/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PRESET_PROMPTS } from '@/lib/ai/prompts';

export default function AskPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Ask your Shop</h1>
          <p className="mt-2 text-sm text-gray-600">
            Get AI-powered insights about your sales and inventory
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar with preset prompts */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {PRESET_PROMPTS.map((prompt) => (
                  <Button
                    key={prompt.id}
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-3"
                  >
                    {prompt.label}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main chat area */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col">
              <CardContent className="flex-1 p-6 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No messages yet
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Click a preset question or type your own to get started
                  </p>
                  <div className="mt-4">
                    <p className="text-xs text-gray-400">
                      OpenAI API key required to use this feature
                    </p>
                  </div>
                </div>
              </CardContent>

              {/* Input area */}
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ask a question about your shop..."
                    className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-square-blue focus:outline-none"
                    disabled
                  />
                  <Button disabled>Ask</Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
