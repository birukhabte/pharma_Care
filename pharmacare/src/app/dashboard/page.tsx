import React from 'react';
import AppLayout from '@/components/AppLayout';
import DashboardMetrics from './components/DashboardMetrics';
import DashboardCharts from './components/DashboardCharts';
import RecentSalesTable from './components/RecentSalesTable';
import ExpiryAlertList from './components/ExpiryAlertList';

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Thursday, April 2, 2026 · Last updated 16:58
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full font-medium">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Live
            </div>
            <button className="btn-secondary text-xs px-3 py-2">Export Report</button>
            <button className="btn-primary text-xs px-3 py-2">+ New Sale</button>
          </div>
        </div>

        {/* KPI Bento Grid */}
        <DashboardMetrics />

        {/* Charts row */}
        <DashboardCharts />

        {/* Bottom row: Recent sales + expiry alerts */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <RecentSalesTable />
          </div>
          <div>
            <ExpiryAlertList />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
