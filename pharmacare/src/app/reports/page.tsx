'use client';

import React, { useState, useCallback } from 'react';
import AppLayout from '@/components/AppLayout';
import SalesReports from './components/SalesReports';
import InventoryReports from './components/InventoryReports';
import ExpiryReports from './components/ExpiryReports';
import {
  FileText,
  Download,
  Calendar,
  DollarSign,
  Package,
  Users,
  RefreshCw,
  FileSpreadsheet,
  Printer,
  Mail,
  ChevronDown,
  Clock,
  ShoppingCart,
  Shield,
  TrendingUp as ProfitIcon
} from 'lucide-react';

// Types
type DateRange = '7d' | '30d' | '90d' | 'custom';
type ReportType = 'sales' | 'inventory' | 'expiry' | 'purchase' | 'staff' | 'profit' | 'audit';
type ExportFormat = 'pdf' | 'excel' | 'csv';

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<DateRange>('7d');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [reportType, setReportType] = useState<ReportType>('sales');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range);
    if (range === 'custom') {
      setShowCustomDatePicker(true);
      // Set default custom dates
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 7);
      setCustomStartDate(start.toISOString().split('T')[0]);
      setCustomEndDate(end.toISOString().split('T')[0]);
    } else {
      setShowCustomDatePicker(false);
    }
  };

  const applyCustomDateRange = () => {
    if (customStartDate && customEndDate) {
      setShowCustomDatePicker(false);
    }
  };

  const handleExport = useCallback(async (format: ExportFormat) => {
    setIsGenerating(true);
    setShowExportMenu(false);
    
    // Simulate export generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In production, this would trigger actual export logic
    console.log(`Exporting ${reportType} report as ${format}`);
    
    setIsGenerating(false);
  }, [reportType]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const renderReportContent = () => {
    // Calculate date range for child components
    const getDateRange = () => {
      if (dateRange === 'custom' && customStartDate && customEndDate) {
        return { startDate: customStartDate, endDate: customEndDate };
      }
      
      const endDate = new Date();
      const startDate = new Date();
      
      switch (dateRange) {
        case '7d':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(endDate.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(endDate.getDate() - 90);
          break;
      }
      
      return {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
      };
    };

    const dateRangeData = getDateRange();

    switch (reportType) {
      case 'sales':
        return <SalesReports dateRange={dateRangeData} />;
      case 'inventory':
        return <InventoryReports dateRange={dateRangeData} />;
      case 'expiry':
        return <ExpiryReports dateRange={dateRangeData} />;
      case 'purchase':
        return <PurchaseReports />;
      case 'staff':
        return <StaffReports />;
      case 'profit':
        return <ProfitReports />;
      case 'audit':
        return <AuditReports />;
      default:
        return <SalesReports dateRange={dateRangeData} />;
    }
  };

  // Placeholder components for other report types
  const PurchaseReports = () => (
    <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
      <ShoppingCart size={48} className="text-slate-400 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-slate-800 mb-2">Purchase Reports</h3>
      <p className="text-slate-500 mb-4">Track supplier purchases, costs, and order history</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-slate-50 rounded-lg p-4">
          <h4 className="font-medium text-slate-800">Total Purchases</h4>
          <p className="text-2xl font-bold text-slate-800 mt-2">Br 45,280</p>
          <p className="text-sm text-slate-500">This month</p>
        </div>
        <div className="bg-slate-50 rounded-lg p-4">
          <h4 className="font-medium text-slate-800">Active Suppliers</h4>
          <p className="text-2xl font-bold text-slate-800 mt-2">12</p>
          <p className="text-sm text-slate-500">Suppliers</p>
        </div>
        <div className="bg-slate-50 rounded-lg p-4">
          <h4 className="font-medium text-slate-800">Pending Orders</h4>
          <p className="text-2xl font-bold text-slate-800 mt-2">8</p>
          <p className="text-sm text-slate-500">Orders</p>
        </div>
      </div>
    </div>
  );

  const StaffReports = () => (
    <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
      <Users size={48} className="text-slate-400 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-slate-800 mb-2">Staff Performance Reports</h3>
      <p className="text-slate-500 mb-4">Monitor staff activity, sales performance, and productivity</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-slate-50 rounded-lg p-4">
          <h4 className="font-medium text-slate-800">Active Staff</h4>
          <p className="text-2xl font-bold text-slate-800 mt-2">8</p>
          <p className="text-sm text-slate-500">Pharmacists & Cashiers</p>
        </div>
        <div className="bg-slate-50 rounded-lg p-4">
          <h4 className="font-medium text-slate-800">Top Performer</h4>
          <p className="text-lg font-bold text-slate-800 mt-2">Sarah Ahmed</p>
          <p className="text-sm text-slate-500">Br 12,450 sales</p>
        </div>
        <div className="bg-slate-50 rounded-lg p-4">
          <h4 className="font-medium text-slate-800">Avg Performance</h4>
          <p className="text-2xl font-bold text-slate-800 mt-2">94%</p>
          <p className="text-sm text-slate-500">Efficiency score</p>
        </div>
      </div>
    </div>
  );

  const ProfitReports = () => (
    <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
      <ProfitIcon size={48} className="text-slate-400 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-slate-800 mb-2">Profit & Loss Reports</h3>
      <p className="text-slate-500 mb-4">Financial performance, margins, and profitability analysis</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-emerald-50 rounded-lg p-4">
          <h4 className="font-medium text-slate-800">Gross Profit</h4>
          <p className="text-2xl font-bold text-emerald-600 mt-2">Br 18,920</p>
          <p className="text-sm text-slate-500">42.3% margin</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-medium text-slate-800">Net Profit</h4>
          <p className="text-2xl font-bold text-blue-600 mt-2">Br 12,680</p>
          <p className="text-sm text-slate-500">28.4% margin</p>
        </div>
        <div className="bg-amber-50 rounded-lg p-4">
          <h4 className="font-medium text-slate-800">Operating Costs</h4>
          <p className="text-2xl font-bold text-amber-600 mt-2">Br 6,240</p>
          <p className="text-sm text-slate-500">14% of revenue</p>
        </div>
      </div>
    </div>
  );

  const AuditReports = () => (
    <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
      <Shield size={48} className="text-slate-400 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-slate-800 mb-2">Audit & System Logs</h3>
      <p className="text-slate-500 mb-4">Security logs, user activity, and system changes</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-slate-50 rounded-lg p-4">
          <h4 className="font-medium text-slate-800">Login Sessions</h4>
          <p className="text-2xl font-bold text-slate-800 mt-2">156</p>
          <p className="text-sm text-slate-500">This week</p>
        </div>
        <div className="bg-slate-50 rounded-lg p-4">
          <h4 className="font-medium text-slate-800">Data Changes</h4>
          <p className="text-2xl font-bold text-slate-800 mt-2">89</p>
          <p className="text-sm text-slate-500">Records modified</p>
        </div>
        <div className="bg-slate-50 rounded-lg p-4">
          <h4 className="font-medium text-slate-800">Security Events</h4>
          <p className="text-2xl font-bold text-slate-800 mt-2">0</p>
          <p className="text-sm text-slate-500">No issues</p>
        </div>
      </div>
    </div>
  );

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

        {/* Report Type Navigation */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-card p-4">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { value: 'sales', label: 'Sales Reports', icon: <DollarSign size={14} />, desc: 'Revenue & transactions' },
              { value: 'inventory', label: 'Inventory', icon: <Package size={14} />, desc: 'Stock levels & alerts' },
              { value: 'expiry', label: 'Expiry & Batches', icon: <Clock size={14} />, desc: 'Expiring medicines' },
              { value: 'purchase', label: 'Purchases', icon: <ShoppingCart size={14} />, desc: 'Supplier orders' },
              { value: 'staff', label: 'Staff Performance', icon: <Users size={14} />, desc: 'Employee metrics' },
              { value: 'profit', label: 'Profit & Loss', icon: <ProfitIcon size={14} />, desc: 'Financial analysis' },
              { value: 'audit', label: 'Audit Logs', icon: <Shield size={14} />, desc: 'System security' }
            ].map((type) => (
              <button
                key={type.value}
                onClick={() => setReportType(type.value as ReportType)}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  reportType === type.value
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {type.icon}
                <div className="text-left">
                  <div className="font-medium">{type.label}</div>
                  <div className="text-xs opacity-75">{type.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-card p-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-slate-400" />
                <span className="text-sm font-medium text-slate-600">Period:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: '7d', label: 'Last 7 Days' },
                  { value: '30d', label: 'Last 30 Days' },
                  { value: '90d', label: 'Last 90 Days' },
                  { value: 'custom', label: 'Custom Range' }
                ].map((range) => (
                  <button
                    key={range.value}
                    onClick={() => handleDateRangeChange(range.value as DateRange)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      dateRange === range.value
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Date Range Picker */}
            {showCustomDatePicker && (
              <div className="flex flex-wrap items-end gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    max={customEndDate || new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    min={customStartDate}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <button
                  onClick={applyCustomDateRange}
                  disabled={!customStartDate || !customEndDate}
                  className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Apply
                </button>
                <button
                  onClick={() => {
                    setShowCustomDatePicker(false);
                    setDateRange('7d');
                  }}
                  className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Report Content */}
        {renderReportContent()}
      </div>
    </AppLayout>
  );
}