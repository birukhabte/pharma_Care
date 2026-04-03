'use client';

import React, { useState } from 'react';
import { Bell, Search, Menu, X, ChevronDown } from 'lucide-react';

interface TopbarProps {
  onMobileMenuToggle?: () => void;
  mobileMenuOpen?: boolean;
}

const notifications = [
  {
    id: 'notif-001',
    type: 'warning',
    message: 'Amoxicillin 500mg batch expiring in 12 days',
    time: '10m ago',
    read: false,
  },
  {
    id: 'notif-002',
    type: 'alert',
    message: 'Metformin 850mg stock below reorder level (8 units)',
    time: '42m ago',
    read: false,
  },
  {
    id: 'notif-003',
    type: 'info',
    message: 'Daily sales report for Apr 1 is ready',
    time: '2h ago',
    read: true,
  },
  {
    id: 'notif-004',
    type: 'warning',
    message: 'Atorvastatin 20mg — 3 batches expiring this month',
    time: '5h ago',
    read: true,
  },
];

export default function Topbar({ onMobileMenuToggle, mobileMenuOpen }: TopbarProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center px-4 lg:px-6 gap-4 sticky top-0 z-20">
      {/* Mobile menu toggle */}
      <button
        className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
        onClick={onMobileMenuToggle}
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <X size={20} className="text-slate-600" /> : <Menu size={20} className="text-slate-600" />}
      </button>

      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search medicines, invoices, suppliers..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
            ⌘K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Date */}
        <span className="hidden md:block text-xs text-slate-400 font-mono">
          Thu, Apr 2, 2026
        </span>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Notifications"
          >
            <Bell size={18} className="text-slate-600" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-modal animate-fade-in z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <h3 className="text-sm font-semibold text-slate-800">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <ul className="divide-y divide-slate-50 max-h-72 overflow-y-auto scrollbar-thin">
                {notifications.map((n) => (
                  <li
                    key={n.id}
                    className={`px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors ${
                      !n.read ? 'bg-teal-50/40' : ''
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div
                        className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                          n.type === 'alert' ?'bg-red-500'
                            : n.type === 'warning' ?'bg-amber-500' :'bg-teal-500'
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-700 leading-relaxed">{n.message}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="px-4 py-2.5 border-t border-slate-100 text-center">
                <button className="text-xs text-teal-600 font-medium hover:text-teal-700 transition-colors">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User avatar */}
        <button className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">
          <div className="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center">
            <span className="text-xs font-semibold text-teal-700">
              {typeof window !== 'undefined' && localStorage.getItem('user') 
                ? JSON.parse(localStorage.getItem('user') || '{}').fullName?.split(' ').map((n: string) => n[0]).join('').toUpperCase()
                : 'RP'}
            </span>
          </div>
          <span className="hidden md:block text-sm font-medium text-slate-700">
            {typeof window !== 'undefined' && localStorage.getItem('user')
              ? JSON.parse(localStorage.getItem('user') || '{}').fullName
              : 'Ravi Patel'}
          </span>
          <ChevronDown size={14} className="hidden md:block text-slate-400" />
        </button>
      </div>
    </header>
  );
}