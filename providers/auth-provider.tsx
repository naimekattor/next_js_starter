'use client';

import React from 'react';
import { SessionProvider } from 'next-auth/react';

/**
 * NextAuth Client Session Provider
 * 
 * WHO SHOULD USE IT: Main layout providers.
 * WHEN TO MODIFY: Customizing refetch intervals or handling session keep-alive rules.
 */
export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
