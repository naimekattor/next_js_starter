'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authService } from '@/lib/api/auth.service';
import { useAppDispatch } from '@/store/hooks';
import { addToast } from '@/store/slices/notificationSlice';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Shield, KeyRound, ArrowLeft, MailCheck } from 'lucide-react';

const forgotSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotSchema = z.infer<typeof forgotSchema>;

/**
 * Forgot Password Page Component
 * 
 * WHO SHOULD USE IT: Users who forgot their password credentials.
 * WHEN TO MODIFY: Customizing success messages, adding rate limiting limits, or integrating validation captchas.
 */
export default function ForgotPasswordPage() {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [emailRequested, setEmailRequested] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotSchema>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotSchema) => {
    setIsLoading(true);
    setEmailRequested(data.email);
    try {
      const response = await authService.forgotPassword(data.email);
      dispatch(
        addToast({
          type: 'success',
          title: 'Reset Link Dispatched',
          description: response.message,
        })
      );
      setIsSubmitted(true);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : (err as { message?: string })?.message || 'An error occurred while dispatching the reset link.';
      dispatch(
        addToast({
          type: 'error',
          title: 'Request Failed',
          description: errMsg,
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 transition-all duration-300">
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
            Recover access to your account
          </p>
        </div>

        <Card className="border-slate-200/60 dark:border-slate-800/80 shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight">Recover Password</CardTitle>
            <CardDescription>
              {!isSubmitted
                ? "Enter your account email to receive a password reset link."
                : "Reset link dispatched."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isSubmitted ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="you@example.com"
                  error={errors.email?.message}
                  {...register('email')}
                />

                <Button type="submit" className="w-full" isLoading={isLoading}>
                  Send Recover Link <KeyRound className="ml-2 h-4 w-4" />
                </Button>
              </form>
            ) : (
              <div className="flex flex-col items-center py-6 text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <MailCheck className="h-8 w-8 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-lg">Check Your Email</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">
                    We have sent a secure password reset link to <strong className="text-slate-900 dark:text-slate-100">{emailRequested}</strong>.
                  </p>
                </div>
                <div className="pt-2 text-xs text-slate-400 dark:text-slate-500">
                  Didn&apos;t receive it? Check your spam folder or try again in a few minutes.
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="justify-center border-t border-slate-105 dark:border-slate-800/50 mt-4">
            <Link
              href="/auth/login"
              className="inline-flex items-center text-sm font-semibold text-indigo-650 hover:underline dark:text-indigo-400 cursor-pointer"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
