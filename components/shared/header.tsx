'use client';

import React from 'react';
import { useAppDispatch } from '@/store/hooks';
import { toggleSidebar } from '@/store/slices/uiSlice';
import { Menu, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import Breadcrumbs from './breadcrumbs';
import ProfileDropdown from './profile-dropdown';
import NotificationsDropdown from './notifications-dropdown';

/**
 * Main Shell Top Header Toolbar
 * 
 * WHO SHOULD USE IT: Private Layout shell container.
 * WHEN TO MODIFY: Adding support for search bars, layout quick-options, or customizing height.
 */
export default function Header() {
  const dispatch = useAppDispatch();
  const { theme, setTheme } = useTheme();

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 backdrop-blur-md flex items-center justify-between px-6 z-10 sticky top-0">
      <div className="flex items-center gap-4">
        {/* Toggle Collapse Sidebar button */}
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-350 cursor-pointer transition-colors"
          aria-label="Toggle Sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        
        {/* Dynamic Breadcrumbs */}
        <Breadcrumbs />
      </div>

      <div className="flex items-center gap-3">
        {/* Quick Dark/Light Theme Selector */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-350 cursor-pointer transition-colors"
          aria-label="Toggle Theme Mode"
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>
        
        {/* Alerts Center Dropdown */}
        <NotificationsDropdown />
        
        {/* Profile Card Trigger */}
        <ProfileDropdown />
      </div>
    </header>
  );
}
