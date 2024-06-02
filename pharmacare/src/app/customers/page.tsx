'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import AppLayout from '@/components/AppLayout';
import { api } from '@/lib/api';
import { usePermissions } from '@/lib/permissions';
import {
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  TrendingUp,
  ShoppingBag,
  Filter,
  Download,
  X,
  Save,
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Eye,
  DollarSign,
  Activity,
  Loader2,
  Lock,
} from 'lucide-react';

// Types
interface Customer {
  _id: string;
  name: string;
  email?: string;
  phone: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  loyaltyPoints: number;
  totalPurchases: number;
  lastPurchaseDate?: string;
  status: 'active' | 'inactive' | 'blocked';
  notes?: string;
  registrationDate: string;
  createdAt: string;
  updatedAt: string;
}

interface PurchaseHistory {
  id: string;
  date: string;
  items: number;
  amount: number;
  paymentMethod: string;
}

interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other' | '';
  notes: string;
}

type SortField = 'name' | 'totalPurchases' | 'registrationDate' | 'lastPurchaseDate';
type SortOrder = 'asc' | 'desc';

export default function CustomerPage() {
  // Permissions
  const permissions = usePermissions();
  
  // State management
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'blocked'>('all');
  const [sortField, setSortField] = useState<SortField>('registrationDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [formData, setFormData] = useState<CustomerFormData>({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Ethiopia',
    },
    dateOfBirth: '',
    gender: '',
    notes: '',
  });

  // Fetch customers from database
  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getCustomers();
      setCustomers(data);
    } catch (error: any) {
      showNotification('error', error.message || 'Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize data
  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // Notification handler
  const showNotification = useCallback((type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  // Filtered and sorted customers
  const filteredCustomers = useMemo(() => {
    let filtered = customers.filter((customer) => {
      const matchesSearch =
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (customer.email && customer.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        customer.phone.includes(searchQuery);
      const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    filtered.sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (sortField === 'registrationDate' || sortField === 'lastPurchaseDate') {
        aVal = new Date(aVal || 0).getTime();
        bVal = new Date(bVal || 0).getTime();
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [customers, searchQuery, statusFilter, sortField, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCustomers.slice(start, start + itemsPerPage);
  }, [filteredCustomers, currentPage, itemsPerPage]);

  // Analytics
  const analytics = useMemo(() => {
    const active = customers.filter((c) => c.status === 'active').length;
    const inactive = customers.filter((c) => c.status === 'inactive').length;
    const blocked = customers.filter((c) => c.status === 'blocked').length;
    const totalLoyaltyPoints = customers.reduce((sum, c) => sum + (c.loyaltyPoints || 0), 0);
    const avgLoyaltyPoints = customers.length > 0 ? totalLoyaltyPoints / customers.length : 0;

    return {
      total: customers.length,
      active,
      inactive,
      blocked,
      totalLoyaltyPoints,
      avgLoyaltyPoints,
    };
  }, [customers]);

  // Handlers
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const openModal = (mode: 'add' | 'edit' | 'view', customer?: Customer) => {
    setModalMode(mode);
    if (customer) {
      setSelectedCustomer(customer);
      setFormData({
        name: customer.name,
        email: customer.email || '',
        phone: customer.phone,
        address: {
          street: customer.address?.street || '',
          city: customer.address?.city || '',
          state: customer.address?.state || '',
          zipCode: customer.address?.zipCode || '',
          country: customer.address?.country || 'Ethiopia',
        },
        dateOfBirth: customer.dateOfBirth || '',
        gender: customer.gender || '',
        notes: customer.notes || '',
      });
    } else {
      setSelectedCustomer(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'Ethiopia',
        },
        dateOfBirth: '',
        gender: '',
        notes: '',
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCustomer(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone) {
      showNotification('error', 'Please fill in all required fields');
      return;
    }

    try {
      if (modalMode === 'add') {
        await api.createCustomer(formData);
        showNotification('success', 'Customer added successfully');
      } else if (modalMode === 'edit' && selectedCustomer) {
        await api.updateCustomer(selectedCustomer._id, formData);
        showNotification('success', 'Customer updated successfully');
      }
      await fetchCustomers();
      closeModal();
    } catch (error: any) {
      showNotification('error', error.message || 'Operation failed');
    }
  };

  const handleDelete = (id: string) => {
    setCustomerToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (customerToDelete) {
      try {
        await api.deleteCustomer(customerToDelete);
        showNotification('success', 'Customer deleted successfully');
        await fetchCustomers();
      } catch (error: any) {
        showNotification('error', error.message || 'Failed to delete customer');
      }
    }
    setShowDeleteConfirm(false);
    setCustomerToDelete(null);
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await api.updateCustomer(id, { status: newStatus });
      showNotification('success', 'Customer status updated');
      await fetchCustomers();
    } catch (error: any) {
      showNotification('error', error.message || 'Failed to update status');
    }
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Total Purchases', 'Loyalty Points', 'Status'];
    const rows = filteredCustomers.map((c) => [
      c.name,
      c.email || '',
      c.phone,
      c.totalPurchases || 0,
      c.loyaltyPoints || 0,
      c.status,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `customers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('success', 'Customer data exported');
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Customer Management</h1>
            <p className="text-sm text-slate-500 mt-0.5">Manage customer information and track purchase history</p>
          </div>
          {permissions.canCreate('customers') ? (
            <button
              onClick={() => openModal('add')}
              className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Plus size={16} />
              Add Customer
            </button>
          ) : (
            <button
              disabled
              title="You don't have permission to add customers"
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-300 text-slate-500 text-sm font-medium rounded-lg cursor-not-allowed"
            >
              <Lock size={16} />
              Add Customer
            </button>
          )}
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500 uppercase">Total Customers</span>
              <Users size={16} className="text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-slate-800">{analytics.total}</p>
            <p className="text-xs text-slate-400 mt-1">
              {analytics.active} active · {analytics.inactive} inactive
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500 uppercase">Active Customers</span>
              <Activity size={16} className="text-emerald-500" />
            </div>
            <p className="text-2xl font-bold text-slate-800">{analytics.active}</p>
            <p className="text-xs text-slate-400 mt-1">
              {((analytics.active / analytics.total) * 100 || 0).toFixed(1)}% of total
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500 uppercase">Total Loyalty Points</span>
              <TrendingUp size={16} className="text-amber-500" />
            </div>
            <p className="text-2xl font-bold text-slate-800">{analytics.totalLoyaltyPoints.toLocaleString()}</p>
            <p className="text-xs text-slate-400 mt-1">
              Avg: {Math.round(analytics.avgLoyaltyPoints)} per customer
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500 uppercase">Blocked</span>
              <AlertCircle size={16} className="text-red-500" />
            </div>
            <p className="text-2xl font-bold text-slate-800">{analytics.blocked}</p>
            <p className="text-xs text-slate-400 mt-1">
              Requires attention
            </p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="blocked">Blocked</option>
            </select>

            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg transition-colors"
            >
              <Download size={16} />
              Export
            </button>
          </div>
        </div>

        {/* Customer Table */}
        <div className="flex-1 bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col">
          {loading ? (
            <div className="flex-1 flex items-center justify-center py-16">
              <div className="text-center">
                <Loader2 size={48} className="mx-auto mb-3 text-teal-600 animate-spin" />
                <p className="text-sm font-medium text-slate-600">Loading customers...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto flex-1">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200 sticky top-0">
                    <tr>
                      <th
                        onClick={() => handleSort('name')}
                        className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                      >
                        <div className="flex items-center gap-1">
                          Customer
                          {sortField === 'name' && <span className="text-teal-600">{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Contact
                      </th>
                      <th
                        onClick={() => handleSort('totalPurchases')}
                        className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                      >
                        <div className="flex items-center gap-1">
                          Purchases
                          {sortField === 'totalPurchases' && <span className="text-teal-600">{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                        </div>
                      </th>
                      <th
                        onClick={() => handleSort('lastPurchaseDate')}
                        className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                      >
                        <div className="flex items-center gap-1">
                          Last Purchase
                          {sortField === 'lastPurchaseDate' && <span className="text-teal-600">{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Loyalty Points
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedCustomers.map((customer) => (
                      <tr key={customer._id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-sm font-semibold text-slate-800">{customer.name}</p>
                            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                              <Calendar size={10} />
                              Joined {new Date(customer.registrationDate || customer.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="space-y-1">
                            {customer.email && (
                              <p className="text-xs text-slate-600 flex items-center gap-1">
                                <Mail size={10} className="text-slate-400" />
                                {customer.email}
                              </p>
                            )}
                            <p className="text-xs text-slate-600 flex items-center gap-1">
                              <Phone size={10} className="text-slate-400" />
                              {customer.phone}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <ShoppingBag size={14} className="text-slate-400" />
                            <span className="text-sm font-medium text-slate-700">{customer.totalPurchases || 0}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs text-slate-500">
                            {customer.lastPurchaseDate
                              ? new Date(customer.lastPurchaseDate).toLocaleDateString()
                              : 'No purchases'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-full">
                            <TrendingUp size={10} />
                            {customer.loyaltyPoints || 0}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => toggleStatus(customer._id, customer.status)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full transition-colors ${
                              customer.status === 'active'
                                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                : customer.status === 'blocked'
                                ? 'bg-red-50 text-red-700 hover:bg-red-100'
                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                            }`}
                          >
                            <div className={`w-1.5 h-1.5 rounded-full ${
                              customer.status === 'active' ? 'bg-emerald-500' : 
                              customer.status === 'blocked' ? 'bg-red-500' : 'bg-slate-400'
                            }`} />
                            {customer.status}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => openModal('view', customer)}
                              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="View Details"
                            >
                              <Eye size={14} />
                            </button>
                            {permissions.canUpdate('customers') && (
                              <button
                                onClick={() => openModal('edit', customer)}
                                className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded transition-colors"
                                title="Edit"
                              >
                                <Edit2 size={14} />
                              </button>
                            )}
                            {permissions.canDelete('customers') && (
                              <button
                                onClick={() => handleDelete(customer._id)}
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {paginatedCustomers.length === 0 && !loading && (
                  <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                    <Users size={48} className="mb-3 opacity-40" />
                    <p className="text-sm font-medium">No customers found</p>
                    <p className="text-xs mt-1">Try adjusting your search or filters</p>
                  </div>
                )}
              </div>

          {/* Pagination */}
          {totalPages > 1 && !loading && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200">
              <p className="text-xs text-slate-500">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                {Math.min(currentPage * itemsPerPage, filteredCustomers.length)} of {filteredCustomers.length} customers
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                        currentPage === pageNum
                          ? 'bg-teal-600 text-white'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
            </>
          )}
        </div>
      </div>

      {/* Add/Edit/View Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-800">
                {modalMode === 'add' ? 'Add New Customer' : modalMode === 'edit' ? 'Edit Customer' : 'Customer Details'}
              </h2>
              <button
                onClick={closeModal}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {modalMode === 'view' && selectedCustomer ? (
                <div className="space-y-6">
                  {/* Customer Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-slate-500 uppercase">Full Name</label>
                      <p className="text-sm font-semibold text-slate-800 mt-1">{selectedCustomer.name}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500 uppercase">Status</label>
                      <p className="mt-1">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full ${
                            selectedCustomer.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full ${selectedCustomer.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                          {selectedCustomer.status}
                        </span>
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500 uppercase">Email</label>
                      <p className="text-sm text-slate-700 mt-1 flex items-center gap-1">
                        <Mail size={12} className="text-slate-400" />
                        {selectedCustomer.email}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500 uppercase">Phone</label>
                      <p className="text-sm text-slate-700 mt-1 flex items-center gap-1">
                        <Phone size={12} className="text-slate-400" />
                        {selectedCustomer.phone}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs font-medium text-slate-500 uppercase">Address</label>
                      <p className="text-sm text-slate-700 mt-1 flex items-start gap-1">
                        <MapPin size={12} className="text-slate-400 mt-0.5" />
                        {selectedCustomer.address 
                          ? `${selectedCustomer.address.street || ''}, ${selectedCustomer.address.city || ''}, ${selectedCustomer.address.state || ''}, ${selectedCustomer.address.country || ''}`
                          : 'No address provided'}
                      </p>
                    </div>
                    {selectedCustomer.dateOfBirth && (
                      <div>
                        <label className="text-xs font-medium text-slate-500 uppercase">Date of Birth</label>
                        <p className="text-sm text-slate-700 mt-1">{new Date(selectedCustomer.dateOfBirth).toLocaleDateString()}</p>
                      </div>
                    )}
                    <div>
                      <label className="text-xs font-medium text-slate-500 uppercase">Registered Date</label>
                      <p className="text-sm text-slate-700 mt-1">{new Date(selectedCustomer.registrationDate || selectedCustomer.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Purchase Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-xs font-medium text-blue-600 uppercase mb-1">Total Purchases</p>
                      <p className="text-xl font-bold text-blue-700">{selectedCustomer.totalPurchases || 0}</p>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <p className="text-xs font-medium text-amber-600 uppercase mb-1">Loyalty Points</p>
                      <p className="text-xl font-bold text-amber-700">{selectedCustomer.loyaltyPoints || 0}</p>
                    </div>
                  </div>

                  {selectedCustomer.lastPurchaseDate && (
                    <div>
                      <label className="text-xs font-medium text-slate-500 uppercase">Last Purchase</label>
                      <p className="text-sm text-slate-700 mt-1">{new Date(selectedCustomer.lastPurchaseDate).toLocaleDateString()}</p>
                    </div>
                  )}

                  {selectedCustomer.notes && (
                    <div>
                      <label className="text-xs font-medium text-slate-500 uppercase">Notes</label>
                      <p className="text-sm text-slate-700 mt-1 bg-slate-50 p-3 rounded-lg">{selectedCustomer.notes}</p>
                    </div>
                  )}
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-slate-700 mb-1.5">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="Enter customer name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1.5">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="email@example.com"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1.5">
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="+1 234-567-8900"
                        required
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-slate-700 mb-1.5">Street Address</label>
                      <input
                        type="text"
                        value={formData.address.street}
                        onChange={(e) => setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="Enter street address"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1.5">City</label>
                      <input
                        type="text"
                        value={formData.address.city}
                        onChange={(e) => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="City"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1.5">State/Region</label>
                      <input
                        type="text"
                        value={formData.address.state}
                        onChange={(e) => setFormData({ ...formData, address: { ...formData.address, state: e.target.value } })}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="State/Region"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1.5">Date of Birth</label>
                      <input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1.5">Gender</label>
                      <select
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-slate-700 mb-1.5">Notes</label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                        placeholder="Add any additional notes..."
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      <Save size={14} />
                      {modalMode === 'add' ? 'Add Customer' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle size={24} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Delete Customer</h3>
                <p className="text-sm text-slate-500">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-6">
              Are you sure you want to delete this customer? All associated data will be permanently removed.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Delete Customer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${
              notification.type === 'success'
                ? 'bg-emerald-600 text-white'
                : 'bg-red-600 text-white'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle2 size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
            <span className="text-sm font-medium">{notification.message}</span>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
// Commit on 2024-06-2 at 13:28
