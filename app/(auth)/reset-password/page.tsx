'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
import { Shield, Check } from 'lucide-react';

const resetSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Be at least 8 characters long')
      .regex(/[A-Z]/, 'Contain at least one uppercase letter')
      .regex(/[a-z]/, 'Contain at least one lowercase letter')
      .regex(/[0-9]/, 'Contain at least one number')
      .regex(/[^a-zA-Z0-9]/, 'Contain at least one special character'),
    confirmPassword: z.string().min(8, 'Confirm password is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ResetSchema = z.infer<typeof resetSchema>;

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || 'mock-reset-token';
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetSchema>({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data: ResetSchema) => {
    setIsLoading(true);
    try {
      await authService.resetPassword(data.password, token);
      dispatch(
        addToast({
          type: 'success',
          title: 'Password Updated',
          description: 'Your password has been successfully updated. Please log in with your new credentials.',
        })
      );
      router.push('/login');
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : (err as { message?: string })?.message || 'An error occurred during password update.';
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
    <Card className="border-slate-200/60 dark:border-slate-800/80 shadow-2xl">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold tracking-tight">New Password</CardTitle>
        <CardDescription>
          Enter and confirm your new secure password credentials below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="New Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />

          <Input
            label="Confirm New Password"
            type="password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Reset Password <Check className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center border-t border-slate-100 dark:border-slate-800/50 mt-4">
        <div className="text-sm text-slate-500">
          Remembered it?{' '}
          <Link
            href="/login"
            className="font-semibold text-primary hover:underline dark:text-primary cursor-pointer"
          >
            Back to Sign In
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}

/**
 * Reset Password Page Entry Wrapper
 * 
 * WHO SHOULD USE IT: Users redirecting from forgot-password links.
 * WHEN TO MODIFY: Customizing fallback loader UI layout.
 */
export default function ResetPasswordPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 transition-all duration-300">
      <div className="w-full max-w-md">
        {/* Brand logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 text-white mb-2">
            <Shield className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Enterprise Starter
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Set your new credentials
          </p>
        </div>

        <Suspense
          fallback={
            <Card className="border-slate-200/60 dark:border-slate-800/80 shadow-2xl p-8 flex flex-col items-center justify-center space-y-4">
              <div className="h-8 w-8 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
              <div className="text-sm text-slate-500">Validating credentials token...</div>
            </Card>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
