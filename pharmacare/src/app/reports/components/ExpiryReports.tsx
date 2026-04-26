'use client';

import React, { useState, useMemo } from 'react';
import {
  Clock,
  AlertTriangle,
  XCircle,
  Package,
  Calendar,
  Filter,
  Download,
  Trash2,
  RotateCcw
} from 'lucide-react';

interface ExpiryItem {
  id: string;
  name: string;
  category: string;
  batchNumber: string;
  quantity: number;
  expiryDate: string;
  daysToExpiry: number;
  status: 'expired' | 'expiring-soon' | 'expiring-this-month' | 'good';
  supplier: string;
  costValue: number;
  location: string;
}

interface BatchInfo {
  batchNumber: string;
  medicine: string;
  quantity: number;
  expiryDate: string;
  productionDate: string;
  supplier: string;
  status: 'active' | 'expired' | 'returned' | 'disposed';
}

const MOCK_EXPIRY_ITEMS: ExpiryItem[] = [
  {
    id: '1',
    name: 'Ibuprofen 400mg',
    category: 'Analgesics',
    batchNumber: 'IBU2024001',
    quantity: 15,
    expiryDate: '2026-03-30',
    daysToExpiry: -21, // Expired
    status: 'expired',
    supplier: 'Ethio Pharma',
    costValue: 450.00,
    location: 'Shelf A-1'
  },
  {
    id: '2',
    name: 'Aspirin 100mg',
    category: 'Cardiovascular',
    batchNumber: 'ASP2024002',
    quantity: 25,
    expiryDate: '2026-05-10',
    daysToExpiry: 14,
    status: 'expiring-soon',
    supplier: 'Addis Medical',
    costValue: 375.00,
    location: 'Shelf B-2'
  },
  {
    id: '3',
    name: 'Paracetamol 500mg',
    category: 'Analgesics',
    batchNumber: 'PCM2024003',
    quantity: 80,
    expiryDate: '2026-05-25',
    daysToExpiry: 29,
    status: 'expiring-this-month',
    supplier: 'Habesha Health',
    costValue: 960.00,
    location: 'Shelf A-3'
  },
  {
    id: '4',
    name: 'Amoxicillin 250mg',
    category: 'Antibiotics',
    batchNumber: 'AMX2024004',
    quantity: 45,
    expiryDate: '2026-04-28',
    daysToExpiry: 2,
    status: 'expiring-soon',
    supplier: 'Ethiopian Drug Supply',
    costValue: 675.00,
    location: 'Shelf C-1'
  }
];

const MOCK_BATCHES: BatchInfo[] = [
  {
    batchNumber: 'IBU2024001',
    medicine: 'Ibuprofen 400mg',
    quantity: 15,
    expiryDate: '2026-03-30',
    productionDate: '2024-03-30',
    supplier: 'Ethio Pharma',
    status: 'expired'
  },
  {
    batchNumber: 'ASP2024002',
    medicine: 'Aspirin 100mg',
    quantity: 25,
    expiryDate: '2026-05-10',
    productionDate: '2024-05-10',
    supplier: 'Addis Medical',
    status: 'active'
  }
];

export default function ExpiryReports() {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'expiry' | 'value' | 'quantity'>('expiry');

  const expiryStats = useMemo(() => {
    const expired = MOCK_EXPIRY_ITEMS.filter(item => item.status === 'expired');
    const expiringSoon = MOCK_EXPIRY_ITEMS.filter(item => item.status === 'expiring-soon');
    const expiringThisMonth = MOCK_EXPIRY_ITEMS.filter(item => item.status === 'expiring-this-month');
    
    const totalExpiredValue = expired.reduce((sum, item) => sum + item.costValue, 0);
    const totalExpiringSoonValue = expiringSoon.reduce((sum, item) => sum + item.costValue, 0);
    const totalAtRiskValue = totalExpiredValue + totalExpiringSoonValue;

    return {
      expired: expired.length,
      expiringSoon: expiringSoon.length,
      expiringThisMonth: expiringThisMonth.length,
      totalExpiredValue,
      totalExpiringSoonValue,
      totalAtRiskValue
    };
  }, []);

  const filteredItems = useMemo(() => {
    let filtered = MOCK_EXPIRY_ITEMS.filter(item => {
      const statusMatch = filterStatus === 'all' || item.status === filterStatus;
      const categoryMatch = filterCategory === 'all' || item.category === filterCategory;
      return statusMatch && categoryMatch;
    });

    // Sort items
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'expiry':
          return a.daysToExpiry - b.daysToExpiry;
        case 'value':
          return b.costValue - a.costValue;
        case 'quantity':
          return b.quantity - a.quantity;
        default:
          return 0;
      }
    });

    return filtered;
  }, [filterStatus, filterCategory, sortBy]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'expired':
        return <XCircle size={16} className="text-red-600" />;
      case 'expiring-soon':
        return <AlertTriangle size={16} className="text-orange-600" />;
      case 'expiring-this-month':
        return <Clock size={16} className="text-amber-600" />;
      default:
        return <Package size={16} className="text-emerald-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      'expired': 'bg-red-100 text-red-700 border-red-200',
      'expiring-soon': 'bg-orange-100 text-orange-700 border-orange-200',
      'expiring-this-month': 'bg-amber-100 text-amber-700 border-amber-200',
      'good': 'bg-emerald-100 text-emerald-700 border-emerald-200'
    };
    return badges[status as keyof typeof badges] || 'bg-slate-100 text-slate-700 border-slate-200';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      'expired': 'Expired',
      'expiring-soon': 'Expiring Soon',
      'expiring-this-month': 'Expiring This Month',
      'good': 'Good'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getDaysText = (days: number) => {
    if (days < 0) return `Expired ${Math.abs(days)} days ago`;
    if (days === 0) return 'Expires today';
    if (days === 1) return 'Expires tomorrow';
    return `Expires in ${days} days`;
  };

  return (
    <div className="space-y-6">
      {/* Expiry Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
              <XCircle size={24} className="text-red-600" />
            </div>
            <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-1 rounded-full">
              Critical
            </span>
          </div>
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide">Expired Items</h3>
          <p className="text-2xl font-bold text-red-600 mt-1">{expiryStats.expired}</p>
          <p className="text-xs text-slate-500 mt-2">
            Value: Br {expiryStats.totalExpiredValue.toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
              <AlertTriangle size={24} className="text-orange-600" />
            </div>
            <span className="text-xs font-semibold text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
              Urgent
            </span>
          </div>
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide">Expiring Soon</h3>
          <p className="text-2xl font-bold text-orange-600 mt-1">{expiryStats.expiringSoon}</p>
          <p className="text-xs text-slate-500 mt-2">
            Value: Br {expiryStats.totalExpiringSoonValue.toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
              <Clock size={24} className="text-amber-600" />
            </div>
            <span className="text-xs font-semibold text-amber-600 bg-amber-100 px-2 py-1 rounded-full">
              Watch
            </span>
          </div>
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide">This Month</h3>
          <p className="text-2xl font-bold text-amber-600 mt-1">{expiryStats.expiringThisMonth}</p>
          <p className="text-xs text-slate-500 mt-2">Next 30 days</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center">
              <Package size={24} className="text-slate-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide">Total at Risk</h3>
          <p className="text-2xl font-bold text-slate-800 mt-1">
            Br {expiryStats.totalAtRiskValue.toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 mt-2">Financial impact</p>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-slate-400" />
              <span className="text-sm font-medium text-slate-600">Status:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="all">All Status</option>
                <option value="expired">Expired</option>
                <option value="expiring-soon">Expiring Soon</option>
                <option value="expiring-this-month">This Month</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="expiry">Expiry Date</option>
                <option value="value">Cost Value</option>
                <option value="quantity">Quantity</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="btn-secondary flex items-center gap-2 text-sm">
              <Download size={16} />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Expiry Items Table */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800">Expiry Tracking</h3>
          <p className="text-sm text-slate-500">Medicines requiring immediate attention</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Medicine</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Batch Info</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Quantity</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Expiry Date</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Cost Value</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-slate-800">{item.name}</p>
                      <p className="text-sm text-slate-500">{item.category}</p>
                      <p className="text-xs text-slate-400">{item.location}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-mono text-slate-800">{item.batchNumber}</p>
                      <p className="text-xs text-slate-500">{item.supplier}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-slate-800">
                      {item.quantity} units
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm text-slate-800">
                        {new Date(item.expiryDate).toLocaleDateString('en-ET')}
                      </p>
                      <p className={`text-xs font-medium ${
                        item.daysToExpiry < 0 ? 'text-red-600' :
                        item.daysToExpiry <= 7 ? 'text-orange-600' :
                        item.daysToExpiry <= 30 ? 'text-amber-600' :
                        'text-slate-500'
                      }`}>
                        {getDaysText(item.daysToExpiry)}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-slate-800">
                      Br {item.costValue.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(item.status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(item.status)}`}>
                        {getStatusLabel(item.status)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {item.status === 'expired' ? (
                        <>
                          <button className="p-1.5 rounded-lg hover:bg-red-100 text-red-600 transition-colors" title="Dispose">
                            <Trash2 size={14} />
                          </button>
                          <button className="p-1.5 rounded-lg hover:bg-blue-100 text-blue-600 transition-colors" title="Return to Supplier">
                            <RotateCcw size={14} />
                          </button>
                        </>
                      ) : (
                        <button className="p-1.5 rounded-lg hover:bg-amber-100 text-amber-600 transition-colors" title="Mark for Discount Sale">
                          <Package size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Batch Tracking */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800">Batch Tracking</h3>
          <p className="text-sm text-slate-500">Complete batch history and status</p>
        </div>
        
        <div className="p-6 space-y-4">
          {MOCK_BATCHES.map((batch, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  batch.status === 'expired' ? 'bg-red-100 text-red-600' :
                  batch.status === 'active' ? 'bg-emerald-100 text-emerald-600' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  <Package size={20} />
                </div>
                <div>
                  <p className="font-medium text-slate-800">{batch.medicine}</p>
                  <p className="text-sm text-slate-600">Batch: {batch.batchNumber}</p>
                  <p className="text-xs text-slate-500">
                    Produced: {new Date(batch.productionDate).toLocaleDateString('en-ET')} • 
                    Expires: {new Date(batch.expiryDate).toLocaleDateString('en-ET')}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-800">{batch.quantity} units</p>
                <p className="text-xs text-slate-500">{batch.supplier}</p>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                  batch.status === 'expired' ? 'bg-red-100 text-red-700' :
                  batch.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {batch.status.charAt(0).toUpperCase() + batch.status.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}