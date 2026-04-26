'use client';

import React, { useState, useMemo } from 'react';
import {
  Package,
  AlertTriangle,
  Clock,
  TrendingDown,
  ArrowUpDown,
  CheckCircle,
  XCircle,
  RotateCcw,
  Calendar,
  Filter
} from 'lucide-react';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  expiryDate?: string;
  batchNumber?: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'expired' | 'expiring-soon';
  lastMovement: {
    type: 'in' | 'out';
    quantity: number;
    date: string;
    reason: string;
  };
}

interface StockMovement {
  id: string;
  medicine: string;
  type: 'purchase' | 'sale' | 'adjustment' | 'return' | 'expired';
  quantity: number;
  date: string;
  reference: string;
  user: string;
}

const MOCK_INVENTORY: InventoryItem[] = [
  {
    id: '1',
    name: 'Paracetamol 500mg',
    category: 'Analgesics',
    currentStock: 5,
    minStock: 50,
    maxStock: 500,
    expiryDate: '2026-12-15',
    batchNumber: 'PCM2024001',
    status: 'low-stock',
    lastMovement: {
      type: 'out',
      quantity: 45,
      date: '2026-04-20',
      reason: 'Sale'
    }
  },
  {
    id: '2',
    name: 'Amoxicillin 250mg',
    category: 'Antibiotics',
    currentStock: 0,
    minStock: 30,
    maxStock: 300,
    expiryDate: '2026-08-20',
    batchNumber: 'AMX2024002',
    status: 'out-of-stock',
    lastMovement: {
      type: 'out',
      quantity: 15,
      date: '2026-04-19',
      reason: 'Sale'
    }
  },
  {
    id: '3',
    name: 'Aspirin 100mg',
    category: 'Cardiovascular',
    currentStock: 25,
    minStock: 20,
    maxStock: 200,
    expiryDate: '2026-05-10',
    batchNumber: 'ASP2024003',
    status: 'expiring-soon',
    lastMovement: {
      type: 'in',
      quantity: 100,
      date: '2026-04-15',
      reason: 'Purchase'
    }
  },
  {
    id: '4',
    name: 'Ibuprofen 400mg',
    category: 'Analgesics',
    currentStock: 10,
    minStock: 25,
    maxStock: 250,
    expiryDate: '2026-03-30',
    batchNumber: 'IBU2024004',
    status: 'expired',
    lastMovement: {
      type: 'out',
      quantity: 5,
      date: '2026-04-18',
      reason: 'Disposal'
    }
  }
];

const MOCK_MOVEMENTS: StockMovement[] = [
  {
    id: '1',
    medicine: 'Paracetamol 500mg',
    type: 'sale',
    quantity: -45,
    date: '2026-04-20',
    reference: 'SALE-001',
    user: 'Sarah Ahmed'
  },
  {
    id: '2',
    medicine: 'Aspirin 100mg',
    type: 'purchase',
    quantity: 100,
    date: '2026-04-15',
    reference: 'PO-2024-001',
    user: 'John Doe'
  },
  {
    id: '3',
    medicine: 'Amoxicillin 250mg',
    type: 'sale',
    quantity: -15,
    date: '2026-04-19',
    reference: 'SALE-002',
    user: 'Sarah Ahmed'
  }
];

export default function InventoryReports() {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const inventoryStats = useMemo(() => {
    const total = MOCK_INVENTORY.length;
    const inStock = MOCK_INVENTORY.filter(item => item.status === 'in-stock').length;
    const lowStock = MOCK_INVENTORY.filter(item => item.status === 'low-stock').length;
    const outOfStock = MOCK_INVENTORY.filter(item => item.status === 'out-of-stock').length;
    const expiringSoon = MOCK_INVENTORY.filter(item => item.status === 'expiring-soon').length;
    const expired = MOCK_INVENTORY.filter(item => item.status === 'expired').length;

    return { total, inStock, lowStock, outOfStock, expiringSoon, expired };
  }, []);

  const filteredInventory = useMemo(() => {
    return MOCK_INVENTORY.filter(item => {
      const statusMatch = filterStatus === 'all' || item.status === filterStatus;
      const categoryMatch = filterCategory === 'all' || item.category === filterCategory;
      return statusMatch && categoryMatch;
    });
  }, [filterStatus, filterCategory]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in-stock':
        return <CheckCircle size={16} className="text-emerald-600" />;
      case 'low-stock':
        return <AlertTriangle size={16} className="text-amber-600" />;
      case 'out-of-stock':
        return <XCircle size={16} className="text-red-600" />;
      case 'expiring-soon':
        return <Clock size={16} className="text-orange-600" />;
      case 'expired':
        return <XCircle size={16} className="text-red-700" />;
      default:
        return <Package size={16} className="text-slate-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      'in-stock': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'low-stock': 'bg-amber-100 text-amber-700 border-amber-200',
      'out-of-stock': 'bg-red-100 text-red-700 border-red-200',
      'expiring-soon': 'bg-orange-100 text-orange-700 border-orange-200',
      'expired': 'bg-red-100 text-red-800 border-red-300'
    };
    return badges[status as keyof typeof badges] || 'bg-slate-100 text-slate-700 border-slate-200';
  };

  const getMovementIcon = (type: string) => {
    switch (type) {
      case 'purchase':
        return <ArrowUpDown size={14} className="text-emerald-600 rotate-180" />;
      case 'sale':
        return <ArrowUpDown size={14} className="text-blue-600" />;
      case 'adjustment':
        return <RotateCcw size={14} className="text-amber-600" />;
      case 'return':
        return <ArrowUpDown size={14} className="text-purple-600 rotate-180" />;
      case 'expired':
        return <XCircle size={14} className="text-red-600" />;
      default:
        return <Package size={14} className="text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Inventory Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <Package size={20} className="text-slate-600" />
            <span className="text-sm font-medium text-slate-600">Total Items</span>
          </div>
          <p className="text-2xl font-bold text-slate-800">{inventoryStats.total}</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle size={20} className="text-emerald-600" />
            <span className="text-sm font-medium text-slate-600">In Stock</span>
          </div>
          <p className="text-2xl font-bold text-emerald-600">{inventoryStats.inStock}</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle size={20} className="text-amber-600" />
            <span className="text-sm font-medium text-slate-600">Low Stock</span>
          </div>
          <p className="text-2xl font-bold text-amber-600">{inventoryStats.lowStock}</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <XCircle size={20} className="text-red-600" />
            <span className="text-sm font-medium text-slate-600">Out of Stock</span>
          </div>
          <p className="text-2xl font-bold text-red-600">{inventoryStats.outOfStock}</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <Clock size={20} className="text-orange-600" />
            <span className="text-sm font-medium text-slate-600">Expiring Soon</span>
          </div>
          <p className="text-2xl font-bold text-orange-600">{inventoryStats.expiringSoon}</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <XCircle size={20} className="text-red-700" />
            <span className="text-sm font-medium text-slate-600">Expired</span>
          </div>
          <p className="text-2xl font-bold text-red-700">{inventoryStats.expired}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
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
              <option value="in-stock">In Stock</option>
              <option value="low-stock">Low Stock</option>
              <option value="out-of-stock">Out of Stock</option>
              <option value="expiring-soon">Expiring Soon</option>
              <option value="expired">Expired</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-600">Category:</span>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Categories</option>
              <option value="Analgesics">Analgesics</option>
              <option value="Antibiotics">Antibiotics</option>
              <option value="Cardiovascular">Cardiovascular</option>
            </select>
          </div>
        </div>
      </div>

      {/* Inventory Table and Stock Movements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Stock Levels */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="text-lg font-semibold text-slate-800">Current Stock Levels</h3>
            <p className="text-sm text-slate-500">Real-time inventory status</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Medicine</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Stock Level</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Expiry</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredInventory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-slate-800">{item.name}</p>
                        <p className="text-sm text-slate-500">{item.category}</p>
                        {item.batchNumber && (
                          <p className="text-xs text-slate-400 font-mono">Batch: {item.batchNumber}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-slate-800">
                              {item.currentStock} / {item.maxStock}
                            </span>
                            <span className="text-xs text-slate-500">
                              Min: {item.minStock}
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2">
                            <div
                              className={`h-full rounded-full transition-all ${
                                item.currentStock === 0 ? 'bg-red-500' :
                                item.currentStock < item.minStock ? 'bg-amber-500' :
                                'bg-emerald-500'
                              }`}
                              style={{ 
                                width: `${Math.min((item.currentStock / item.maxStock) * 100, 100)}%` 
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {item.expiryDate ? (
                        <div>
                          <p className="text-sm text-slate-800">
                            {new Date(item.expiryDate).toLocaleDateString('en-ET')}
                          </p>
                          <p className="text-xs text-slate-500">
                            {Math.ceil((new Date(item.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                          </p>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-400">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(item.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(item.status)}`}>
                          {item.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Stock Movements */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="text-lg font-semibold text-slate-800">Recent Movements</h3>
            <p className="text-sm text-slate-500">Stock in/out history</p>
          </div>
          
          <div className="p-6 space-y-4">
            {MOCK_MOVEMENTS.map((movement) => (
              <div key={movement.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                <div className="flex-shrink-0 mt-0.5">
                  {getMovementIcon(movement.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">
                    {movement.medicine}
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {movement.type.charAt(0).toUpperCase() + movement.type.slice(1)} • {movement.reference}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {new Date(movement.date).toLocaleDateString('en-ET')} by {movement.user}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${
                    movement.quantity > 0 ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}