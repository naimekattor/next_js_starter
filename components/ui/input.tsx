import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

/**
 * Reusable Form Input Component
 * 
 * WHO SHOULD USE IT: Form templates.
 * WHEN TO MODIFY: Adding support for inline icons, custom prefixes/suffixes, or modifying standard borders.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            'flex h-10 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 ring-offset-white placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:placeholder:text-slate-600 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/25 transition-all duration-150',
            error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/25 dark:border-rose-500 dark:focus:border-rose-500',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <span className="text-xs text-rose-600 dark:text-rose-400 font-medium">
            {error}
          </span>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';
