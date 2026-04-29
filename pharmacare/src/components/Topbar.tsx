'use client';

import React, { useState, useEffect, memo } from 'react';
import { Bell, Search, Menu, X, ChevronDown, LogOut, AlertCircle, AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

interface TopbarProps {
  onMobileMenuToggle?: () => void;
  mobileMenuOpen?: boolean;
}

interface Notification {
  _id: string;
  type: 'info' | 'warning' | 'alert' | 'success' | 'error' | 'urgent';
  category: string;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
}

const Topbar = memo(function Topbar({ onMobileMenuToggle, mobileMenuOpen }: TopbarProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Load user data on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
  }, []);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await api.getNotifications({ limit: 10 });
      setNotifications(response.notifications || []);
      setUnreadCount(response.unreadCount || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch notifications on mount and when notification panel opens
  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 10 seconds
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  // Also fetch when notification panel opens
  useEffect(() => {
    if (notifOpen) {
      fetchNotifications();
    }
  }, [notifOpen]);

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      await api.markNotificationAsRead(notificationId);
      setNotifications(prev =>
        prev.map(n => n._id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      await api.markAllNotificationsAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification._id);
    }
    if (notification.link) {
      router.push(notification.link);
      setNotifOpen(false);
    }
  };

  // Get notification icon based on type
  const getNotificationIcon = (type: string, priority: string) => {
    const iconClass = priority === 'urgent' ? 'text-red-600' : 
                      type === 'error' ? 'text-red-500' :
                      type === 'warning' ? 'text-amber-500' :
                      type === 'success' ? 'text-green-500' :
                      'text-teal-500';
    
    if (type === 'urgent' || type === 'error') return <XCircle size={16} className={iconClass} />;
    if (type === 'warning') return <AlertTriangle size={16} className={iconClass} />;
    if (type === 'success') return <CheckCircle size={16} className={iconClass} />;
    return <Info size={16} className={iconClass} />;
  };

  // Get time ago string
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  // Get priority badge color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-700';
      case 'high': return 'bg-orange-100 text-orange-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-blue-100 text-blue-700';
    }
  };

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

      {/* PharmaCare Text */}
      <div className="hidden md:block">
        <span className="text-lg font-bold text-white tracking-tight">PharmaCare</span>
      </div>

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
              <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setNotifOpen(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-96 bg-white border border-slate-200 rounded-xl shadow-modal animate-fade-in z-50">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                  <h3 className="text-sm font-semibold text-slate-800">Notifications</h3>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <>
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                          {unreadCount} new
                        </span>
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-teal-600 hover:text-teal-700 font-medium"
                        >
                          Mark all read
                        </button>
                      </>
                    )}
                    <button
                      onClick={fetchNotifications}
                      className="p-1 hover:bg-slate-100 rounded transition-colors"
                      title="Refresh notifications"
                    >
                      <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                {loading ? (
                  <div className="px-4 py-8 text-center text-slate-500 text-sm">
                    Loading notifications...
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-slate-500 text-sm">
                    No notifications yet
                  </div>
                ) : (
                  <ul className="divide-y divide-slate-50 max-h-96 overflow-y-auto scrollbar-thin">
                    {notifications.map((n) => (
                      <li
                        key={n._id}
                        onClick={() => handleNotificationClick(n)}
                        className={`px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors ${
                          !n.read ? 'bg-teal-50/40' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">
                            {getNotificationIcon(n.type, n.priority)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <p className="text-xs font-semibold text-slate-800">{n.title}</p>
                              {n.priority === 'urgent' && (
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${getPriorityColor(n.priority)}`}>
                                  URGENT
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed mb-1">{n.message}</p>
                            <div className="flex items-center justify-between">
                              <p className="text-xs text-slate-400">{getTimeAgo(n.createdAt)}</p>
                              <span className="text-[10px] text-slate-400 uppercase">{n.category}</span>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                
                <div className="px-4 py-2.5 border-t border-slate-100 text-center">
                  <button 
                    onClick={() => {
                      router.push('/notifications');
                      setNotifOpen(false);
                    }}
                    className="text-xs text-teal-600 font-medium hover:text-teal-700 transition-colors"
                  >
                    View all notifications
                  </button>
                </div>
              </div>
            </>
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
