'use client';

import React, { useState, useEffect, memo } from 'react';
import { Bell, Search, Menu, X, ChevronDown, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

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

const Topbar = memo(function Topbar({ onMobileMenuToggle, mobileMenuOpen }: TopbarProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Load user data on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
  }, []);

  const handleLogout = () => {
    api.logout();
    router.push('/sign-up-login-screen');
  };

  const getUserInitials = () => {
    if (!user?.fullName) return 'AT';
    return user.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase();
  };

  const getUserName = () => user?.fullName || 'Alemayehu Tadesse';
  const getUserEmail = () => user?.email || 'admin@pharmacare.et';
  const getUserRole = () => user?.role?.replace('_', ' ') || 'Administrator';

  return (
    <header 
      className="h-auto rounded-[20px] flex items-center px-4 lg:px-6 gap-4 sticky top-0 z-20 py-4 ml-4 lg:ml-6"
      style={{ background: 'linear-gradient(135deg, rgb(9, 150, 33) 0%, #0d2b36 100%)' }}
    >
      {/* Mobile menu toggle */}
      <button
        className="lg:hidden p-1.5 rounded-lg hover:bg-emerald-700 transition-colors"
        onClick={onMobileMenuToggle}
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <X size={20} className="text-white" /> : <Menu size={20} className="text-white" />}
      </button>

      {/* Search */}
      <div className="flex-1 max-w-xs">
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white"
          />
          <input
            type="text"
            placeholder="Search medicines, employees..."
            className="w-full pl-9 pr-4 py-2 text-sm border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 transition-all text-white placeholder:text-white/70"
            style={{ background: 'linear-gradient(135deg, rgb(9, 150, 33) 0%, #0d2b36 100%)' }}
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 text-xs text-white/80 bg-emerald-900/50 px-1.5 py-0.5 rounded">
            ⌘K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-lg hover:bg-emerald-700 transition-colors"
            aria-label="Notifications"
          >
            <Bell size={18} className="text-white" />
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
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center">
              <span className="text-xs font-semibold text-emerald-700">
                {getUserInitials()}
              </span>
            </div>
            <span className="hidden md:block text-sm font-medium text-white">
              {getUserName()}
            </span>
            <ChevronDown size={14} className="hidden md:block text-white" />
          </button>

          {/* Profile dropdown */}
          {profileOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setProfileOpen(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-modal z-20 animate-fade-in overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-sm font-semibold text-slate-800">
                    {getUserName()}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {getUserEmail()}
                  </p>
                  <p className="text-xs text-teal-600 font-medium mt-1 capitalize">
                    {getUserRole()}
                  </p>
                </div>
                <div className="p-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={15} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
});

export default Topbar;
// Commit on 2024-06-6 at 16:42
// Commit on 2024-06-8 at 9:41
// Commit on 2024-06-12 at 18:56
// Commit on 2024-06-12 at 9:54
// Commit on 2024-06-21 at 18:24
// Commit on 2024-06-30 at 12:50
