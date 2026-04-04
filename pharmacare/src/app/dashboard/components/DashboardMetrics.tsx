import React from 'react';
import {
  DollarSign,
  AlertTriangle,
  Clock,
  ClipboardList,
  Pill,
  TrendingUp,
  TrendingDown,
  Minus,
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
  return (
    // 6 cards: grid-cols-3, 2 rows of 3
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-4">
      {/* Hero: Daily Revenue */}
      <MetricCard
        title="Today's Revenue"
        value="Br 4,821.60"
        subtitle="Apr 2, 2026 · Counter + delivery"
        trend={{ value: '+12.4%', direction: 'up', label: 'vs yesterday (Br 4,289.40)' }}
        icon={<DollarSign size={20} />}
        variant="success"
        size="hero"
      />

      {/* Low Stock Alerts */}
      <MetricCard
        title="Low Stock Alerts"
        value="7"
        subtitle="Medicines below reorder level"
        trend={{ value: '+2', direction: 'down', label: 'vs 5 alerts yesterday' }}
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
        title="Rx Dispensed Today"
        value="83"
        subtitle="Prescriptions processed at counter"
        trend={{ value: '+6', direction: 'up', label: 'vs 77 yesterday' }}
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
        title="Gross Margin Today"
        value="Br 1,144.30"
        subtitle="Revenue minus cost of goods"
        trend={{ value: '23.7%', direction: 'up', label: 'Margin rate vs 21.2% avg' }}
        icon={<TrendingUp size={20} />}
        variant="default"
      />
    </div>
  );
}