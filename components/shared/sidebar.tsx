'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useAppSelector } from '@/store/hooks';
import { selectSidebarOpen } from '@/store/slices/uiSlice';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Settings, 
  Users, 
  ShieldCheck
} from 'lucide-react';

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean;
}

const sidebarItems: SidebarItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
  },
  {
    name: 'User Directory',
    href: '/admin/users',
    icon: Users,
    adminOnly: true,
  },
];

/**
 * Collapsible Navigation Sidebar Component
 * 
 * WHO SHOULD USE IT: Private Layout shell container.
 * WHEN TO MODIFY: Adding new menu paths, modifying active link highlights, or altering width dimensions.
 */
export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const sidebarOpen = useAppSelector(selectSidebarOpen);

  const userRole = session?.user?.role || 'user';

  // Filter items based on active user role (RBAC)
  const filteredItems = sidebarItems.filter(
    (item) => !item.adminOnly || userRole === 'admin'
  );

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 z-20 shrink-0 h-screen sticky top-0',
        sidebarOpen ? 'w-64' : 'w-20'
      )}
    >
      {/* Brand area */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-100 dark:border-slate-800/80">
        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white flex-shrink-0">
          <ShieldCheck className="h-5 w-5" />
        </div>
        {sidebarOpen && (
          <span className="font-extrabold text-slate-900 dark:text-white tracking-tight truncate">
            SaaS Dashboard
          </span>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
        {filteredItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 group cursor-pointer',
                isActive
                  ? 'bg-primary/10 text-primary dark:bg-primary/5 dark:text-primary'
                  : 'text-slate-600 dark:text-slate-450 hover:bg-slate-50 dark:hover:bg-slate-850/50 hover:text-slate-900 dark:hover:text-slate-100'
              )}
            >
              <Icon
                className={cn(
                  'h-5 w-5 flex-shrink-0 transition-transform group-hover:scale-105',
                  isActive ? 'text-primary' : 'text-slate-400 dark:text-slate-500'
                )}
              />
              {sidebarOpen && <span className="truncate">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer Role Display */}
      {sidebarOpen && (
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2 text-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-slate-500 dark:text-slate-400 font-semibold">Active Role:</span>
            <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 uppercase font-bold tracking-wider scale-90">
              {userRole}
            </span>
          </div>
        </div>
      )}
    </aside>
  );
}
