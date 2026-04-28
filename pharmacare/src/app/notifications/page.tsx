'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Filter, CheckCheck, Trash2, AlertCircle, AlertTriangle, Info, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

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

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [stats, setStats] = useState<any>({});

  useEffect(() => {
    fetchNotifications();
  }, [filter, categoryFilter, priorityFilter]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const params: any = { limit: 100 };
      if (filter === 'unread') params.read = false;
      if (categoryFilter !== 'all') params.category = categoryFilter;
      if (priorityFilter !== 'all') params.priority = priorityFilter;

      const response = await api.getNotifications(params);
      setNotifications(response.notifications || []);
      setStats({
        unreadCount: response.unreadCount || 0,
        categoryCounts: response.categoryCounts || {},
        priorityCounts: response.priorityCounts || {}
      });
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await api.markNotificationAsRead(id);
      setNotifications(prev =>
        prev.map(n => n._id === id ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.markAllNotificationsAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setStats((prev: any) => ({ ...prev, unreadCount: 0 }));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await api.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n._id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getNotificationIcon = (type: string, priority: string) => {
    const iconClass = priority === 'urgent' ? 'text-red-600' : 
                      type === 'error' ? 'text-red-500' :
                      type === 'warning' ? 'text-amber-500' :
                      type === 'success' ? 'text-green-500' :
                      'text-teal-500';
    
    if (type === 'urgent' || type === 'error') return <XCircle size={20} className={iconClass} />;
    if (type === 'warning') return <AlertTriangle size={20} className={iconClass} />;
    if (type === 'success') return <CheckCircle size={20} className={iconClass} />;
    return <Info size={20} className={iconClass} />;
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      urgent: 'bg-red-100 text-red-700 border-red-200',
      high: 'bg-orange-100 text-orange-700 border-orange-200',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      low: 'bg-blue-100 text-blue-700 border-blue-200'
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const getCategoryBadge = (category: string) => {
    const colors = {
      inventory: 'bg-purple-100 text-purple-700',
      expiry: 'bg-red-100 text-red-700',
      purchase: 'bg-blue-100 text-blue-700',
      sales: 'bg-green-100 text-green-700',
      user: 'bg-indigo-100 text-indigo-700',
      payment: 'bg-emerald-100 text-emerald-700',
      system: 'bg-gray-100 text-gray-700',
      security: 'bg-red-100 text-red-700',
      return: 'bg-orange-100 text-orange-700'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={24} className="text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Bell size={28} className="text-teal-600" />
              Notifications
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {stats.unreadCount > 0 ? `${stats.unreadCount} unread notification${stats.unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
            </p>
          </div>
        </div>
        {stats.unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            <CheckCheck size={18} />
            Mark All Read
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-slate-500" />
            <span className="text-sm font-medium text-slate-700">Filters:</span>
          </div>
          
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'unread')}
            className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Notifications</option>
            <option value="unread">Unread Only</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Categories</option>
            <option value="inventory">Inventory</option>
            <option value="expiry">Expiry</option>
            <option value="purchase">Purchase</option>
            <option value="sales">Sales</option>
            <option value="user">User</option>
            <option value="payment">Payment</option>
            <option value="system">System</option>
            <option value="security">Security</option>
            <option value="return">Return</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center">
            <Bell size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500">No notifications found</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`p-4 hover:bg-slate-50 transition-colors ${
                  !notification.read ? 'bg-teal-50/30' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    {getNotificationIcon(notification.type, notification.priority)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="text-sm font-semibold text-slate-800">
                        {notification.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium border ${getPriorityBadge(notification.priority)}`}>
                          {notification.priority.toUpperCase()}
                        </span>
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification._id)}
                            className="text-teal-600 hover:text-teal-700 p-1"
                            title="Mark as read"
                          >
                            <CheckCheck size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification._id)}
                          className="text-red-500 hover:text-red-600 p-1"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-sm text-slate-600 mb-2">
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className={`px-2 py-0.5 rounded-full ${getCategoryBadge(notification.category)}`}>
                        {notification.category}
                      </span>
                      <span>{getTimeAgo(notification.createdAt)}</span>
                      {notification.link && (
                        <a
                          href={notification.link}
                          className="text-teal-600 hover:text-teal-700 font-medium"
                        >
                          View Details →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
