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
      className={`metric-card border ${variantStyles[variant]} ${
        size === 'hero' ? 'row-span-1' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconStyles[variant]}`}>
          {icon}
        </div>
        {trend && (
          <div
            className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
              trend.direction === 'up' ?'bg-emerald-100 text-emerald-700'
                : trend.direction === 'down' ?'bg-red-100 text-red-700' :'bg-slate-100 text-slate-600'
            }`}
          >
            {trend.direction === 'up' ? (
              <TrendingUp size={11} />
            ) : trend.direction === 'down' ? (
              <TrendingDown size={11} />
            ) : (
              <Minus size={11} />
            )}
            {trend.value}
          </div>
        )}
      </div>
      <div>
        <p className={`text-xs font-semibold uppercase tracking-wide ${titleStyles[variant]}`}>
          {title}
        </p>
        <p
          className={`font-bold tabular-nums mt-1 ${valueStyles[variant]} ${
            size === 'hero' ? 'text-4xl' : 'text-2xl'
          }`}
        >
          {value}
        </p>
        <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
      </div>
      {trend && (
        <p className="text-xs text-slate-400">{trend.label}</p>
      )}
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
      <div className="flex items-center justify-center h-48">
        <Loader2 size={32} className="animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    // 6 cards: grid-cols-3, 2 rows of 3
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-4">
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
        value="14"
        subtitle="Batches expiring within 30 days"
        trend={{ value: '3 critical', direction: 'down', label: 'Expiring within 7 days' }}
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

      {/* Total Active Medicines */}
      <MetricCard
        title="Active Medicines"
        value="1,248"
        subtitle="SKUs currently in stock"
        trend={{ value: '0', direction: 'neutral', label: 'No change from last week' }}
        icon={<Pill size={20} />}
        variant="default"
      />

      {/* Gross Margin */}
      <MetricCard
        title="Avg Order Value"
        value={`Br ${parseFloat(metrics?.avgOrderValue || 0).toFixed(2)}`}
        subtitle="Average transaction amount"
        trend={{ 
          value: `${parseFloat(metrics?.avgOrderValueChange || 0) > 0 ? '+' : ''}${parseFloat(metrics?.avgOrderValueChange || 0).toFixed(1)}%`, 
          direction: parseFloat(metrics?.avgOrderValueChange || 0) > 0 ? 'up' : parseFloat(metrics?.avgOrderValueChange || 0) < 0 ? 'down' : 'neutral', 
          label: 'vs yesterday' 
        }}
        icon={<TrendingUp size={20} />}
        variant="default"
      />
    </div>
  );
}