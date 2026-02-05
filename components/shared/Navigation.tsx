'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { APP_CONFIG } from '@/lib/utils/constants';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/ask', label: 'Ask your Shop' },
  { href: '/reports', label: 'Reports' },
  { href: '/settings', label: 'Settings' },
];

export function Navigation() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            {/* Logo */}
            <div className="flex flex-shrink-0 items-center">
              <Link href="/dashboard" className="text-xl font-bold text-square-blue">
                {APP_CONFIG.NAME}
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="ml-10 flex space-x-8">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium transition-colors',
                    isActive(item.href)
                      ? 'border-square-blue text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* User Info */}
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-square-blue flex items-center justify-center text-white text-sm font-medium">
                DS
              </div>
              <span className="text-sm font-medium text-gray-700">
                {APP_CONFIG.DEMO_USER_NAME}
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
