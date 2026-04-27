'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { api } from '@/lib/api';
import {
  Package,
  AlertTriangle,
  TrendingDown,
  CheckCircle,
  Search,
  Filter,
  RefreshCw,
  ArrowUpDown,
  Pill,
  ShoppingBag,
  Plus,
  X,
} from 'lucide-react';

type ItemType = 'medicine' | 'non-medicine';

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
  type: ItemType;
  productionDate?: string;
  expiryDate?: string;
}

const statusConfig = {
  'in-stock': { label: 'In Stock', color: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  'low-stock': { label: 'Low Stock', color: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
  'out-of-stock': { label: 'Out of Stock', color: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
  'overstocked': { label: 'Overstocked', color: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
};

type SortKey = 'name' | 'currentStock' | 'category' | 'lastRestocked';

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState<ItemType>('medicine');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortAsc, setSortAsc] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [medicines, setMedicines] = useState<InventoryItem[]>([]);
  const [products, setProducts] = useState<InventoryItem[]>([]);
  const [displayCount, setDisplayCount] = useState(20); // Start with 20 items
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    sku: '',
    currentStock: '',
    minStock: '',
    maxStock: '',
    unit: '',
    location: '',
  });

  // Intersection Observer for lazy loading
  const observerTarget = React.useRef<HTMLTableRowElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          // Load more items when scrolling to bottom
          setDisplayCount((prev) => prev + 20);
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [loading]);

  // Load data when tab changes
  useEffect(() => {
    setDisplayCount(20); // Reset display count when switching tabs
    if (activeTab === 'medicine') {
      loadMedicines();
    } else {
      loadProducts();
    }
  }, [activeTab]);

  const loadMedicines = async () => {
    setLoading(true);
    try {
      console.log('Fetching medicines from API...');
      const response = await api.getMedicines();
      console.log('API Response:', response);
      
      const data = response.medicines || response;
      console.log('Extracted data:', data);
      console.log(`Loading ${data.length} medicines from database`);
      
      // Map medicines to inventory item format
      const mappedMedicines: InventoryItem[] = data.map((med: any) => {
        console.log('Mapping medicine:', med);
        return {
          id: med._id || med.id,
          name: med.name,
          category: med.category || 'General',
          sku: med.hsnCode || med._id?.slice(-6).toUpperCase() || 'N/A',
          currentStock: med.stockQty || med.stock || 0,
          minStock: med.reorderLevel || med.minStock || 0,
          maxStock: med.maxStock || 1000,
          unit: med.dosageForm || med.unit || 'Units',
          location: med.location || 'Pharmacy',
          lastRestocked: med.updatedAt ? new Date(med.updatedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          status: calculateStatus(med.stockQty || med.stock || 0, med.reorderLevel || med.minStock || 0, med.maxStock || 1000),
          type: 'medicine',
          productionDate: med.productionDate ? new Date(med.productionDate).toISOString().split('T')[0] : undefined,
          expiryDate: med.expiryDate ? new Date(med.expiryDate).toISOString().split('T')[0] : undefined
        };
      });
      
      console.log('Mapped medicines:', mappedMedicines);
      setMedicines(mappedMedicines);
    } catch (error) {
      console.error('Failed to load medicines:', error);
      // Keep empty array on error
      setMedicines([]);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await api.getProducts();
      const data = response.products || response;
      
      // Map products to inventory item format
      const mappedProducts: InventoryItem[] = data.map((prod: any) => ({
        id: prod._id,
        name: prod.name,
        category: prod.category,
        sku: prod.sku,
        currentStock: prod.currentStock,
        minStock: prod.minStock,
        maxStock: prod.maxStock,
        unit: prod.unit,
        location: prod.location,
        lastRestocked: prod.lastRestocked ? new Date(prod.lastRestocked).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        status: prod.status,
        type: 'non-medicine'
      }));
      
      setProducts(mappedProducts);
    } catch (error) {
      console.error('Failed to load products:', error);
      // Keep empty array on error
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStatus = (current: number, min: number, max: number): InventoryItem['status'] => {
    if (current === 0) return 'out-of-stock';
    if (current < min) return 'low-stock';
    if (current > max) return 'overstocked';
    return 'in-stock';
  };

  // Reset category filter when switching tabs
  const handleTabChange = (tab: ItemType) => {
    setActiveTab(tab);
    if (tab === 'non-medicine') {
      setCategoryFilter('Medical Supplies');
    } else {
      setCategoryFilter('all');
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const itemData = {
        name: formData.name,
        category: formData.category,
        sku: formData.sku,
        currentStock: parseInt(formData.currentStock),
        minStock: parseInt(formData.minStock),
        maxStock: parseInt(formData.maxStock),
        unit: formData.unit,
        location: formData.location,
      };

      if (activeTab === 'medicine') {
        // For medicines, use medicine API
        await api.createMedicine({
          ...itemData,
          stock: itemData.currentStock,
        });
        await loadMedicines();
      } else {
        // For products, use product API
        await api.createProduct(itemData);
        await loadProducts();
      }

      // Reset form and close modal
      setFormData({
        name: '',
        category: '',
        sku: '',
        currentStock: '',
        minStock: '',
        maxStock: '',
        unit: '',
        location: '',
      });
      setShowAddModal(false);
    } catch (error) {
      console.error('Failed to add item:', error);
      alert('Failed to add item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryOptions = () => {
    if (activeTab === 'medicine') {
      return [
        'Analgesics',
        'Antibiotics',
        'Antidiabetics',
        'Statins',
        'Antacids',
        'Antihistamines',
        'NSAIDs',
        'Vitamins',
        'Antihypertensives',
        'Bronchodilators',
      ];
    } else {
      return [
        'Medical Supplies',
        'Personal Care',
        'Cosmetics',
        'Baby Care',
      ];
    }
  };

  // Get data based on active tab
  const tabFilteredData = activeTab === 'medicine' ? medicines : products;

  const totalItems = tabFilteredData.length;
  const inStockCount = tabFilteredData.filter((i) => i.status === 'in-stock').length;
  const lowStockCount = tabFilteredData.filter((i) => i.status === 'low-stock').length;
  const outOfStockCount = tabFilteredData.filter((i) => i.status === 'out-of-stock').length;

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  };

  // Memoize filtered data for performance
  const filtered = React.useMemo(() => {
    return tabFilteredData
      .filter((item) => {
        const matchSearch =
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.sku.toLowerCase().includes(search.toLowerCase()) ||
          item.category.toLowerCase().includes(search.toLowerCase());
        const matchStatus = filterStatus === 'all' || item.status === filterStatus;
        const matchCategory = categoryFilter === 'all' || item.category === categoryFilter;
        return matchSearch && matchStatus && matchCategory;
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
  }, [tabFilteredData, search, filterStatus, categoryFilter, sortKey, sortAsc]);

  // Only display a subset of filtered items for lazy loading
  const displayedItems = filtered.slice(0, displayCount);
  const hasMore = displayCount < filtered.length;

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
            <h1 className="text-2xl font-bold text-slate-800">Inventory Management</h1>
            <p className="text-sm text-slate-500 mt-0.5">Track medicines, medical supplies, and other pharmacy products</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowAddModal(true)}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={15} />
              Add Item
            </button>
            <button 
              onClick={() => activeTab === 'medicine' ? loadMedicines() : loadProducts()}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
              Sync Stock
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-slate-200">
          <button
            onClick={() => handleTabChange('medicine')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'medicine'
                ? 'border-teal-600 text-teal-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Pill size={16} />
            Medicines
          </button>
          <button
            onClick={() => handleTabChange('non-medicine')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'non-medicine'
                ? 'border-teal-600 text-teal-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <ShoppingBag size={16} />
            Other Products
          </button>
        </div>

        {/* Category Filter for Other Products */}
        {activeTab === 'non-medicine' && (
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-slate-700">Filter by Category:</span>
              <button
                onClick={() => setCategoryFilter('Medical Supplies')}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  categoryFilter === 'Medical Supplies'
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Medical Supplies
              </button>
              <button
                onClick={() => setCategoryFilter('Personal Care')}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  categoryFilter === 'Personal Care'
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Personal Care & Hygiene
              </button>
              <button
                onClick={() => setCategoryFilter('Cosmetics')}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  categoryFilter === 'Cosmetics'
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Cosmetics & Beauty
              </button>
              <button
                onClick={() => setCategoryFilter('Baby Care')}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  categoryFilter === 'Baby Care'
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Baby Care
              </button>
            </div>
          </div>
        )}

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
            <span className="text-xs text-slate-400 ml-auto">{filtered.length} items {displayedItems.length < filtered.length && `(showing ${displayedItems.length})`}</span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <button className="flex items-center gap-1 hover:text-slate-700" onClick={() => handleSort('name')}>
                      Product Name <ArrowUpDown size={12} />
                    </button>
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <button className="flex items-center gap-1 hover:text-slate-700" onClick={() => handleSort('category')}>
                      Category <ArrowUpDown size={12} />
                    </button>
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Location</th>
                  {activeTab === 'medicine' && (
                    <>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Production Date</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Expiry Date</th>
                    </>
                  )}
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
                {loading ? (
                  <tr>
                    <td colSpan={activeTab === 'medicine' ? 8 : 6} className="text-center py-12 text-slate-400">
                      <RefreshCw size={20} className="animate-spin inline-block mr-2" />
                      Loading inventory...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={activeTab === 'medicine' ? 8 : 6} className="text-center py-12 text-slate-400">
                      {tabFilteredData.length === 0 
                        ? `No ${activeTab === 'medicine' ? 'medicines' : 'products'} found. Click "Add Item" to get started.`
                        : 'No inventory items match your search.'}
                    </td>
                  </tr>
                ) : (
                  <>
                    {displayedItems.map((item) => {
                      const cfg = statusConfig[item.status];
                      const isExpiringSoon = item.expiryDate && new Date(item.expiryDate) <= new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
                      const isExpired = item.expiryDate && new Date(item.expiryDate) < new Date();
                      
                      return (
                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3">
                            <p className="font-medium text-slate-800">{item.name}</p>
                            <p className="text-xs text-slate-400">{item.sku}</p>
                          </td>
                          <td className="px-4 py-3 text-slate-600">{item.category}</td>
                          <td className="px-4 py-3 text-slate-500 text-xs font-mono">{item.location}</td>
                          {activeTab === 'medicine' && (
                            <>
                              <td className="px-4 py-3 text-slate-600 text-xs">
                                {item.productionDate || <span className="text-slate-400">N/A</span>}
                              </td>
                              <td className="px-4 py-3 text-xs">
                                {item.expiryDate ? (
                                  <div className="flex items-center gap-1.5">
                                    <span className={isExpired ? 'text-red-600 font-medium' : isExpiringSoon ? 'text-amber-600 font-medium' : 'text-slate-600'}>
                                      {item.expiryDate}
                                    </span>
                                    {isExpired && (
                                      <span className="px-1.5 py-0.5 bg-red-100 text-red-700 rounded text-[10px] font-medium">
                                        EXPIRED
                                      </span>
                                    )}
                                    {!isExpired && isExpiringSoon && (
                                      <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded text-[10px] font-medium">
                                        EXPIRING SOON
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-slate-400">N/A</span>
                                )}
                              </td>
                            </>
                          )}
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
                    })}
                    {/* Lazy load trigger */}
                    {hasMore && (
                      <tr ref={observerTarget}>
                        <td colSpan={activeTab === 'medicine' ? 8 : 6} className="text-center py-4 text-slate-400 text-sm">
                          Loading more items...
                        </td>
                      </tr>
                    )}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-modal w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Add New {activeTab === 'medicine' ? 'Medicine' : 'Product'}
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  Fill in the details to add a new inventory item
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-slate-500" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleAddItem} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Product Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Paracetamol 500mg"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                  >
                    <option value="">Select category</option>
                    {getCategoryOptions().map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* SKU */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    SKU <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="e.g., PCM-500"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                  />
                </div>

                {/* Current Stock */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Current Stock <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.currentStock}
                    onChange={(e) => setFormData({ ...formData, currentStock: e.target.value })}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                  />
                </div>

                {/* Min Stock */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Minimum Stock <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.minStock}
                    onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                  />
                </div>

                {/* Max Stock */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Maximum Stock <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.maxStock}
                    onChange={(e) => setFormData({ ...formData, maxStock: e.target.value })}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                  />
                </div>

                {/* Unit */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Unit <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="e.g., Tablets, Bottles, Pieces"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                  />
                </div>

                {/* Location */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Storage Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., Shelf A1"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Adding...' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
// Commit on 2024-06-1 at 14:11
// Commit on 2024-06-26 at 16:48
// Commit on 2024-06-7 at 13:52
