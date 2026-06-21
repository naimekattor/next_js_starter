'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { 
  Sparkles, 
  Users, 
  Key, 
  Activity, 
  TrendingUp,
  Clock
} from 'lucide-react';

interface MetricCard {
  title: string;
  value: string;
  change: string;
  changeType: 'up' | 'down' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const metrics: MetricCard[] = [
  {
    title: 'Total Active Users',
    value: '1,482',
    change: '+12.3% vs last week',
    changeType: 'up',
    icon: Users,
    color: 'text-primary dark:text-primary bg-primary/10 dark:bg-primary/5 border border-primary/20',
  },
  {
    title: 'Active Sessions',
    value: '298',
    change: '+4.5% vs yesterday',
    changeType: 'up',
    icon: Key,
    color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/20',
  },
  {
    title: 'API Request Rate',
    value: '94.2%',
    change: '-0.8% load change',
    changeType: 'down',
    icon: Activity,
    color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/20',
  },
];

/**
 * Main Dashboard Home View Component
 * 
 * WHO SHOULD USE IT: Logged-in dashboard users.
 * WHEN TO MODIFY: Adding analytical charts, custom quick-action widgets, or modifying statistical indicators.
 */
export default function DashboardPage() {
  const { data: session } = useSession();
  const name = session?.user?.name || 'Developer';
  const role = session?.user?.role || 'user';

  return (
    <div className="space-y-6">
      {/* Welcome Banner Panel */}
      <div className="p-6 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary to-accent/95 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl shadow-primary/10">
        <div className="space-y-1">
          <h2 className="text-xl md:text-2xl font-black tracking-tight flex items-center gap-2">
            Welcome back, {name}! <Sparkles className="h-5 w-5 text-amber-300 animate-pulse" />
          </h2>
          <p className="text-xs md:text-sm text-slate-100 dark:text-slate-350 opacity-90 max-w-xl">
            This workspace represents a production-ready starter kit. Realize client features instantly by binding services to your backend.
          </p>
        </div>
        <div className="shrink-0 flex items-center">
          <span className="px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md text-xs font-bold uppercase tracking-wider border border-white/10">
            Role: {role}
          </span>
        </div>
      </div>

      {/* Metrics Row Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Card key={idx} className="hover:shadow-md transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-bold text-slate-500 dark:text-slate-400">
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-xl ${card.color}`}>
                  <Icon className="h-4.5 w-4.5" />
                </div>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {card.value}
                </div>
                <div className="flex items-center gap-1.5">
                  <TrendingUp className={`h-3.5 w-3.5 ${
                    card.changeType === 'up' ? 'text-emerald-500' : 'text-amber-500'
                  }`} />
                  <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                    {card.change}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Layout Info Widget Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Core System Checks</CardTitle>
            <CardDescription>Configurations compiled at application boot</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {[
                { label: 'NextAuth Session Handler', desc: 'Stateless JSON Web Token (JWT) strategies matching Next.js 16 conventions.', status: 'Active' },
                { label: 'Axios API Request Interceptors', desc: 'Secure token injections matching active user login contexts.', status: 'Active' },
                { label: 'Redux Toolkit Store', desc: 'Global context hooks linking UI state states seamlessly.', status: 'Active' },
                { label: 'Route Access Middleware', desc: 'Client interceptors protecting user paths and private folders.', status: 'Active' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start justify-between p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/20 dark:bg-slate-900/10">
                  <div className="space-y-0.5 max-w-[80%]">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{item.label}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Project Activity</CardTitle>
            <CardDescription>Local logs log files</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative border-l border-slate-200 dark:border-slate-800 pl-4 ml-2 space-y-5">
              {[
                { time: 'Just now', title: 'Axios response interceptor ready', desc: 'Setup automated Token Refresh processes.' },
                { time: '10 mins ago', title: 'Session extended', desc: 'NextAuth tokens synced with Redux auth slice.' },
                { time: '1 hour ago', title: 'Theme changed', desc: 'Preserved setting: defaultTheme="dark".' },
              ].map((log, idx) => (
                <div key={idx} className="relative">
                  {/* Timeline bullet dot */}
                  <span className="absolute -left-6.5 top-1.5 h-3 w-3 rounded-full bg-primary border-2 border-white dark:border-slate-950"></span>
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {log.time}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{log.title}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{log.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
