'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import DashboardMetrics from './components/DashboardMetrics';
import RecentSalesTable from './components/RecentSalesTable';
import ExpiryAlertList from './components/ExpiryAlertList';
import { CheckCircle, Bell } from 'lucide-react';

export default function DashboardPage() {
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [mounted, setMounted] = useState(false);
  const [userName, setUserName] = useState('User');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    setMounted(true);
    
    // Get user name and role from localStorage
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      setUserName(userData.fullName || 'User');
      setUserRole(userData.role || '');
    }
    
    const updateDateTime = () => {
      const now = new Date();
      const dateOptions: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      };
      const timeOptions: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
      };
      const dateStr = now.toLocaleDateString('en-US', dateOptions);
      const timeStr = now.toLocaleTimeString('en-US', timeOptions);
      setCurrentDateTime(`${dateStr} · Last updated ${timeStr}`);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Role-based access control
  const canViewSales = ['admin', 'pharmacist', 'cashier'].includes(userRole);
  const canViewInventory = ['admin', 'pharmacist', 'inventory_manager'].includes(userRole);
  const canViewMetrics = ['admin', 'pharmacist'].includes(userRole);

  return (
    <AppLayout>
      <div className="space-y-12 ml-16 lg:ml-24 mr-4 lg:mr-6 mt-6">
        {/* Welcome Banner Card */}
        <div 
          className="rounded-[40px] p-6 shadow-lg min-h-[180px]"
          style={{ background: 'linear-gradient(135deg, rgb(9, 150, 33) 0%, #0d2b36 100%)' }}
        >
          <div className="flex items-start justify-between gap-6">
            {/* Left side - Welcome text */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome back, {userName}! 👋
              </h1>
              <p className="text-white text-base font-medium mb-4">
                Here's what's happening with your pharmacy today
              </p>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-full">
                  <CheckCircle size={16} className="text-white" />
                  <span className="text-sm text-white font-bold">System Secure</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-full">
                  <Bell size={16} className="text-white" />
                  <span className="text-sm text-white font-bold">0 new notifications</span>
                </div>
              </div>
            </div>
            
            {/* Right side - Decorative icon */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                <svg className="w-14 h-14 text-white" fill="currentColor" viewBox="0 0 64 64">
                  {/* Bottle cap */}
                  <rect x="22" y="8" width="20" height="4" rx="1" />
                  {/* Bottle neck */}
                  <rect x="24" y="12" width="16" height="6" />
                  {/* Bottle body */}
                  <rect x="18" y="18" width="28" height="38" rx="2" />
                  {/* Medical cross */}
                  <rect x="29" y="28" width="6" height="18" fill="#16a34a" />
                  <rect x="23" y="34" width="18" height="6" fill="#16a34a" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* KPI Bento Grid - Only for admin and pharmacist */}
        {canViewMetrics && <DashboardMetrics />}

        {/* Bottom row: Recent sales + expiry alerts */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {canViewSales && (
            <div className="xl:col-span-2">
              <RecentSalesTable />
            </div>
          )}
          {canViewInventory && (
            <div className={canViewSales ? '' : 'xl:col-span-3'}>
              <ExpiryAlertList />
            </div>
          )}
        </div>

        {/* Access Restricted Message */}
        {!canViewMetrics && !canViewSales && !canViewInventory && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-card p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell size={32} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Limited Dashboard Access
            </h3>
            <p className="text-slate-500 max-w-md mx-auto">
              Your role has limited access to dashboard features. Contact your administrator for more information.
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
