'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signIn } from 'next-auth/react';
import { useAppDispatch } from '@/store/hooks';
import { addToast } from '@/store/slices/notificationSlice';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Shield, ArrowRight, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

type LoginSchema = z.infer<typeof loginSchema>;

/**
 * Login Page Component
 * 
 * WHO SHOULD USE IT: Unauthenticated users.
 * WHEN TO MODIFY: Adding OAuth buttons (Google/Github), multi-factor inputs, or editing layout details.
 */
export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { theme, setTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginSchema) => {
    setIsLoading(true);
    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        dispatch(
          addToast({
            type: 'error',
            title: 'Authentication Failed',
            description: result.error,
          })
        );
      } else {
        dispatch(
          addToast({
            type: 'success',
            title: 'Welcome Back!',
            description: 'Login successful. Redirecting to your dashboard...',
          })
        );
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : (err as { message?: string })?.message || 'An unexpected error occurred.';
      dispatch(
        addToast({
          type: 'error',
          title: 'Error',
          description: errMsg,
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Pre-fill fields helper for rapid testing
  const fillCredentials = (email: string) => {
    setValue('email', email);
    setValue('password', 'password123');
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 transition-all duration-300">
      {/* Theme toggle */}
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="absolute top-4 right-4 p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md text-slate-800 dark:text-slate-200 cursor-pointer"
        aria-label="Toggle Theme"
      >
        {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </button>

      <div className="w-full max-w-md">
        {/* Brand logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="h-12 w-12 rounded-2xl bg-indigo-650 flex items-center justify-center shadow-lg shadow-indigo-600/20 bg-indigo-650 dark:bg-indigo-600 text-white mb-2">
            <Shield className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Enterprise Starter
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Secure client application template
          </p>
        </div>

        <Card className="border-slate-200/60 dark:border-slate-800/80 shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight">Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                error={errors.email?.message}
                {...register('email')}
              />

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Password
                  </span>
                  <Link
                    href="/auth/forgot-password"
                    className="text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  type="password"
                  placeholder="••••••••"
                  error={errors.password?.message}
                  {...register('password')}
                />
              </div>

              <Button type="submit" className="w-full" isLoading={isLoading}>
                Sign In <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <div className="text-center text-sm text-slate-500 dark:text-slate-400">
              Don&apos;t have an account?{' '}
              <Link
                href="/auth/signup"
                className="font-semibold text-indigo-650 hover:underline dark:text-indigo-400"
              >
                Sign up
              </Link>
            </div>

            {/* Mock Accounts Panel */}
            <div className="w-full pt-4 border-t border-slate-100 dark:border-slate-800/50">
              <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 text-center">
                Demo Accounts (Click to Fill)
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fillCredentials('user@example.com')}
                  className="text-xs font-medium cursor-pointer"
                >
                  User Access
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fillCredentials('admin@example.com')}
                  className="text-xs font-medium cursor-pointer"
                >
                  Admin Access
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
