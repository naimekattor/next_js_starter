'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bell, Shield, Key, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: 'security' | 'feature' | 'system';
}

const mockNotifications: NotificationItem[] = [
  {
    id: 'n-1',
    title: 'Security policy updated',
    description: 'Automatic session expirations configured to 7 Days.',
    time: '2 hours ago',
    read: false,
    type: 'security',
  },
  {
    id: 'n-2',
    title: 'Welcome to Next.js 16 Starter',
    description: 'Explore the pre-configured Redux slices and API layers.',
    time: '1 day ago',
    read: false,
    type: 'feature',
  },
  {
    id: 'n-3',
    title: 'Environment variables verified',
    description: 'Startup checking parsed all Zod configurations successfully.',
    time: '2 days ago',
    read: true,
    type: 'system',
  },
];

/**
 * Notifications Bell and Dropdown component
 * 
 * WHO SHOULD USE IT: Main Header.
 * WHEN TO MODIFY: Integrating real WebSocket/Push notifications, changing message styling, or adding clear actions.
 */
export default function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [list, setList] = useState<NotificationItem[]>(mockNotifications);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = list.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllRead = () => {
    setList(list.map((n) => ({ ...n, read: true })));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'security':
        return <Shield className="h-4 w-4 text-indigo-500" />;
      case 'feature':
        return <Sparkles className="h-4 w-4 text-amber-500" />;
      default:
        return <Key className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center h-9 w-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer"
        aria-label="View notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-indigo-650 dark:bg-indigo-500 text-[10px] font-black text-white ring-2 ring-white dark:ring-slate-900">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-80 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 dark:border-slate-800/80 mb-2">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Notifications</h4>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold cursor-pointer"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-64 overflow-y-auto space-y-1">
            {list.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                All clear! No notifications.
              </div>
            ) : (
              list.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    'p-2.5 rounded-xl flex items-start gap-3 transition-colors',
                    item.read
                      ? 'bg-transparent opacity-75'
                      : 'bg-indigo-50/30 dark:bg-indigo-950/20'
                  )}
                >
                  <div className="flex-shrink-0 mt-0.5 p-1 rounded bg-slate-100 dark:bg-slate-800">
                    {getIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                      {item.description}
                    </p>
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium block mt-1">
                      {item.time}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
