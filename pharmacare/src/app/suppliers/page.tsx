'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import {
  Truck,
  CheckCircle,
  AlertTriangle,
  Clock,
  Search,
  Filter,
  Plus,
  Phone,
  Mail,
  MapPin,
  Star,
  ArrowUpDown,
  X,
} from 'lucide-react';

interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  city: string;
  category: string;
  rating: number;
  totalOrders: number;
  pendingOrders: number;
  lastOrderDate: string;
  status: 'active' | 'inactive' | 'pending';
}

const suppliersData: Supplier[] = [
  { id: 'SUP001', name: 'MedLine Pharmaceuticals', contactPerson: 'Suresh Kumar', phone: '+91 98765 43210', email: 'suresh@medline.in', city: 'Mumbai', category: 'Generics', rating: 4.8, totalOrders: 142, pendingOrders: 2, lastOrderDate: '2026-03-30', status: 'active' },
  { id: 'SUP002', name: 'HealthFirst Distributors', contactPerson: 'Priya Menon', phone: '+91 87654 32109', email: 'priya@healthfirst.in', city: 'Bangalore', category: 'OTC & Vitamins', rating: 4.5, totalOrders: 98, pendingOrders: 1, lastOrderDate: '2026-03-28', status: 'active' },
  { id: 'SUP003', name: 'PharmaHub India', contactPerson: 'Rajesh Nair', phone: '+91 76543 21098', email: 'rajesh@pharmahub.in', city: 'Chennai', category: 'Antibiotics', rating: 4.2, totalOrders: 75, pendingOrders: 0, lastOrderDate: '2026-03-20', status: 'active' },
  { id: 'SUP004', name: 'CureWell Supplies', contactPerson: 'Anita Sharma', phone: '+91 65432 10987', email: 'anita@curewell.in', city: 'Delhi', category: 'Surgical & Devices', rating: 3.9, totalOrders: 54, pendingOrders: 3, lastOrderDate: '2026-03-15', status: 'pending' },
  { id: 'SUP005', name: 'BioMed Traders', contactPerson: 'Vikram Singh', phone: '+91 54321 09876', email: 'vikram@biomed.in', city: 'Hyderabad', category: 'Injectables', rating: 4.6, totalOrders: 110, pendingOrders: 0, lastOrderDate: '2026-03-25', status: 'active' },
  { id: 'SUP006', name: 'NovaChem Pharma', contactPerson: 'Deepa Iyer', phone: '+91 43210 98765', email: 'deepa@novachem.in', city: 'Pune', category: 'Generics', rating: 3.5, totalOrders: 32, pendingOrders: 0, lastOrderDate: '2026-01-10', status: 'inactive' },
  { id: 'SUP007', name: 'AlphaRx Distributors', contactPerson: 'Mohan Das', phone: '+91 32109 87654', email: 'mohan@alpharx.in', city: 'Kolkata', category: 'Antidiabetics', rating: 4.3, totalOrders: 67, pendingOrders: 1, lastOrderDate: '2026-03-22', status: 'active' },
  { id: 'SUP008', name: 'ZenPharma Wholesale', contactPerson: 'Kavitha Reddy', phone: '+91 21098 76543', email: 'kavitha@zenpharma.in', city: 'Ahmedabad', category: 'Cardiovascular', rating: 4.7, totalOrders: 89, pendingOrders: 2, lastOrderDate: '2026-03-29', status: 'active' },
];

const statusConfig = {
  active: { label: 'Active', color: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  inactive: { label: 'Inactive', color: 'bg-slate-100 text-slate-500', dot: 'bg-slate-400' },
  pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
};

type SortKey = 'name' | 'rating' | 'totalOrders' | 'lastOrderDate';

interface AddSupplierModalProps {
  onClose: () => void;
}

function AddSupplierModal({ onClose }: AddSupplierModalProps) {
  const [form, setForm] = useState({
    name: '', contactPerson: '', phone: '', email: '', city: '', category: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800">Add New Supplier</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            <X size={18} className="text-slate-500" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-slate-600 mb-1">Company Name</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. MedLine Pharmaceuticals" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Contact Person</label>
              <input name="contactPerson" value={form.contactPerson} onChange={handleChange} placeholder="Full name" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Email</label>
              <input name="email" value={form.email} onChange={handleChange} placeholder="email@company.in" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">City</label>
              <input name="city" value={form.city} onChange={handleChange} placeholder="e.g. Mumbai" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-slate-600 mb-1">Category</label>
              <select name="category" value={form.category} onChange={handleChange} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-slate-700">
                <option value="">Select category</option>
                <option>Generics</option>
                <option>Antibiotics</option>
                <option>OTC & Vitamins</option>
                <option>Injectables</option>
                <option>Antidiabetics</option>
                <option>Cardiovascular</option>
                <option>Surgical & Devices</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">Add Supplier</button>
        </div>
      </div>
    </div>
  );
}

export default function SuppliersPage() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortAsc, setSortAsc] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const activeCount = suppliersData.filter((s) => s.status === 'active').length;
  const pendingCount = suppliersData.filter((s) => s.status === 'pending').length;
  const inactiveCount = suppliersData.filter((s) => s.status === 'inactive').length;
  const totalPendingOrders = suppliersData.reduce((sum, s) => sum + s.pendingOrders, 0);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  };

  const filtered = suppliersData
    .filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
        s.category.toLowerCase().includes(search.toLowerCase()) ||
        s.city.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === 'all' || s.status === filterStatus;
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

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={12}
            className={star <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}
          />
        ))}
        <span className="text-xs text-slate-500 ml-1">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Suppliers</h1>
            <p className="text-sm text-slate-500 mt-0.5">Manage supplier relationships, contacts, and order history</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors"
          >
            <Plus size={15} />
            Add Supplier
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0">
              <Truck size={20} className="text-teal-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Total Suppliers</p>
              <p className="text-2xl font-bold text-slate-800">{suppliersData.length}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
              <CheckCircle size={20} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Active</p>
              <p className="text-2xl font-bold text-slate-800">{activeCount}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
              <Clock size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Pending Orders</p>
              <p className="text-2xl font-bold text-amber-600">{totalPendingOrders}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={20} className="text-slate-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Inactive</p>
              <p className="text-2xl font-bold text-slate-500">{inactiveCount}</p>
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
                placeholder="Search by name, city, category…"
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
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <span className="text-xs text-slate-400 ml-auto">{filtered.length} suppliers</span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <button className="flex items-center gap-1 hover:text-slate-700" onClick={() => handleSort('name')}>
                      Supplier <ArrowUpDown size={12} />
                    </button>
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <button className="flex items-center gap-1 hover:text-slate-700" onClick={() => handleSort('rating')}>
                      Rating <ArrowUpDown size={12} />
                    </button>
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <button className="flex items-center gap-1 hover:text-slate-700" onClick={() => handleSort('totalOrders')}>
                      Orders <ArrowUpDown size={12} />
                    </button>
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <button className="flex items-center gap-1 hover:text-slate-700" onClick={() => handleSort('lastOrderDate')}>
                      Last Order <ArrowUpDown size={12} />
                    </button>
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-slate-400">
                      No suppliers match your search.
                    </td>
                  </tr>
                ) : (
                  filtered.map((supplier) => {
                    const cfg = statusConfig[supplier.status];
                    return (
                      <tr key={supplier.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3">
                          <p className="font-medium text-slate-800">{supplier.name}</p>
                          <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                            <MapPin size={10} /> {supplier.city}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-slate-700 font-medium">{supplier.contactPerson}</p>
                          <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                            <Phone size={10} /> {supplier.phone}
                          </p>
                          <p className="text-xs text-slate-400 flex items-center gap-1">
                            <Mail size={10} /> {supplier.email}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-block px-2 py-0.5 bg-teal-50 text-teal-700 text-xs font-medium rounded-full">
                            {supplier.category}
                          </span>
                        </td>
                        <td className="px-4 py-3">{renderStars(supplier.rating)}</td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-slate-700">{supplier.totalOrders}</p>
                          {supplier.pendingOrders > 0 && (
                            <p className="text-xs text-amber-600 font-medium">{supplier.pendingOrders} pending</p>
                          )}
                        </td>
                        <td className="px-4 py-3 text-slate-500 text-xs">
                          {new Date(supplier.lastOrderDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
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

      {showModal && <AddSupplierModal onClose={() => setShowModal(false)} />}
    </AppLayout>
  );
}
// Commit on 2024-06-7 at 10:29
// Commit on 2024-06-10 at 13:59
// Commit on 2024-06-22 at 12:0
// Commit on 2024-06-29 at 18:58
