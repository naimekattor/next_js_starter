'use client';

import React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

/**
 * next-themes Custom wrapper for Tailwind v4 compatibility
 * 
 * WHO SHOULD USE IT: App layout wrappers.
 * WHEN TO MODIFY: Customizing default themes, forcing dark mode exclusively, or disabling system preferences.
 */
export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider 
      attribute="class" 
      defaultTheme="dark" 
      enableSystem={false}
    >
      {children}
    </NextThemesProvider>
  );
}
