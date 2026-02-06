'use client';

import { useState, useRef, useEffect } from 'react';
import { Navigation } from '@/components/shared/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PRESET_PROMPTS } from '@/lib/ai/prompts';
import type { AIResponse, ChatMessage, ConfidenceLevel } from '@/lib/types';

const TIME_RANGES = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
];

function ConfidenceBadge({ level }: { level: ConfidenceLevel }) {
  const colors = {
    high: 'bg-green-100 text-green-800 border-green-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    low: 'bg-red-100 text-red-800 border-red-200',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[level]}`}>
      {level.charAt(0).toUpperCase() + level.slice(1)} Confidence
    </span>
  );
}

function AIResponseDisplay({ response }: { response: AIResponse }) {
  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Summary */}
      <div>
        <h4 className="text-xs sm:text-sm font-semibold text-gray-900 mb-1">Summary</h4>
        <p className="text-xs sm:text-sm text-gray-700">{response.summary}</p>
      </div>

      {/* Risks */}
      {response.risks.length > 0 && (
        <div>
          <h4 className="text-xs sm:text-sm font-semibold text-red-700 mb-1 flex items-center gap-1">
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Risks
          </h4>
          <ul className="list-disc list-inside space-y-1">
            {response.risks.map((risk, i) => (
              <li key={i} className="text-xs sm:text-sm text-gray-700">{risk}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Opportunities */}
      {response.opportunities.length > 0 && (
        <div>
          <h4 className="text-xs sm:text-sm font-semibold text-green-700 mb-1 flex items-center gap-1">
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Opportunities
          </h4>
          <ul className="list-disc list-inside space-y-1">
            {response.opportunities.map((opp, i) => (
              <li key={i} className="text-xs sm:text-sm text-gray-700">{opp}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommended Actions */}
      {response.actions.length > 0 && (
        <div>
          <h4 className="text-xs sm:text-sm font-semibold text-blue-700 mb-1 flex items-center gap-1">
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            Actions
          </h4>
          <ol className="list-decimal list-inside space-y-1">
            {response.actions.map((action, i) => (
              <li key={i} className="text-xs sm:text-sm text-gray-700">{action}</li>
            ))}
          </ol>
        </div>
      )}

      {/* Numbers Used */}
      {response.numbers_used.length > 0 && (
        <div>
          <h4 className="text-xs sm:text-sm font-semibold text-gray-600 mb-2 flex items-center gap-1">
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
            Numbers
          </h4>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {response.numbers_used.map((num, i) => (
              <span key={i} className="inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md text-[10px] sm:text-xs bg-gray-100 text-gray-700 border border-gray-200">
                <span className="font-medium">{num.label}:</span>
                <span className="ml-1">{num.value}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Confidence */}
      <div className="pt-2 border-t border-gray-100">
        <ConfidenceBadge level={response.confidence} />
      </div>
    </div>
  );
}

function LoadingIndicator() {
  return (
    <div className="flex items-center gap-2 text-gray-500">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      <span className="text-sm">Analyzing your data...</span>
    </div>
  );
}

export default function AskPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('30d');
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (question: string) => {
    if (!question.trim() || isLoading) return;

    setError(null);
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: question,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, time_range: timeRange }),
      });

      // Check content type before parsing JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server error. Please try again later.');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to get response');
      }

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data as AIResponse,
        timestamp: new Date(),
        confidence: data.confidence,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePresetClick = (question: string) => {
    handleSubmit(question);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(input);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="mx-auto max-w-7xl px-3 py-4 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-4 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Ask your Shop</h1>
            <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600">
              Get AI-powered insights about your sales and inventory
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

        {/* Mobile Quick Questions - horizontal scroll */}
        <div className="lg:hidden mb-4">
          <p className="text-xs font-medium text-gray-600 mb-2">Quick Questions:</p>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-3 px-3 scrollbar-hide">
            {PRESET_PROMPTS.map((prompt) => (
              <Button
                key={prompt.id}
                variant="outline"
                size="sm"
                className="flex-shrink-0 text-xs whitespace-nowrap"
                onClick={() => handlePresetClick(prompt.question)}
                disabled={isLoading}
              >
                {prompt.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Desktop Sidebar with preset prompts */}
          <div className="hidden lg:block lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {PRESET_PROMPTS.map((prompt) => (
                  <Button
                    key={prompt.id}
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-3 hover:bg-gray-50 hover:border-blue-300"
                    onClick={() => handlePresetClick(prompt.question)}
                    disabled={isLoading}
                  >
                    {prompt.label}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Info card */}
            <Card className="mt-4">
              <CardContent className="pt-4">
                <p className="text-xs text-gray-500">
                  <strong>Tip:</strong> Ask about specific products, time periods, or business concerns. The AI uses your actual sales data to provide grounded insights.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main chat area */}
          <div className="lg:col-span-3">
            <Card className="h-[calc(100vh-280px)] sm:h-[600px] flex flex-col">
              {/* Messages area */}
              <CardContent className="flex-1 p-3 sm:p-4 overflow-y-auto">
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center text-gray-500 px-4">
                      <svg
                        className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400"
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
                      <h3 className="mt-2 text-xs sm:text-sm font-medium text-gray-900">
                        Ready to help
                      </h3>
                      <p className="mt-1 text-xs sm:text-sm text-gray-500">
                        Tap a quick question or type your own
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[90%] sm:max-w-[85%] rounded-lg px-3 py-2 sm:px-4 sm:py-3 ${
                            message.role === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-white border border-gray-200 shadow-sm'
                          }`}
                        >
                          {message.role === 'user' ? (
                            <p className="text-xs sm:text-sm">{message.content as string}</p>
                          ) : (
                            <AIResponseDisplay response={message.content as AIResponse} />
                          )}
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 sm:px-4 sm:py-3 shadow-sm">
                          <LoadingIndicator />
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </CardContent>

              {/* Error display */}
              {error && (
                <div className="px-3 sm:px-4 pb-2">
                  <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-xs sm:text-sm">
                    {error}
                  </div>
                </div>
              )}

              {/* Input area */}
              <div className="border-t p-3 sm:p-4">
                <form onSubmit={handleFormSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask a question..."
                    className="flex-1 rounded-md border border-gray-300 bg-white text-gray-900 px-3 py-2 text-xs sm:text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-gray-400"
                    disabled={isLoading}
                  />
                  <Button type="submit" disabled={isLoading || !input.trim()} className="text-xs sm:text-sm px-3 sm:px-4">
                    {isLoading ? '...' : 'Ask'}
                  </Button>
                </form>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
