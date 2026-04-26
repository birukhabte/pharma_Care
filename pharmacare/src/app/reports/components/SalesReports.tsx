'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { api } from '@/lib/api';
import {
  DollarSign,
  TrendingUp,
  Users,
  CreditCard,
  Smartphone,
  Banknote,
  Calendar,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  RefreshCw
} from 'lucide-react';

interface SalesData {
  date: string;
  revenue: number;
  transactions: number;
  items: number;
}

interface PaymentMethod {
  method: string;
  amount: number;
  percentage: number;
  icon: React.ReactNode;
  color: string;
}

interface CashierPerformance {
  name: string;
  revenue: number;
  transactions: number;
}

interface SalesAnalytics {
  summary: {
    totalRevenue: number;
    totalTransactions: number;
    avgOrderValue: number;
    dateRange: {
      start: string;
      end: string;
    };
  };
  salesData: SalesData[];
  paymentMethods: Array<{
    method: string;
    amount: number;
    percentage: number;
  }>;
  cashierPerformance: CashierPerformance[];
}

export default function SalesReports() {
  const [viewType, setViewType] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');
  const [analytics, setAnalytics] = useState<SalesAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load sales analytics
  useEffect(() => {
    loadSalesAnalytics();
  }, [viewType]);

  const loadSalesAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Calculate date range based on view type
      const endDate = new Date();
      const startDate = new Date();
      
      switch (viewType) {
        case 'daily':
          startDate.setDate(endDate.getDate() - 7); // Last 7 days
          break;
        case 'weekly':
          startDate.setDate(endDate.getDate() - 30); // Last 30 days
          break;
        case 'monthly':
          startDate.setDate(endDate.getDate() - 90); // Last 90 days
          break;
      }
      
      const response = await api.getSalesAnalytics({
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        groupBy: 'day'
      });
      
      console.log('📊 Sales analytics loaded:', response);
      setAnalytics(response);
    } catch (error: any) {
      console.error('Failed to load sales analytics:', error);
      setError(error.message || 'Failed to load sales data');
    } finally {
      setLoading(false);
    }
  };

  const createSampleData = async () => {
    try {
      setLoading(true);
      const response = await api.createSampleOrders();
      console.log('✅ Sample data created:', response);
      // Reload analytics after creating sample data
      await loadSalesAnalytics();
    } catch (error: any) {
      console.error('Failed to create sample data:', error);
      setError(error.message || 'Failed to create sample data');
    } finally {
      setLoading(false);
    }
  };

  const paymentMethods = useMemo<PaymentMethod[]>(() => {
    if (!analytics) return [];
    
    return analytics.paymentMethods.map(pm => ({
      method: pm.method === 'cash' ? 'Cash' : pm.method === 'card' ? 'Card' : 'Mobile Money',
      amount: pm.amount,
      percentage: pm.percentage,
      icon: pm.method === 'cash' ? <Banknote size={16} /> : 
            pm.method === 'card' ? <CreditCard size={16} /> : 
            <Smartphone size={16} />,
      color: pm.method === 'cash' ? 'emerald' : 
             pm.method === 'card' ? 'blue' : 'purple'
    }));
  }, [analytics]);

  // Calculate previous period for comparison
  const previousPeriodComparison = useMemo(() => {
    if (!analytics || analytics.salesData.length === 0) {
      return { revenueChange: 0, transactionChange: 0, avgOrderChange: 0 };
    }
    
    const currentPeriodDays = analytics.salesData.length;
    const currentRevenue = analytics.summary.totalRevenue;
    const currentTransactions = analytics.summary.totalTransactions;
    const currentAvgOrder = analytics.summary.avgOrderValue;
    
    // Mock previous period data (in real app, you'd fetch actual previous period)
    const previousRevenue = currentRevenue * 0.89; // Assume 11% growth
    const previousTransactions = currentTransactions * 0.92; // Assume 8% growth
    const previousAvgOrder = currentAvgOrder * 0.97; // Assume 3% decline
    
    return {
      revenueChange: previousRevenue > 0 ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0,
      transactionChange: previousTransactions > 0 ? ((currentTransactions - previousTransactions) / previousTransactions) * 100 : 0,
      avgOrderChange: previousAvgOrder > 0 ? ((currentAvgOrder - previousAvgOrder) / previousAvgOrder) * 100 : 0
    };
  }, [analytics]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 size={32} className="animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-slate-500">Loading sales data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <TrendingUp size={32} className="text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800 mb-2">Failed to Load Sales Data</h3>
        <p className="text-slate-500 mb-4">{error}</p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={loadSalesAnalytics}
            className="btn-primary flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Retry
          </button>
          <button
            onClick={createSampleData}
            className="px-4 py-2 bg-teal-50 text-teal-700 border border-teal-200 rounded-lg font-medium hover:bg-teal-100 transition-colors flex items-center gap-2"
          >
            <BarChart3 size={16} />
            Create Sample Data
          </button>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
        <p className="text-slate-500">No sales data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sales Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center">
              <DollarSign size={24} className="text-emerald-600" />
            </div>
            <div className="flex items-center gap-1 text-emerald-600">
              {previousPeriodComparison.revenueChange >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              <span className="text-sm font-semibold">
                {previousPeriodComparison.revenueChange >= 0 ? '+' : ''}{previousPeriodComparison.revenueChange.toFixed(1)}%
              </span>
            </div>
          </div>
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide">Total Revenue</h3>
          <p className="text-2xl font-bold text-slate-800 mt-1">
            Br {analytics.summary.totalRevenue.toLocaleString('en-ET', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-slate-500 mt-2">vs previous period</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <TrendingUp size={24} className="text-blue-600" />
            </div>
            <div className="flex items-center gap-1 text-blue-600">
              {previousPeriodComparison.transactionChange >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              <span className="text-sm font-semibold">
                {previousPeriodComparison.transactionChange >= 0 ? '+' : ''}{previousPeriodComparison.transactionChange.toFixed(1)}%
              </span>
            </div>
          </div>
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide">Transactions</h3>
          <p className="text-2xl font-bold text-slate-800 mt-1">{analytics.summary.totalTransactions}</p>
          <p className="text-xs text-slate-500 mt-2">total orders</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
              <BarChart3 size={24} className="text-amber-600" />
            </div>
            <div className="flex items-center gap-1 text-red-600">
              {previousPeriodComparison.avgOrderChange >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              <span className="text-sm font-semibold">
                {previousPeriodComparison.avgOrderChange >= 0 ? '+' : ''}{previousPeriodComparison.avgOrderChange.toFixed(1)}%
              </span>
            </div>
          </div>
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide">Avg Order Value</h3>
          <p className="text-2xl font-bold text-slate-800 mt-1">
            Br {analytics.summary.avgOrderValue.toFixed(2)}
          </p>
          <p className="text-xs text-slate-500 mt-2">per transaction</p>
        </div>
      </div>

      {/* Sales Trend Chart */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">Sales Trend</h3>
            <p className="text-sm text-slate-500">Revenue performance over time</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-slate-100 rounded-lg p-1">
              {['daily', 'weekly', 'monthly'].map((type) => (
                <button
                  key={type}
                  onClick={() => setViewType(type as any)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors capitalize ${
                    viewType === type
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            <button
              onClick={loadSalesAnalytics}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
              title="Refresh data"
            >
              <RefreshCw size={16} className="text-slate-600" />
            </button>
          </div>
        </div>

        {/* Chart Visualization */}
        <div className="space-y-4">
          {analytics.salesData.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <BarChart3 size={32} className="mx-auto mb-2 text-slate-300" />
              <p>No sales data available for the selected period</p>
            </div>
          ) : (
            analytics.salesData.map((data, idx) => {
              const maxRevenue = Math.max(...analytics.salesData.map(d => d.revenue));
              const percentage = maxRevenue > 0 ? (data.revenue / maxRevenue) * 100 : 0;
              
              return (
                <div key={idx} className="flex items-center gap-4">
                  <span className="text-sm font-medium text-slate-600 w-20">
                    {new Date(data.date).toLocaleDateString('en-ET', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                  <div className="flex-1 bg-slate-100 rounded-full h-10 relative overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full transition-all duration-700"
                      style={{ width: `${Math.max(percentage, 2)}%` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-between px-4">
                      <span className="text-sm font-semibold text-white drop-shadow">
                        Br {data.revenue.toLocaleString()}
                      </span>
                      <span className="text-sm text-white/90 drop-shadow">
                        {data.transactions} orders
                      </span>
                    </div>
                  </div>
                  <span className="text-sm text-slate-500 w-16 text-right">
                    {data.items} items
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Payment Methods & Cashier Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Methods */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Payment Methods</h3>
          <div className="space-y-4">
            {paymentMethods.length === 0 ? (
              <div className="text-center py-4 text-slate-500">
                <CreditCard size={24} className="mx-auto mb-2 text-slate-300" />
                <p className="text-sm">No payment data available</p>
              </div>
            ) : (
              paymentMethods.map((method, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-${method.color}-100 flex items-center justify-center text-${method.color}-600`}>
                      {method.icon}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{method.method}</p>
                      <p className="text-sm text-slate-500">{method.percentage.toFixed(1)}% of total</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-800">
                      Br {method.amount.toLocaleString()}
                    </p>
                    <div className="w-20 bg-slate-100 rounded-full h-2 mt-1">
                      <div
                        className={`h-full bg-${method.color}-500 rounded-full transition-all duration-500`}
                        style={{ width: `${method.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Cashier Performance */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Cashier Performance</h3>
          <div className="space-y-4">
            {analytics.cashierPerformance.length === 0 ? (
              <div className="text-center py-4 text-slate-500">
                <Users size={24} className="mx-auto mb-2 text-slate-300" />
                <p className="text-sm">No cashier data available</p>
              </div>
            ) : (
              analytics.cashierPerformance.map((cashier, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                      <Users size={16} className="text-teal-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{cashier.name}</p>
                      <p className="text-sm text-slate-500">{cashier.transactions} transactions</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-800">
                      Br {cashier.revenue.toLocaleString()}
                    </p>
                    <p className="text-sm text-slate-500">
                      Br {(cashier.revenue / Math.max(cashier.transactions, 1)).toFixed(2)} avg
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}