'use client';

import { Navigation } from '@/components/shared/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ProductPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-900">Product Overview</h1>
          <p className="mt-3 text-lg text-gray-600">
            A mini PRD for TillIQ
          </p>
        </div>

        <div className="space-y-8">
          {/* What is TillIQ */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <span className="text-2xl">1.</span> What is TillIQ?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                TillIQ is an AI-powered insights dashboard designed to help small online sellers
                quickly understand performance trends, ask natural-language questions about their
                store, and make faster decisions without digging through raw analytics.
              </p>
            </CardContent>
          </Card>

          {/* Target Users */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <span className="text-2xl">2.</span> Target Users
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Primary User</h3>
                <p className="text-gray-700">Solo or small-team online sellers (Shopify / Etsy / Square-style)</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Pain Points</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-gray-700">
                    <span className="text-red-500 mt-1">&#x2022;</span>
                    Data is fragmented and overwhelming
                  </li>
                  <li className="flex items-start gap-2 text-gray-700">
                    <span className="text-red-500 mt-1">&#x2022;</span>
                    Analytics tools answer <em>what</em>, not <em>why</em>
                  </li>
                  <li className="flex items-start gap-2 text-gray-700">
                    <span className="text-red-500 mt-1">&#x2022;</span>
                    Sellers don&apos;t know what question to ask, let alone how to query data
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Core Problem */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <span className="text-2xl">3.</span> The Core Problem
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                Sellers don&apos;t need more charts &mdash; they need clarity. Existing tools assume users
                already know what they&apos;re looking for. TillIQ flips that by letting sellers ask
                questions in plain language and receive actionable summaries.
              </p>
            </CardContent>
          </Card>

          {/* How AI is Used */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <span className="text-2xl">4.</span> How AI is Used
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4 text-sm">Plain English, no buzzwords.</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-gray-700">
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200 shrink-0">NLP</Badge>
                  <span>Translate natural-language questions into structured queries</span>
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <Badge className="bg-green-100 text-green-800 border-green-200 shrink-0">Summary</Badge>
                  <span>Summarize trends into actionable insights</span>
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <Badge className="bg-purple-100 text-purple-800 border-purple-200 shrink-0">Detection</Badge>
                  <span>Surface anomalies a seller might not notice on their own</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Multilingual Support */}
          <Card className="border-green-100">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <span className="text-2xl">5.</span> Multilingual Support
                <Badge className="bg-green-100 text-green-800 border-green-200 ml-2">Live Feature</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                &quot;Ask Your Shop&quot; supports queries in <strong>English, Spanish, Portuguese (Brazil), and French</strong>.
                This isn&apos;t just translation &mdash; it&apos;s accessibility for the millions of small business owners
                who think, plan, and make decisions in their native language.
              </p>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-2">Why this matters for small businesses:</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">&#x2713;</span>
                    <span><strong>40% of US small businesses</strong> are owned by immigrants, many of whom prefer their native language for complex decisions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">&#x2713;</span>
                    <span><strong>Reduces cognitive load</strong> &mdash; understanding financial insights is hard enough without a language barrier</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">&#x2713;</span>
                    <span><strong>Expands market reach</strong> &mdash; Spanish alone opens access to 500M+ speakers globally</span>
                  </li>
                </ul>
              </div>

              <div className="text-sm text-gray-600">
                <strong>Design choice:</strong> Numbers and currencies remain in standard format across all languages
                to avoid confusion. Full dashboard localization is a future expansion &mdash; we started with the
                highest-leverage surface: the conversational AI.
              </div>
            </CardContent>
          </Card>

          {/* Product Decisions & Tradeoffs */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <span className="text-2xl">6.</span> Product Decisions &amp; Tradeoffs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-l-4 border-square-blue pl-4">
                <h3 className="font-semibold text-gray-900">Dashboard over chat-only interface</h3>
                <p className="text-gray-600 text-sm mt-1">
                  A dashboard provides at-a-glance value without requiring the user to know what to ask.
                  The chat feature complements this for deeper exploration.
                </p>
              </div>
              <div className="border-l-4 border-square-blue pl-4">
                <h3 className="font-semibold text-gray-900">Summaries over raw predictions</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Raw AI predictions can erode trust if they&apos;re wrong. Summaries frame insights as
                  observations, keeping the human in control of decisions.
                </p>
              </div>
              <div className="border-l-4 border-square-blue pl-4">
                <h3 className="font-semibold text-gray-900">Scoped features over &quot;everything&quot;</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Focused on three core capabilities: dashboard overview, natural-language Q&amp;A, and
                  report generation. Each solves a real pain point without scope creep.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* What's Next */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <span className="text-2xl">7.</span> What I&apos;d Build Next
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-gray-700">
                  <span className="text-square-blue font-bold">&#8594;</span>
                  <div>
                    <span className="font-medium">Alerts for abnormal sales drops</span>
                    <p className="text-sm text-gray-500">Proactive notifications when something needs attention</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <span className="text-square-blue font-bold">&#8594;</span>
                  <div>
                    <span className="font-medium">Per-product AI explanations</span>
                    <p className="text-sm text-gray-500">Drill down into why a specific product is performing a certain way</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <span className="text-square-blue font-bold">&#8594;</span>
                  <div>
                    <span className="font-medium">Merchant-specific recommendations</span>
                    <p className="text-sm text-gray-500">Personalized suggestions based on the seller&apos;s unique patterns</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* What I Learned */}
          <Card className="border-2 border-square-blue/20 bg-blue-50/30">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <span className="text-2xl">8.</span> What I Learned
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                Building TillIQ taught me how hard it is to balance transparency with simplicity
                when using AI in product experiences. It reinforced the importance of designing
                AI features around user trust, not novelty.
              </p>
            </CardContent>
          </Card>

          {/* Demo Note */}
          <div className="text-center text-sm text-gray-500 py-4">
            <p>This is a demonstration application. All data is synthetically generated.</p>
            <p className="mt-1">Built for a PM position application at Square.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
