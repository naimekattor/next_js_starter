import React from 'react';
import Sidebar from '@/components/shared/sidebar';
import Header from '@/components/shared/header';

/**
 * Dashboard Shell Layout Component
 * 
 * WHO SHOULD USE IT: Private pages layout mapping (dashboard, settings, profile, admin).
 * WHEN TO MODIFY: Customizing background layers, adding right sidebar widgets, or editing margins.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Collapsible Left Navigation */}
      <Sidebar />
      
      {/* Core Right Side Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Sticky top toolbar */}
        <Header />
        
        {/* Scrollable page content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 focus:outline-none">
          {children}
        </main>
      </div>
    </div>
  );
}
