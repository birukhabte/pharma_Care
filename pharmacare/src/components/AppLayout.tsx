'use client';

import React, { useState, useCallback } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleToggleCollapse = useCallback(() => {
    setCollapsed(prev => !prev);
  }, []);

  const handleToggleMobile = useCallback(() => {
    setMobileOpen(prev => !prev);
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f7f9] flex">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={handleToggleMobile}
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
        <Sidebar collapsed={collapsed} onToggle={handleToggleCollapse} />
      </div>

      {/* Main content */}
      <div
        className={`
          flex-1 flex flex-col min-w-0 transition-all duration-300
          ${collapsed ? 'lg:ml-16' : 'lg:ml-60'}
        `}
      >
        <Topbar
          onMobileMenuToggle={handleToggleMobile}
          mobileMenuOpen={mobileOpen}
        />
        <main className="flex-1 overflow-auto bg-[#f5f7f9]">
          <div className="max-w-screen-2xl mx-auto px-0 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}