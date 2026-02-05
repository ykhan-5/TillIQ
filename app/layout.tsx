import type { Metadata } from 'next';
import './globals.css';
import { APP_CONFIG } from '@/lib/utils/constants';

export const metadata: Metadata = {
  title: APP_CONFIG.NAME,
  description: APP_CONFIG.TAGLINE,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">{children}</body>
    </html>
  );
}
