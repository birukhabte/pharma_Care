'use client';

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-30
          transform transition-transform duration-300
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      </div>

      {/* Main content */}
      <div
        className={`
          flex-1 flex flex-col min-w-0 transition-all duration-300
          ${collapsed ? 'lg:ml-16' : 'lg:ml-60'}
        `}
      >
        <Topbar
          onMobileMenuToggle={() => setMobileOpen(!mobileOpen)}
          mobileMenuOpen={mobileOpen}
        />
        <main className="flex-1 overflow-auto bg-slate-50">
          <div className="max-w-screen-2xl mx-auto px-4 lg:px-6 xl:px-8 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}