'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import {
  Users,
  Search,
  Filter,
  Plus,
  X,
  Edit2,
  Trash2,
  Shield,
  Mail,
  Phone,
  Calendar,
} from 'lucide-react';

interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'admin' | 'pharmacist' | 'inventory_manager' | 'cashier';
  status: 'active' | 'inactive';
  createdAt: string;
  lastLogin: string;
}

const userData: User[] = [
  {
    id: 'USR001',
    fullName: 'Alemayehu Tadesse',
    email: 'alemayehu@pharmacare.et',
    phone: '+251-911-234567',
    role: 'admin',
    status: 'active',
    createdAt: '2025-01-15',
    lastLogin: '2026-04-24',
  },
  {
    id: 'USR002',
    fullName: 'Tigist Bekele',
    email: 'tigist@pharmacare.et',
    phone: '+251-911-345678',
    role: 'pharmacist',
    status: 'active',
    createdAt: '2025-02-20',
    lastLogin: '2026-04-23',
  },
  {
    id: 'USR003',
    fullName: 'Dawit Haile',
    email: 'dawit@pharmacare.et',
    phone: '+251-911-456789',
    role: 'inventory_manager',
    status: 'active',
    createdAt: '2025-03-10',
    lastLogin: '2026-04-22',
  },
  {
    id: 'USR004',
    fullName: 'Meron Tesfaye',
    email: 'meron@pharmacare.et',
    phone: '+251-911-567890',
    role: 'cashier',
    status: 'active',
    createdAt: '2025-03-25',
    lastLogin: '2026-04-20',
  },
  {
    id: 'USR005',
    fullName: 'Yohannes Kebede',
    email: 'yohannes@pharmacare.et',
    phone: '+251-911-678901',
    role: 'pharmacist',
    status: 'inactive',
    createdAt: '2025-01-30',
    lastLogin: '2026-03-15',
  },
];

const roleConfig = {
  admin: { label: 'Administrator', color: 'bg-purple-100 text-purple-700', icon: Shield },
  pharmacist: { label: 'Pharmacist', color: 'bg-teal-100 text-teal-700', icon: Users },
  inventory_manager: { label: 'Inventory Manager', color: 'bg-blue-100 text-blue-700', icon: Users },
  cashier: { label: 'Cashier', color: 'bg-amber-100 text-amber-700', icon: Users },
};

const statusConfig = {
  active: { label: 'Active', color: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  inactive: { label: 'Inactive', color: 'bg-slate-100 text-slate-700', dot: 'bg-slate-500' },
};

export default function UsersPage() {
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: '',
    password: '',
  });

  const filtered = userData.filter((user) => {
    const matchSearch =
      user.fullName.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.phone.includes(search);
    const matchRole = filterRole === 'all' || user.role === filterRole;
    const matchStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchSearch && matchRole && matchStatus;
  });

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Adding new user:', formData);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      role: '',
      password: '',
    });
    setShowAddModal(false);
  };

  const totalUsers = userData.length;
  const activeUsers = userData.filter((u) => u.status === 'active').length;
  const adminCount = userData.filter((u) => u.role === 'admin').length;

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">User Management</h1>
            <p className="text-sm text-slate-500 mt-0.5">Manage system users and their permissions</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors"
          >
            <Plus size={15} />
            Add User
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0">
              <Users size={20} className="text-teal-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Total Users</p>
              <p className="text-2xl font-bold text-slate-800">{totalUsers}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
              <Users size={20} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Active Users</p>
              <p className="text-2xl font-bold text-slate-800">{activeUsers}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
              <Shield size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Administrators</p>
              <p className="text-2xl font-bold text-slate-800">{adminCount}</p>
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
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={15} className="text-slate-400" />
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-slate-700"
              >
                <option value="all">All Roles</option>
                <option value="admin">Administrator</option>
                <option value="pharmacist">Pharmacist</option>
                <option value="inventory_manager">Inventory Manager</option>
                <option value="cashier">Cashier</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-slate-700"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <span className="text-xs text-slate-400 ml-auto">{filtered.length} users</span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-400">
                      No users match your search.
                    </td>
                  </tr>
                ) : (
                  filtered.map((user) => {
                    const roleCfg = roleConfig[user.role];
                    const statusCfg = statusConfig[user.status];
                    return (
                      <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                              <span className="text-sm font-semibold text-teal-700">
                                {user.fullName.split(' ').map((n) => n[0]).join('').substring(0, 2)}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-slate-800">{user.fullName}</p>
                              <p className="text-xs text-slate-400">{user.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-slate-600">
                              <Mail size={12} className="text-slate-400" />
                              <span className="text-xs">{user.email}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-600">
                              <Phone size={12} className="text-slate-400" />
                              <span className="text-xs">{user.phone}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${roleCfg.color}`}>
                            <roleCfg.icon size={12} />
                            {roleCfg.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusCfg.color}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                            {statusCfg.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <Calendar size={12} className="text-slate-400" />
                            <span className="text-xs">{user.lastLogin}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button className="p-1.5 hover:bg-slate-100 rounded transition-colors" title="Edit user">
                              <Edit2 size={14} className="text-slate-600" />
                            </button>
                            <button className="p-1.5 hover:bg-red-50 rounded transition-colors" title="Delete user">
                              <Trash2 size={14} className="text-red-600" />
                            </button>
                          </div>
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

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-modal w-full max-w-lg">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Add New User</h2>
                <p className="text-sm text-slate-500 mt-0.5">Create a new user account</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-slate-500" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleAddUser} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g., John Doe"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="user@pharmacare.et"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+251-911-234567"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                >
                  <option value="">Select role</option>
                  <option value="admin">Administrator</option>
                  <option value="pharmacist">Pharmacist</option>
                  <option value="inventory_manager">Inventory Manager</option>
                  <option value="cashier">Cashier</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                />
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
                  className="px-4 py-2 text-sm font-medium bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
