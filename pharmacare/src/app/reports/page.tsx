'use client';

import React, { useState, useMemo, useCallback } from 'react';
import AppLayout from '@/components/AppLayout';
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Users,
  Activity,
  BarChart3,
  PieChart,
  Filter,
  RefreshCw,
  FileSpreadsheet,
  Printer,
  Mail,
  ChevronDown,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';

// Types
type DateRange = '7d' | '30d' | '90d' | 'custom';
type ReportType = 'sales' | 'inventory' | 'financial' | 'expiry' | 'supplier' | 'prescription';
type ExportFormat = 'pdf' | 'excel' | 'csv';

interface ReportMetric {
  label: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  color: string;
}

interface SalesData {
  date: string;
  revenue: number;
  transactions: number;
  avgOrderValue: number;
}

interface TopProduct {
  name: string;
  category: string;
  quantity: number;
  revenue: number;
  margin: number;
}

interface InventoryAlert {
  type: 'low_stock' | 'expiring' | 'expired';
  medicine: string;
  quantity: number;
  expiryDate?: string;
  severity: 'high' | 'medium' | 'low';
}

// Mock Data
const SALES_DATA: SalesData[] = [
  { date: '2026-03-27', revenue: 3820, transactions: 61, avgOrderValue: 62.62 },
  { date: '2026-03-28', revenue: 4210, transactions: 68, avgOrderValue: 61.91 },
  { date: '2026-03-29', revenue: 2940, transactions: 49, avgOrderValue: 60.00 },
  { date: '2026-03-30', revenue: 3680, transactions: 59, avgOrderValue: 62.37 },
  { date: '2026-03-31', revenue: 5120, transactions: 82, avgOrderValue: 62.44 },
  { date: '2026-04-01', revenue: 4289, transactions: 72, avgOrderValue: 59.57 },
  { date: '2026-04-02', revenue: 4821, transactions: 83, avgOrderValue: 58.08 }
];

const TOP_PRODUCTS: TopProduct[] = [
  { name: 'Dolo 650 Paracetamol', category: 'Analgesics', quantity: 1240, revenue: 347.20, margin: 42.8 },
  { name: 'Amoxicillin 500mg', category: 'Antibiotics', quantity: 480, revenue: 408.00, margin: 31.8 },
  { name: 'Atorvastatin 20mg', category: 'Cardiovascular', quantity: 620, revenue: 744.00, margin: 36.7 },
  { name: 'Metformin 850mg', category: 'Antidiabetics', quantity: 8, revenue: 3.36, margin: 33.3 },
  { name: 'Azithromycin 500mg', category: 'Antibiotics', quantity: 96, revenue: 230.40, margin: 35.4 }
];

const INVENTORY_ALERTS: InventoryAlert[] = [
  { type: 'low_stock', medicine: 'Metformin 850mg', quantity: 8, severity: 'high' },
  { type: 'expiring', medicine: 'Amoxicillin 500mg', quantity: 120, expiryDate: '2026-04-14', severity: 'high' },
  { type: 'low_stock', medicine: 'Losartan 50mg', quantity: 31, severity: 'medium' },
  { type: 'expiring', medicine: 'Atorvastatin 20mg', quantity: 85, expiryDate: '2026-04-28', severity: 'medium' },
  { type: 'expired', medicine: 'Cetirizine 10mg', quantity: 15, expiryDate: '2026-03-30', severity: 'high' }
];

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<DateRange>('7d');
  const [reportType, setReportType] = useState<ReportType>('sales');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Calculate metrics
  const metrics = useMemo<ReportMetric[]>(() => {
    const totalRevenue = SALES_DATA.reduce((sum, d) => sum + d.revenue, 0);
    const totalTransactions = SALES_DATA.reduce((sum, d) => sum + d.transactions, 0);
    const avgOrderValue = totalRevenue / totalTransactions;
    
    const prevRevenue = totalRevenue * 0.89; // Mock previous period
    const revenueChange = ((totalRevenue - prevRevenue) / prevRevenue) * 100;

    return [
      {
        label: 'Total Revenue',
        value: `Br ${totalRevenue.toLocaleString('en-ET', { minimumFractionDigits: 2 })}`,
        change: revenueChange,
        trend: revenueChange > 0 ? 'up' : 'down',
        icon: <DollarSign size={20} />,
        color: 'emerald'
      },
      {
        label: 'Transactions',
        value: totalTransactions,
        change: 8.3,
        trend: 'up',
        icon: <Activity size={20} />,
        color: 'blue'
      },
      {
        label: 'Avg Order Value',
        value: `Br ${avgOrderValue.toFixed(2)}`,
        change: -2.1,
        trend: 'down',
        icon: <TrendingUp size={20} />,
        color: 'amber'
      },
      {
        label: 'Active Products',
        value: '1,248',
        change: 0,
        trend: 'neutral',
        icon: <Package size={20} />,
        color: 'slate'
      }
    ];
  }, []);

  const handleExport = useCallback(async (format: ExportFormat) => {
    setIsGenerating(true);
    setShowExportMenu(false);
    
    // Simulate export generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In production, this would trigger actual export logic
    // Export format: ${format}
    
    setIsGenerating(false);
  }, []);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    if (trend === 'up') return <ArrowUpRight size={16} className="text-emerald-600" />;
    if (trend === 'down') return <ArrowDownRight size={16} className="text-red-600" />;
    return <Minus size={16} className="text-slate-400" />;
  };

  const getAlertIcon = (type: InventoryAlert['type']) => {
    switch (type) {
      case 'low_stock':
        return <Package size={16} className="text-amber-600" />;
      case 'expiring':
        return <Clock size={16} className="text-orange-600" />;
      case 'expired':
        return <AlertCircle size={16} className="text-red-600" />;
    }
  };

  const getAlertBadge = (severity: InventoryAlert['severity']) => {
    const badges = {
      high: 'bg-red-100 text-red-700 border-red-200',
      medium: 'bg-amber-100 text-amber-700 border-amber-200',
      low: 'bg-blue-100 text-blue-700 border-blue-200'
    };
    return badges[severity];
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Reports & Analytics</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Comprehensive business insights and performance metrics
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="btn-secondary flex items-center gap-2 text-sm"
            >
              <Printer size={16} />
              Print
            </button>
            
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                disabled={isGenerating}
                className="btn-primary flex items-center gap-2 text-sm"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download size={16} />
                    Export
                    <ChevronDown size={14} />
                  </>
                )}
              </button>
              
              {showExportMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowExportMenu(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-modal z-20 py-2">
                    <button
                      onClick={() => handleExport('pdf')}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2"
                    >
                      <FileText size={16} className="text-red-600" />
                      Export as PDF
                    </button>
                    <button
                      onClick={() => handleExport('excel')}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2"
                    >
                      <FileSpreadsheet size={16} className="text-emerald-600" />
                      Export as Excel
                    </button>
                    <button
                      onClick={() => handleExport('csv')}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2"
                    >
                      <FileText size={16} className="text-blue-600" />
                      Export as CSV
                    </button>
                    <div className="border-t border-slate-100 my-2" />
                    <button
                      onClick={() => {/* Email report functionality */}}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Mail size={16} className="text-slate-600" />
                      Email Report
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-card p-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Report Type */}
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-slate-400" />
              <span className="text-sm font-medium text-slate-600">Report Type:</span>
              <div className="flex gap-1">
                {[
                  { value: 'sales', label: 'Sales', icon: <DollarSign size={14} /> },
                  { value: 'inventory', label: 'Inventory', icon: <Package size={14} /> },
                  { value: 'financial', label: 'Financial', icon: <BarChart3 size={14} /> },
                  { value: 'expiry', label: 'Expiry', icon: <Clock size={14} /> }
                ].map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setReportType(type.value as ReportType)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                      reportType === type.value
                        ? 'bg-teal-700 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {type.icon}
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-6 w-px bg-slate-200" />

            {/* Date Range */}
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-slate-400" />
              <span className="text-sm font-medium text-slate-600">Period:</span>
              <div className="flex gap-1">
                {[
                  { value: '7d', label: 'Last 7 Days' },
                  { value: '30d', label: 'Last 30 Days' },
                  { value: '90d', label: 'Last 90 Days' },
                  { value: 'custom', label: 'Custom' }
                ].map((range) => (
                  <button
                    key={range.value}
                    onClick={() => setDateRange(range.value as DateRange)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      dateRange === range.value
                        ? 'bg-teal-700 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-slate-200 shadow-card p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg bg-${metric.color}-100 flex items-center justify-center text-${metric.color}-600`}>
                  {metric.icon}
                </div>
                <div className="flex items-center gap-1">
                  {getTrendIcon(metric.trend)}
                  <span className={`text-xs font-semibold ${
                    metric.trend === 'up' ? 'text-emerald-600' :
                    metric.trend === 'down' ? 'text-red-600' : 'text-slate-400'
                  }`}>
                    {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}%
                  </span>
                </div>
              </div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                {metric.label}
              </p>
              <p className="text-2xl font-bold text-slate-800 tabular-nums">
                {metric.value}
              </p>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sales Trend Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-semibold text-slate-800">Revenue Trend</h3>
                <p className="text-xs text-slate-500 mt-0.5">Daily revenue over the selected period</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
                  <BarChart3 size={16} className="text-slate-600" />
                </button>
                <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
                  <PieChart size={16} className="text-slate-600" />
                </button>
              </div>
            </div>
            
            {/* Simple Bar Chart Visualization */}
            <div className="space-y-3">
              {SALES_DATA.map((data, idx) => {
                const maxRevenue = Math.max(...SALES_DATA.map(d => d.revenue));
                const percentage = (data.revenue / maxRevenue) * 100;
                
                return (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="text-xs font-mono text-slate-500 w-16">
                      {new Date(data.date).toLocaleDateString('en-ET', { month: 'short', day: 'numeric' })}
                    </span>
                    <div className="flex-1 bg-slate-100 rounded-full h-8 relative overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                      <div className="absolute inset-0 flex items-center justify-between px-3">
                        <span className="text-xs font-semibold text-white drop-shadow">
                          Br {data.revenue.toLocaleString()}
                        </span>
                        <span className="text-xs text-white/80 drop-shadow">
                          {data.transactions} orders
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100">
              <div>
                <p className="text-xs text-slate-500 mb-1">Total Revenue</p>
                <p className="text-lg font-bold text-slate-800 tabular-nums">
                  Br {SALES_DATA.reduce((sum, d) => sum + d.revenue, 0).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Total Orders</p>
                <p className="text-lg font-bold text-slate-800 tabular-nums">
                  {SALES_DATA.reduce((sum, d) => sum + d.transactions, 0)}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Avg Daily</p>
                <p className="text-lg font-bold text-slate-800 tabular-nums">
                  Br {(SALES_DATA.reduce((sum, d) => sum + d.revenue, 0) / SALES_DATA.length).toFixed(0)}
                </p>
              </div>
            </div>
          </div>

          {/* Inventory Alerts */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-slate-800">Inventory Alerts</h3>
              <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-1 rounded-full">
                {INVENTORY_ALERTS.filter(a => a.severity === 'high').length} Critical
              </span>
            </div>
            
            <div className="space-y-3">
              {INVENTORY_ALERTS.map((alert, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border ${
                    alert.severity === 'high' ? 'bg-red-50 border-red-200' :
                    alert.severity === 'medium' ? 'bg-amber-50 border-amber-200' :
                    'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">
                        {alert.medicine}
                      </p>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {alert.type === 'low_stock' && `Only ${alert.quantity} units left`}
                        {alert.type === 'expiring' && `${alert.quantity} units expiring ${alert.expiryDate}`}
                        {alert.type === 'expired' && `${alert.quantity} units expired on ${alert.expiryDate}`}
                      </p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${getAlertBadge(alert.severity)}`}>
                      {alert.severity}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-4 text-sm text-teal-600 font-medium hover:text-teal-700 transition-colors">
              View All Alerts →
            </button>
          </div>
        </div>

        {/* Top Products Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="text-base font-semibold text-slate-800">Top Performing Products</h3>
            <p className="text-xs text-slate-500 mt-0.5">Best sellers by revenue and quantity</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="table-header text-left">Product</th>
                  <th className="table-header text-left">Category</th>
                  <th className="table-header text-right">Quantity Sold</th>
                  <th className="table-header text-right">Revenue</th>
                  <th className="table-header text-right">Margin %</th>
                  <th className="table-header text-center">Performance</th>
                </tr>
              </thead>
              <tbody>
                {TOP_PRODUCTS.map((product, idx) => (
                  <tr key={idx} className="table-row">
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-bold">
                          {idx + 1}
                        </span>
                        <span className="font-medium text-slate-800">{product.name}</span>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className="badge bg-blue-50 text-blue-700 border-blue-200">
                        {product.category}
                      </span>
                    </td>
                    <td className="table-cell text-right font-mono text-slate-700">
                      {product.quantity.toLocaleString()}
                    </td>
                    <td className="table-cell text-right font-mono font-semibold text-slate-800">
                      Br {product.revenue.toFixed(2)}
                    </td>
                    <td className="table-cell text-right">
                      <span className={`font-semibold ${
                        product.margin > 40 ? 'text-emerald-600' :
                        product.margin > 30 ? 'text-blue-600' : 'text-amber-600'
                      }`}>
                        {product.margin.toFixed(1)}%
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center justify-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-1.5 h-6 rounded-full ${
                              i < Math.ceil((product.margin / 50) * 5)
                                ? 'bg-teal-500'
                                : 'bg-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
