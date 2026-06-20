import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility helper to conditionally merge Tailwind CSS classes safely
 * 
 * WHO SHOULD USE IT: Components using dynamic or optional style classes.
 * WHEN TO MODIFY: Adding support for alternative style frameworks or extra decorators.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
