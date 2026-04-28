'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import {
  DollarSign,
  AlertTriangle,
  Clock,
  ClipboardList,
  Pill,
  TrendingUp,
  TrendingDown,
  Minus,
  Loader2,
} from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  subtitle: string;
  trend?: { value: string; direction: 'up' | 'down' | 'neutral'; label: string };
  icon: React.ReactNode;
  variant: 'default' | 'warning' | 'danger' | 'success' | 'info';
  size?: 'normal' | 'hero';
}

function MetricCard({ title, value, subtitle, trend, icon, variant, size = 'normal' }: MetricCardProps) {
  const isRevenueCard = title === "Today's Revenue";
  
  const variantStyles: Record<string, string> = {
    default: 'bg-white border-slate-200',
    warning: 'bg-amber-50 border-amber-200',
    danger: 'bg-red-50 border-red-200',
    success: 'bg-emerald-50 border-emerald-200',
    info: 'bg-teal-50 border-teal-200',
  };

  const iconStyles: Record<string, string> = {
    default: 'bg-slate-100 text-slate-600',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
    success: 'bg-emerald-100 text-emerald-700',
    info: 'bg-teal-100 text-teal-700',
  };

  const titleStyles: Record<string, string> = {
    default: 'text-slate-500',
    warning: 'text-amber-700',
    danger: 'text-red-700',
    success: 'text-emerald-700',
    info: 'text-teal-700',
  };

  const valueStyles: Record<string, string> = {
    default: 'text-slate-800',
    warning: 'text-amber-800',
    danger: 'text-red-800',
    success: 'text-emerald-800',
    info: 'text-teal-800',
  };

  return (
    <div
      className={`${isRevenueCard ? '' : 'bg-white'} rounded-[40px] p-2.5 border ${isRevenueCard ? 'border-emerald-800' : 'border-slate-200'} transition-all min-h-[100px] ${
        size === 'hero' ? 'row-span-1' : ''
      } hover:shadow-md`}
      style={isRevenueCard ? { 
        background: 'linear-gradient(135deg, #1a535c 0%, #0d2b36 100%)',
        boxShadow: '0 1px 3px rgba(8, 89, 78, 0.2)' 
      } : { boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)' }}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Left side - Content */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1.5">
            <p className={`text-[10px] font-semibold uppercase tracking-wide ${isRevenueCard ? 'text-white' : titleStyles[variant]}`}>
              {title}
            </p>
            {trend && (
              <div
                className={`flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                  isRevenueCard ? 'bg-white/20 text-white' :
                  trend.direction === 'up' ?'bg-emerald-100 text-emerald-700'
                    : trend.direction === 'down' ?'bg-red-100 text-red-700' :'bg-slate-100 text-slate-600'
                }`}
              >
                {trend.direction === 'up' ? (
                  <TrendingUp size={8} />
                ) : trend.direction === 'down' ? (
                  <TrendingDown size={8} />
                ) : (
                  <Minus size={8} />
                )}
                {trend.value}
              </div>
            )}
          </div>
          <p
            className={`font-bold tabular-nums ${isRevenueCard ? 'text-white' : valueStyles[variant]} ${
              size === 'hero' ? 'text-lg' : 'text-base'
            }`}
          >
            {value}
          </p>
          {trend && (
            <p className={`text-[10px] ${isRevenueCard ? 'text-white/80' : 'text-slate-400'} mt-1`}>{trend.label}</p>
          )}
        </div>
        
        {/* Right side - Icon */}
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${isRevenueCard ? 'bg-white/20 text-white' : iconStyles[variant]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function DashboardMetrics() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      const data = await api.getDashboardMetrics();
      setMetrics(data);
    } catch (error: any) {
      toast.error('Failed to load metrics');
      // Use fallback data
      setMetrics({
        todayRevenue: '4821.60',
        todayRevenueChange: 12.4,
        totalOrders: 91,
        lowStockItems: 7,
        lowStockItemsChange: 2,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="relative overflow-hidden bg-[#065f46] rounded-[40px] p-2.5 border border-emerald-800 min-h-[100px]"
            style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)' }}
          >
            {/* Shimmer overlay */}
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            
            <div className="flex items-start justify-between mb-1.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-900/50" />
              <div className="h-4 w-12 bg-emerald-900/50 rounded-full" />
            </div>
            <div>
              <div className="h-2.5 w-16 bg-emerald-900/50 rounded mb-1" />
              <div className="h-4 w-24 bg-emerald-900/50 rounded mb-1" />
              <div className="h-2.5 w-32 bg-emerald-900/50 rounded" />
            </div>
            <div className="h-2.5 w-20 bg-emerald-900/50 rounded mt-1" />
          </div>
        ))}
      </div>
    );
  }

  return (
    // 6 cards: grid-cols-4, 2 rows of 4 (last row has 2 cards)
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Hero: Daily Revenue */}
      <MetricCard
        title="Today's Revenue"
        value={`Br ${parseFloat(metrics?.todayRevenue || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        subtitle={`${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · Counter + delivery`}
        trend={{ 
          value: `${parseFloat(metrics?.todayRevenueChange || 0) > 0 ? '+' : ''}${parseFloat(metrics?.todayRevenueChange || 0).toFixed(1)}%`, 
          direction: parseFloat(metrics?.todayRevenueChange || 0) > 0 ? 'up' : parseFloat(metrics?.todayRevenueChange || 0) < 0 ? 'down' : 'neutral', 
          label: 'vs yesterday' 
        }}
        icon={<DollarSign size={20} />}
        variant="success"
        size="hero"
      />

      {/* Low Stock Alerts */}
      <MetricCard
        title="Low Stock Alerts"
        value={String(metrics?.lowStockItems || 0)}
        subtitle="Medicines below reorder level"
        trend={{ 
          value: `${metrics?.lowStockItemsChange > 0 ? '+' : ''}${metrics?.lowStockItemsChange || 0}`, 
          direction: metrics?.lowStockItemsChange > 0 ? 'down' : 'neutral', 
          label: 'vs yesterday' 
        }}
        icon={<AlertTriangle size={20} />}
        variant="danger"
      />

      {/* Expiring Batches */}
      <MetricCard
        title="Expiring This Month"
        value={String(metrics?.expiringThisMonth || 0)}
        subtitle="Batches expiring within 30 days"
        trend={{ 
          value: `${metrics?.expiringCritical || 0} critical`, 
          direction: (metrics?.expiringCritical || 0) > 0 ? 'down' : 'neutral', 
          label: 'Expiring within 7 days' 
        }}
        icon={<Clock size={20} />}
        variant="warning"
      />

      {/* Prescriptions Dispensed */}
      <MetricCard
        title="Orders Today"
        value={String(metrics?.totalOrders || 0)}
        subtitle="Transactions processed at counter"
        trend={{ 
          value: `${parseFloat(metrics?.totalOrdersChange || 0) > 0 ? '+' : ''}${parseFloat(metrics?.totalOrdersChange || 0).toFixed(1)}%`, 
          direction: parseFloat(metrics?.totalOrdersChange || 0) > 0 ? 'up' : parseFloat(metrics?.totalOrdersChange || 0) < 0 ? 'down' : 'neutral', 
          label: 'vs yesterday' 
        }}
        icon={<ClipboardList size={20} />}
        variant="info"
      />

      {/* Total Employees */}
      <MetricCard
        title="Total Employees"
        value={String(metrics?.totalEmployees || 0)}
        subtitle="Active staff members"
        icon={<Pill size={20} />}
        variant="default"
      />

      {/* Recent Notifications */}
      <MetricCard
        title="Recent Notifications"
        value={String(metrics?.recentNotifications || 0)}
        subtitle="Unread alerts and messages"
        trend={{ 
          value: `${metrics?.urgentNotifications || 0} urgent`, 
          direction: (metrics?.urgentNotifications || 0) > 0 ? 'down' : 'neutral', 
          label: 'Requires immediate attention' 
        }}
        icon={<TrendingUp size={20} />}
        variant="default"
      />
    </div>
  );
}