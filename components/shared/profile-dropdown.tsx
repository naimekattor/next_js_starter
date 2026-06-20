'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { LogOut, Settings, User as UserIcon, Shield } from 'lucide-react';
import Link from 'next/link';

/**
 * Profile Dropdown Popover Component
 * 
 * WHO SHOULD USE IT: Main Header.
 * WHEN TO MODIFY: Adding extra option tabs (billing, documentation links) or styling dropdown margins.
 */
export default function ProfileDropdown() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const name = session?.user?.name || 'User';
  const email = session?.user?.email || '';
  const role = session?.user?.role || 'user';
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  // Close when clicking outside of the popover panel
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center h-9 w-9 rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400 font-bold text-sm border border-indigo-200/30 hover:ring-2 hover:ring-indigo-500/20 transition-all cursor-pointer"
        aria-label="Profile Menu"
      >
        {initials || <UserIcon className="h-4 w-4" />}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-56 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* User Details */}
          <div className="px-3 py-2.5 border-b border-slate-100 dark:border-slate-800/80 mb-1.5">
            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
              {name}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {email}
            </p>
          </div>

          {/* Settings option */}
          <Link
            href="/settings"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2.5 w-full px-3 py-2 text-sm rounded-xl text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-slate-900 dark:hover:text-slate-100 font-medium transition-colors cursor-pointer"
          >
            <Settings className="h-4 w-4 text-slate-400" />
            Account Settings
          </Link>

          {/* Admin panel notice */}
          {role === 'admin' && (
            <Link
              href="/admin/users"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 w-full px-3 py-2 text-sm rounded-xl text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-slate-900 dark:hover:text-slate-100 font-medium transition-colors cursor-pointer"
            >
              <Shield className="h-4 w-4 text-indigo-500" />
              Admin Center
            </Link>
          )}

          {/* Logout option */}
          <button
            onClick={() => signOut({ callbackUrl: '/auth/login' })}
            className="flex items-center gap-2.5 w-full px-3 py-2 text-sm rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 dark:text-rose-400 font-medium transition-colors border-t border-slate-100 dark:border-slate-800/80 mt-1.5 pt-2 cursor-pointer"
          >
            <LogOut className="h-4 w-4 text-rose-455" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
