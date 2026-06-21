import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

/**
 * Reusable Button Component
 * 
 * WHO SHOULD USE IT: Any page or form requiring user submit/action items.
 * WHEN TO MODIFY: Customizing visual theme tokens, padding sizes, or adding dynamic hover shapes.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, disabled, children, ...props }, ref) => {
    const baseStyle =
      'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] cursor-pointer';

    const variants = {
      primary: 'bg-primary text-primary-foreground hover:bg-primary-hover shadow-md shadow-primary/10',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary-foreground/10 dark:hover:bg-secondary-foreground/20',
      outline: 'border border-card-border bg-transparent text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-card/50',
      danger: 'bg-rose-655 text-white hover:bg-rose-700 dark:bg-rose-600 dark:hover:bg-rose-700',
      ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/50',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-5 py-2.5 text-base',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyle, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 auto-spin animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
