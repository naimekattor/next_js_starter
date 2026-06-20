'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectToasts, removeToast, ToastMessage } from '@/store/slices/notificationSlice';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';

/**
 * Global Toast Container Component
 * 
 * WHO SHOULD USE IT: Main Layout.
 * WHEN TO MODIFY: Customizing positions, animations, or styling of toasts.
 */
export default function ToastContainer() {
  const toasts = useAppSelector(selectToasts);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}

function ToastItem({ toast }: { toast: ToastMessage }) {
  const dispatch = useAppDispatch();
  const { id, type, title, description, duration } = toast;

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(removeToast(id));
    }, duration || 5000);
    return () => clearTimeout(timer);
  }, [id, duration, dispatch]);

  const icons = {
    success: <CheckCircle className="h-5 w-5 text-emerald-400" />,
    error: <AlertCircle className="h-5 w-5 text-rose-400" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-400" />,
    info: <Info className="h-5 w-5 text-sky-400" />,
  };

  const bgClasses = {
    success: 'bg-emerald-950/80 border-emerald-800 text-emerald-100 dark:bg-emerald-950/85 dark:border-emerald-900',
    error: 'bg-rose-950/80 border-rose-800 text-rose-100 dark:bg-rose-950/85 dark:border-rose-900',
    warning: 'bg-amber-950/80 border-amber-800 text-amber-100 dark:bg-amber-950/85 dark:border-amber-900',
    info: 'bg-sky-950/80 border-sky-800 text-sky-100 dark:bg-sky-950/85 dark:border-sky-900',
  };

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-2xl transition-all duration-300 transform translate-y-0 ${bgClasses[type as 'success' | 'error' | 'warning' | 'info']}`}
    >
      <div className="flex-shrink-0 mt-0.5">
        {icons[type as 'success' | 'error' | 'warning' | 'info']}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm leading-5">{title}</h4>
        {description && (
          <p className="mt-1 text-xs opacity-80 leading-4">{description}</p>
        )}
      </div>
      <button
        onClick={() => dispatch(removeToast(id))}
        className="flex-shrink-0 ml-4 hover:opacity-100 opacity-60 text-current transition-opacity cursor-pointer"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
