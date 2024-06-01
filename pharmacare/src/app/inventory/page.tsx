'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import {
  Package,
  AlertTriangle,
  TrendingDown,
  CheckCircle,
  Search,
  Filter,
  RefreshCw,
  ArrowUpDown,
} from 'lucide-react';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  sku: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  location: string;
  lastRestocked: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'overstocked';
}

const inventoryData: InventoryItem[] = [
  { id: 'INV001', name: 'Paracetamol 500mg', category: 'Analgesics', sku: 'PCM-500', currentStock: 1200, minStock: 200, maxStock: 2000, unit: 'Tablets', location: 'Shelf A1', lastRestocked: '2026-03-28', status: 'in-stock' },
  { id: 'INV002', name: 'Amoxicillin 250mg', category: 'Antibiotics', sku: 'AMX-250', currentStock: 85, minStock: 100, maxStock: 500, unit: 'Capsules', location: 'Shelf B2', lastRestocked: '2026-03-15', status: 'low-stock' },
  { id: 'INV003', name: 'Metformin 500mg', category: 'Antidiabetics', sku: 'MET-500', currentStock: 0, minStock: 150, maxStock: 800, unit: 'Tablets', location: 'Shelf C1', lastRestocked: '2026-02-20', status: 'out-of-stock' },
  { id: 'INV004', name: 'Atorvastatin 10mg', category: 'Statins', sku: 'ATV-010', currentStock: 640, minStock: 100, maxStock: 600, unit: 'Tablets', location: 'Shelf A3', lastRestocked: '2026-03-30', status: 'overstocked' },
  { id: 'INV005', name: 'Omeprazole 20mg', category: 'Antacids', sku: 'OMP-020', currentStock: 320, minStock: 100, maxStock: 500, unit: 'Capsules', location: 'Shelf D2', lastRestocked: '2026-03-22', status: 'in-stock' },
  { id: 'INV006', name: 'Cetirizine 10mg', category: 'Antihistamines', sku: 'CTZ-010', currentStock: 60, minStock: 80, maxStock: 400, unit: 'Tablets', location: 'Shelf B4', lastRestocked: '2026-03-10', status: 'low-stock' },
  { id: 'INV007', name: 'Azithromycin 500mg', category: 'Antibiotics', sku: 'AZT-500', currentStock: 180, minStock: 50, maxStock: 300, unit: 'Tablets', location: 'Shelf B1', lastRestocked: '2026-03-25', status: 'in-stock' },
  { id: 'INV008', name: 'Losartan 50mg', category: 'Antihypertensives', sku: 'LST-050', currentStock: 0, minStock: 120, maxStock: 600, unit: 'Tablets', location: 'Shelf C3', lastRestocked: '2026-02-14', status: 'out-of-stock' },
  { id: 'INV009', name: 'Vitamin D3 1000IU', category: 'Vitamins', sku: 'VTD-1K', currentStock: 950, minStock: 200, maxStock: 1000, unit: 'Softgels', location: 'Shelf E1', lastRestocked: '2026-03-29', status: 'in-stock' },
  { id: 'INV010', name: 'Ibuprofen 400mg', category: 'NSAIDs', sku: 'IBU-400', currentStock: 45, minStock: 150, maxStock: 700, unit: 'Tablets', location: 'Shelf A2', lastRestocked: '2026-03-05', status: 'low-stock' },
  { id: 'INV011', name: 'Pantoprazole 40mg', category: 'Antacids', sku: 'PNT-040', currentStock: 275, minStock: 80, maxStock: 400, unit: 'Tablets', location: 'Shelf D1', lastRestocked: '2026-03-18', status: 'in-stock' },
  { id: 'INV012', name: 'Salbutamol Inhaler', category: 'Bronchodilators', sku: 'SLB-INH', currentStock: 30, minStock: 40, maxStock: 150, unit: 'Units', location: 'Shelf F2', lastRestocked: '2026-03-12', status: 'low-stock' },
];

const statusConfig = {
  'in-stock': { label: 'In Stock', color: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  'low-stock': { label: 'Low Stock', color: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
  'out-of-stock': { label: 'Out of Stock', color: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
  'overstocked': { label: 'Overstocked', color: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
};

type SortKey = 'name' | 'currentStock' | 'category' | 'lastRestocked';

export default function InventoryPage() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortAsc, setSortAsc] = useState(true);

  const totalItems = inventoryData.length;
  const inStockCount = inventoryData.filter((i) => i.status === 'in-stock').length;
  const lowStockCount = inventoryData.filter((i) => i.status === 'low-stock').length;
  const outOfStockCount = inventoryData.filter((i) => i.status === 'out-of-stock').length;

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  };

  const filtered = inventoryData
    .filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.sku.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === 'all' || item.status === filterStatus;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      let valA: string | number = a[sortKey];
      let valB: string | number = b[sortKey];
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });

  const getStockBarWidth = (current: number, max: number) => {
    const pct = Math.min((current / max) * 100, 100);
    return `${pct}%`;
  };

  const getStockBarColor = (status: InventoryItem['status']) => {
    switch (status) {
      case 'in-stock': return 'bg-emerald-500';
      case 'low-stock': return 'bg-amber-500';
      case 'out-of-stock': return 'bg-red-400';
      case 'overstocked': return 'bg-blue-500';
    }
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Inventory</h1>
            <p className="text-sm text-slate-500 mt-0.5">Track stock levels, locations, and restock alerts</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors">
            <RefreshCw size={15} />
            Sync Stock
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0">
              <Package size={20} className="text-teal-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Total SKUs</p>
              <p className="text-2xl font-bold text-slate-800">{totalItems}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
              <CheckCircle size={20} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">In Stock</p>
              <p className="text-2xl font-bold text-slate-800">{inStockCount}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
              <TrendingDown size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Low Stock</p>
              <p className="text-2xl font-bold text-amber-600">{lowStockCount}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={20} className="text-red-500" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600">{outOfStockCount}</p>
            </div>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-xl border border-slate-200">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 border-b border-slate-100">
            <div className="relative flex-1 w-full sm:max-w-xs">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, SKU, category…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={15} className="text-slate-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-slate-700"
              >
                <option value="all">All Status</option>
                <option value="in-stock">In Stock</option>
                <option value="low-stock">Low Stock</option>
                <option value="out-of-stock">Out of Stock</option>
                <option value="overstocked">Overstocked</option>
              </select>
            </div>
            <span className="text-xs text-slate-400 ml-auto">{filtered.length} items</span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <button className="flex items-center gap-1 hover:text-slate-700" onClick={() => handleSort('name')}>
                      Medicine <ArrowUpDown size={12} />
                    </button>
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <button className="flex items-center gap-1 hover:text-slate-700" onClick={() => handleSort('category')}>
                      Category <ArrowUpDown size={12} />
                    </button>
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Location</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <button className="flex items-center gap-1 hover:text-slate-700" onClick={() => handleSort('currentStock')}>
                      Stock Level <ArrowUpDown size={12} />
                    </button>
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <button className="flex items-center gap-1 hover:text-slate-700" onClick={() => handleSort('lastRestocked')}>
                      Last Restocked <ArrowUpDown size={12} />
                    </button>
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-400">
                      No inventory items match your search.
                    </td>
                  </tr>
                ) : (
                  filtered.map((item) => {
                    const cfg = statusConfig[item.status];
                    return (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3">
                          <p className="font-medium text-slate-800">{item.name}</p>
                          <p className="text-xs text-slate-400">{item.sku}</p>
                        </td>
                        <td className="px-4 py-3 text-slate-600">{item.category}</td>
                        <td className="px-4 py-3 text-slate-500 text-xs font-mono">{item.location}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden flex-shrink-0">
                              <div
                                className={`h-full rounded-full ${getStockBarColor(item.status)}`}
                                style={{ width: getStockBarWidth(item.currentStock, item.maxStock) }}
                              />
                            </div>
                            <span className="text-slate-700 font-medium tabular-nums">
                              {item.currentStock.toLocaleString()}
                            </span>
                            <span className="text-slate-400 text-xs">{item.unit}</span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">Min: {item.minStock} / Max: {item.maxStock}</p>
                        </td>
                        <td className="px-4 py-3 text-slate-500 text-xs">{item.lastRestocked}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.color}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                            {cfg.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
// Commit on 2024-06-1 at 14:11
