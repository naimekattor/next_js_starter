'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

/**
 * Dynamic Breadcrumbs Indicator Component
 * 
 * WHO SHOULD USE IT: Main Header.
 * WHEN TO MODIFY: Adding custom segment overrides (e.g. mapping ID hashes to human-readable strings).
 */
export default function Breadcrumbs() {
  const pathname = usePathname();
  
  if (!pathname || pathname === '/' || pathname === '/dashboard') {
    return null;
  }

  const segments = pathname.split('/').filter(Boolean);

  return (
    <nav 
      className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400"
      aria-label="Breadcrumb"
    >
      <Link 
        href="/dashboard" 
        className="hover:text-slate-900 dark:hover:text-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
      >
        <Home className="h-3.5 w-3.5" />
      </Link>
      
      {segments.map((segment, index) => {
        const href = `/${segments.slice(0, index + 1).join('/')}`;
        const isLast = index === segments.length - 1;
        
        // Clean segment names (e.g., capitalize and replace hyphens with spaces)
        const name = segment
          .replace(/-/g, ' ')
          .replace(/\b\w/g, (char) => char.toUpperCase());

        return (
          <React.Fragment key={href}>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            {isLast ? (
              <span className="text-slate-800 dark:text-slate-250 truncate max-w-[120px] md:max-w-none">
                {name}
              </span>
            ) : (
              <Link 
                href={href} 
                className="hover:text-slate-900 dark:hover:text-slate-200 truncate transition-colors cursor-pointer"
              >
                {name}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
