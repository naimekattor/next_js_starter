'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { userService } from '@/lib/api/user.service';
import { useAppDispatch } from '@/store/hooks';
import { addToast } from '@/store/slices/notificationSlice';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Save, User, Bell, Moon, Sun, Lock } from 'lucide-react';
import { useTheme } from 'next-themes';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  email: z.string().email('Please enter a valid email address'),
});

type ProfileSchema = z.infer<typeof profileSchema>;

/**
 * Account Settings Page Component
 * 
 * WHO SHOULD USE IT: Authenticated dashboard users editing personal configurations.
 * WHEN TO MODIFY: Adding support for extra profile attributes, security password forms, or third-party linkages.
 */
export default function SettingsPage() {
  const { data: session, update } = useSession();
  const dispatch = useAppDispatch();
  const { theme, setTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security'>('profile');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
  });

  // Hydrate fields once user session is loaded
  useEffect(() => {
    if (session?.user) {
      reset({
        name: session.user.name || '',
        email: session.user.email || '',
      });
    }
  }, [session, reset]);

  const onSubmit = async (data: ProfileSchema) => {
    setIsLoading(true);
    try {
      await userService.updateProfile(data.name, data.email);
      
      // Update local Client Session context
      await update({
        name: data.name,
        email: data.email,
      });

      dispatch(
        addToast({
          type: 'success',
          title: 'Profile Updated',
          description: 'Your settings have been saved successfully.',
        })
      );
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : (err as { message?: string })?.message || 'An error occurred while saving details.';
      dispatch(
        addToast({
          type: 'error',
          title: 'Update Failed',
          description: errMsg,
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Settings</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Manage your account profile configurations, theme modes, and notification rules.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Navigation Sidebar Tabs */}
        <Card className="w-full md:w-64 shrink-0 p-2 space-y-1">
          {[
            { id: 'profile', name: 'Profile Settings', icon: User },
            { id: 'notifications', name: 'Notifications', icon: Bell },
            { id: 'security', name: 'Security', icon: Lock },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'profile' | 'notifications' | 'security')}
                className={`flex items-center gap-2.5 w-full px-3 py-2 text-sm font-semibold rounded-xl text-left transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400'
                    : 'text-slate-655 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'
                }`}
              >
                <Icon className={`h-4.5 w-4.5 ${isSelected ? 'text-indigo-650' : 'text-slate-400'}`} />
                {tab.name}
              </button>
            );
          })}
        </Card>

        {/* Content panel */}
        <div className="flex-1 w-full space-y-6">
          {activeTab === 'profile' && (
            <Card>
              <CardHeader>
                <CardTitle>Profile Details</CardTitle>
                <CardDescription>Update your personal dashboard identity information.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      placeholder="Jane Doe"
                      error={errors.name?.message}
                      {...register('name')}
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="you@example.com"
                      error={errors.email?.message}
                      {...register('email')}
                    />
                  </div>

                  <div className="pt-2">
                    <Button type="submit" isLoading={isLoading}>
                      Save Changes <Save className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Customize when and how you receive alerts.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { title: 'Security Alerts', desc: 'Critical login warnings and password recovery links.' },
                  { title: 'Feature Updates', desc: 'Alerts detailing startup template releases and system changes.' },
                  { title: 'System Audits', desc: 'Periodic check summaries mapping environment status variables.' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80">
                    <div className="space-y-0.5 pr-4">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
                    </div>
                    {/* Simplified mock switch indicator */}
                    <div className="h-6 w-11 rounded-full bg-indigo-600 dark:bg-indigo-500 p-0.5 flex items-center justify-end cursor-pointer">
                      <div className="h-5 w-5 rounded-full bg-white shadow-sm"></div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Configure credentials secrets and session rules.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Theme Selector settings area */}
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/20 dark:bg-slate-900/10">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Interface Theme</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Toggle light or dark theme values.</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    {theme === 'dark' ? (
                      <>
                        <Sun className="h-4 w-4 text-amber-500" /> Light Theme
                      </>
                    ) : (
                      <>
                        <Moon className="h-4 w-4 text-indigo-500" /> Dark Theme
                      </>
                    )}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Active Sessions</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Invalidate active session tokens remotely.</p>
                  </div>
                  <Button variant="danger" size="sm" onClick={() => dispatch(addToast({ type: 'warning', title: 'Action Simulated', description: 'Active sessions logs successfully refreshed.' }))}>
                    Revoke Sessions
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
