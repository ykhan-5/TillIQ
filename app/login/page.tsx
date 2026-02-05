'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { APP_CONFIG } from '@/lib/utils/constants';

export default function LoginPage() {
  const router = useRouter();

  const handleDemoLogin = () => {
    // Simple demo login - just set a flag and redirect
    if (typeof window !== 'undefined') {
      localStorage.setItem('demo_logged_in', 'true');
      router.push('/dashboard');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-square-blue to-square-blue-dark px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-square-blue text-white">
              <svg
                className="h-8 w-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">{APP_CONFIG.NAME}</CardTitle>
          <CardDescription className="mt-2 text-base">
            {APP_CONFIG.TAGLINE}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleDemoLogin}
            className="w-full h-12 text-base"
          >
            Log in as Demo Seller
          </Button>
          <p className="text-center text-xs text-gray-500">
            This is a demo application with synthetic data
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
