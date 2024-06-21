'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Search, Menu, X, ChevronDown, LogOut, Sun, Moon } from 'lucide-react';
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

export default function Topbar({ onMobileMenuToggle, mobileMenuOpen }: TopbarProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Ensure component is mounted before accessing localStorage
  useEffect(() => {
    setMounted(true);
    
    // Update date and time every second - only on client
    const updateDateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      };
      setCurrentDateTime(now.toLocaleString('en-US', options));
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const applyTheme = React.useCallback((newTheme: 'light' | 'dark') => {
    if (typeof window !== 'undefined') {
      const html = document.documentElement;
      const body = document.body;
      
      if (newTheme === 'dark') {
        html.classList.add('dark');
        body.style.backgroundColor = '#0f172a'; // slate-900
        body.style.color = '#e2e8f0'; // slate-200
        html.style.setProperty('--page-bg', '#0f172a');
      } else {
        html.classList.remove('dark');
        body.style.backgroundColor = '#f8fafc'; // slate-50 - light background
        body.style.color = '#1e293b'; // slate-800 - dark text
        html.style.setProperty('--page-bg', '#f8fafc');
      }
      // Theme applied successfully
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme);
    }
    applyTheme(newTheme);
  };

  // Load user data and theme on client side only
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
      
      // Load theme from localStorage
      const savedTheme = (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
      setTheme(savedTheme);
      applyTheme(savedTheme);
    }
  }, [applyTheme]);

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
    <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center px-4 lg:px-6 gap-4 sticky top-0 z-20 transition-colors duration-200">
      {/* Mobile menu toggle */}
      <button
        className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        onClick={onMobileMenuToggle}
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <X size={20} className="text-slate-600 dark:text-slate-300" /> : <Menu size={20} className="text-slate-600 dark:text-slate-300" />}
      </button>

      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
          />
          <input
            type="text"
            placeholder="Search medicines, invoices, suppliers..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
            ⌘K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Date & Time */}
        {mounted && (
          <span className="hidden md:block text-xs text-slate-400 dark:text-slate-500 font-mono">
            {currentDateTime}
          </span>
        )}

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          aria-label="Toggle theme"
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? (
            <Moon size={18} className="text-slate-600 dark:text-slate-300" />
          ) : (
            <Sun size={18} className="text-slate-600 dark:text-slate-300" />
          )}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            aria-label="Notifications"
          >
            <Bell size={18} className="text-slate-600 dark:text-slate-300" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-modal animate-fade-in z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full font-medium">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <ul className="divide-y divide-slate-50 dark:divide-slate-700 max-h-72 overflow-y-auto scrollbar-thin">
                {notifications.map((n) => (
                  <li
                    key={n.id}
                    className={`px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors ${
                      !n.read ? 'bg-teal-50/40 dark:bg-teal-900/20' : ''
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
                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{n.message}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="px-4 py-2.5 border-t border-slate-100 dark:border-slate-700 text-center">
                <button className="text-xs text-teal-600 dark:text-teal-400 font-medium hover:text-teal-700 dark:hover:text-teal-300 transition-colors">
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
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center">
              <span className="text-xs font-semibold text-teal-700 dark:text-teal-300">
                {getUserInitials()}
              </span>
            </div>
            <span className="hidden md:block text-sm font-medium text-slate-700 dark:text-slate-300">
              {getUserName()}
            </span>
            <ChevronDown size={14} className="hidden md:block text-slate-400 dark:text-slate-500" />
          </button>

          {/* Profile dropdown */}
          {profileOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setProfileOpen(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-modal z-20 animate-fade-in overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {getUserName()}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {getUserEmail()}
                  </p>
                  <p className="text-xs text-teal-600 dark:text-teal-400 font-medium mt-1 capitalize">
                    {getUserRole()}
                  </p>
                </div>
                <div className="p-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
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
}// Commit on 2024-06-6 at 16:42
// Commit on 2024-06-8 at 9:41
// Commit on 2024-06-12 at 18:56
// Commit on 2024-06-12 at 9:54
// Commit on 2024-06-21 at 18:24
