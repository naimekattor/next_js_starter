'use client';

import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { makeStore } from '@/store/store';

/**
 * Redux Store Provider Wrapper
 * 
 * WHO SHOULD USE IT: Top-level layouts wrapping children in Redux state.
 * WHEN TO MODIFY: Not necessary unless injecting additional root middlewares at runtime.
 */
export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  // Lazily initialize the store instance inside state to avoid render-ref violations in React 19
  const [store] = useState(() => makeStore());

  return <Provider store={store}>{children}</Provider>;
}
