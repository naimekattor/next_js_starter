'use client';

import React from 'react';
import ReduxProvider from './redux-provider';
import AuthProvider from './auth-provider';
import ThemeProvider from './theme-provider';

/**
 * Consolidated Application Providers Wrapper
 * 
 * WHO SHOULD USE IT: App layout wrappers.
 * WHEN TO MODIFY: Adding global contexts (e.g. QueryClient, React Router wrappers, Modal providers).
 */
export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ReduxProvider>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </ReduxProvider>
    </AuthProvider>
  );
}
