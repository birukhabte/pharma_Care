'use client';

import React, { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { Search, Plus, Filter, ChevronUp, ChevronDown, ChevronsUpDown, Eye, Pencil, Trash2, Package, Columns, Check, X, ChevronLeft, ChevronRight, AlertTriangle,  } from 'lucide-react';
import AddMedicineModal from './AddMedicineModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import StatusChangeDropdown from './StatusChangeDropdown';

export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  category: string;
  manufacturer: string;
  batchCount: number;
  stockQty: number;
  reorderLevel: number;
  unitPrice: number;
  costPrice: number;
  supplier: string;
  status: 'active' | 'low_stock' | 'out_of_stock' | 'discontinued';
  dosageForm: string;
  strength: string;
  hsnCode: string;
  gstRate: number;
  schedule: string;
}

const MOCK_MEDICINES: Medicine[] = [
  {
    id: 'med-001',
    name: 'Amoxicillin 500mg Cap',
    genericName: 'Amoxicillin',
    category: 'Antibiotics',
    manufacturer: 'Cipla Ltd.',
    batchCount: 3,
    stockQty: 480,
    reorderLevel: 200,
    unitPrice: 0.85,
    costPrice: 0.58,
    supplier: 'MedWholesale India',
    status: 'active',
    dosageForm: 'Capsule',
    strength: '500mg',
    hsnCode: '30041011',
    gstRate: 12,
    schedule: 'H',
  },
  {
    id: 'med-002',
    name: 'Metformin 850mg Tab',
    genericName: 'Metformin HCl',
    category: 'Antidiabetics',
    manufacturer: 'Sun Pharma',
    batchCount: 2,
    stockQty: 8,
    reorderLevel: 150,
    unitPrice: 0.42,
    costPrice: 0.28,
    supplier: 'PharmaDist Co.',
    status: 'low_stock',
    dosageForm: 'Tablet',
    strength: '850mg',
    hsnCode: '30049099',
    gstRate: 12,
    schedule: 'H',
  },
  {
    id: 'med-003',
    name: 'Atorvastatin 20mg Tab',
    genericName: 'Atorvastatin Calcium',
    category: 'Cardiovascular',
    manufacturer: 'Torrent Pharma',
    batchCount: 4,
    stockQty: 620,
    reorderLevel: 180,
    unitPrice: 1.20,
    costPrice: 0.76,
    supplier: 'MedWholesale India',
    status: 'active',
    dosageForm: 'Tablet',
    strength: '20mg',
    hsnCode: '30049099',
    gstRate: 12,
    schedule: 'H',
  },
  {
    id: 'med-004',
    name: 'Omeprazole 20mg Cap',
    genericName: 'Omeprazole',
    category: 'Gastrointestinal',
    manufacturer: 'Dr. Reddys',
    batchCount: 2,
    stockQty: 340,
    reorderLevel: 120,
    unitPrice: 0.65,
    costPrice: 0.40,
    supplier: 'HealthSupply Hub',
    status: 'active',
    dosageForm: 'Capsule',
    strength: '20mg',
    hsnCode: '30049099',
    gstRate: 12,
    schedule: 'H',
  },
  {
    id: 'med-005',
    name: 'Amlodipine 5mg Tab',
    genericName: 'Amlodipine Besylate',
    category: 'Cardiovascular',
    manufacturer: 'Lupin Ltd.',
    batchCount: 3,
    stockQty: 0,
    reorderLevel: 100,
    unitPrice: 0.38,
    costPrice: 0.22,
    supplier: 'PharmaDist Co.',
    status: 'out_of_stock',
    dosageForm: 'Tablet',
    strength: '5mg',
    hsnCode: '30049099',
    gstRate: 12,
    schedule: 'H',
  },
  {
    id: 'med-006',
    name: 'Azithromycin 500mg Tab',
    genericName: 'Azithromycin',
    category: 'Antibiotics',
    manufacturer: 'Cipla Ltd.',
    batchCount: 2,
    stockQty: 96,
    reorderLevel: 60,
    unitPrice: 2.40,
    costPrice: 1.55,
    supplier: 'MedWholesale India',
    status: 'active',
    dosageForm: 'Tablet',
    strength: '500mg',
    hsnCode: '30041019',
    gstRate: 12,
    schedule: 'H',
  },
  {
    id: 'med-007',
    name: 'Pantoprazole 40mg Tab',
    genericName: 'Pantoprazole Sodium',
    category: 'Gastrointestinal',
    manufacturer: 'Zydus Cadila',
    batchCount: 1,
    stockQty: 220,
    reorderLevel: 80,
    unitPrice: 0.72,
    costPrice: 0.44,
    supplier: 'HealthSupply Hub',
    status: 'active',
    dosageForm: 'Tablet',
    strength: '40mg',
    hsnCode: '30049099',
    gstRate: 12,
    schedule: 'H',
  },
  {
    id: 'med-008',
    name: 'Cetirizine 10mg Tab',
    genericName: 'Cetirizine HCl',
    category: 'Antihistamines',
    manufacturer: 'Mankind Pharma',
    batchCount: 2,
    stockQty: 560,
    reorderLevel: 200,
    unitPrice: 0.18,
    costPrice: 0.10,
    supplier: 'PharmaDist Co.',
    status: 'active',
    dosageForm: 'Tablet',
    strength: '10mg',
    hsnCode: '30049099',
    gstRate: 12,
    schedule: 'OTC',
  },
  {
    id: 'med-009',
    name: 'Losartan 50mg Tab',
    genericName: 'Losartan Potassium',
    category: 'Cardiovascular',
    manufacturer: 'Sun Pharma',
    batchCount: 2,
    stockQty: 31,
    reorderLevel: 120,
    unitPrice: 0.95,
    costPrice: 0.60,
    supplier: 'MedWholesale India',
    status: 'low_stock',
    dosageForm: 'Tablet',
    strength: '50mg',
    hsnCode: '30049099',
    gstRate: 12,
    schedule: 'H',
  },
  {
    id: 'med-010',
    name: 'Dolo 650 Paracetamol',
    genericName: 'Paracetamol',
    category: 'Analgesics',
    manufacturer: 'Micro Labs',
    batchCount: 5,
    stockQty: 1240,
    reorderLevel: 500,
    unitPrice: 0.28,
    costPrice: 0.16,
    supplier: 'HealthSupply Hub',
    status: 'active',
    dosageForm: 'Tablet',
    strength: '650mg',
    hsnCode: '30049099',
    gstRate: 12,
    schedule: 'OTC',
  },
  {
    id: 'med-011',
    name: 'Glimepiride 2mg Tab',
    genericName: 'Glimepiride',
    category: 'Antidiabetics',
    manufacturer: 'Sanofi India',
    batchCount: 1,
    stockQty: 180,
    reorderLevel: 80,
    unitPrice: 1.10,
    costPrice: 0.68,
    supplier: 'PharmaDist Co.',
    status: 'active',
    dosageForm: 'Tablet',
    strength: '2mg',
    hsnCode: '30049099',
    gstRate: 12,
    schedule: 'H',
  },
  {
    id: 'med-012',
    name: 'Ondansetron 4mg Tab',
    genericName: 'Ondansetron HCl',
    category: 'Gastrointestinal',
    manufacturer: 'Emcure Pharma',
    batchCount: 2,
    stockQty: 64,
    reorderLevel: 40,
    unitPrice: 1.80,
    costPrice: 1.10,
    supplier: 'MedWholesale India',
    status: 'active',
    dosageForm: 'Tablet',
    strength: '4mg',
    hsnCode: '30049099',
    gstRate: 12,
    schedule: 'H',
  },
];

const CATEGORIES = ['All', 'Antibiotics', 'Antidiabetics', 'Cardiovascular', 'Gastrointestinal', 'Antihistamines', 'Analgesics'];
const STATUSES = ['All', 'Active', 'Low Stock', 'Out of Stock', 'Discontinued'];
const SUPPLIERS = ['All', 'MedWholesale India', 'PharmaDist Co.', 'HealthSupply Hub'];

const ALL_COLUMNS = [
  { id: 'col-name', key: 'name', label: 'Medicine', alwaysVisible: true },
  { id: 'col-generic', key: 'genericName', label: 'Generic Name', alwaysVisible: false },
  { id: 'col-category', key: 'category', label: 'Category', alwaysVisible: false },
  { id: 'col-manufacturer', key: 'manufacturer', label: 'Manufacturer', alwaysVisible: false },
  { id: 'col-batches', key: 'batchCount', label: 'Batches', alwaysVisible: false },
  { id: 'col-stock', key: 'stockQty', label: 'Stock Qty', alwaysVisible: true },
  { id: 'col-reorder', key: 'reorderLevel', label: 'Reorder At', alwaysVisible: false },
  { id: 'col-unitprice', key: 'unitPrice', label: 'Unit Price', alwaysVisible: false },
  { id: 'col-costprice', key: 'costPrice', label: 'Cost Price', alwaysVisible: false },
  { id: 'col-supplier', key: 'supplier', label: 'Supplier', alwaysVisible: false },
  { id: 'col-status', key: 'status', label: 'Status', alwaysVisible: true },
];

type SortKey = keyof Medicine;
type SortDir = 'asc' | 'desc' | null;

function StatusBadge({
  status,
  medicineId,
  onStatusChange,
}: {
  status: Medicine['status'];
  medicineId: string;
  onStatusChange: (id: string, s: Medicine['status']) => void;
}) {
  const [open, setOpen] = useState(false);

  const badgeClass: Record<Medicine['status'], string> = {
    active: 'badge-active',
    low_stock: 'badge-low-stock',
    out_of_stock: 'badge-out-of-stock',
    discontinued: 'badge-discontinued',
  };
  const badgeLabel: Record<Medicine['status'], string> = {
    active: 'Active',
    low_stock: 'Low Stock',
    out_of_stock: 'Out of Stock',
    discontinued: 'Discontinued',
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        className={`badge cursor-pointer select-none ${badgeClass[status]}`}
        title="Click to change status"
      >
        {status === 'low_stock' && <AlertTriangle size={10} className="mr-1" />}
        {status === 'out_of_stock' && <X size={10} className="mr-1" />}
        {badgeLabel[status]}
      </button>
      {open && (
        <StatusChangeDropdown
          currentStatus={status}
          onSelect={(s) => {
            onStatusChange(medicineId, s);
            setOpen(false);
          }}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}

function StockBar({ qty, reorder }: { qty: number; reorder: number }) {
  const max = Math.max(reorder * 3, qty, 1);
  const pct = Math.min((qty / max) * 100, 100);
  const color =
    qty === 0
      ? 'bg-red-400'
      : qty < reorder
      ? 'bg-amber-400' :'bg-emerald-400';

  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-sm tabular-nums text-slate-700 w-12 text-right">
        {qty.toLocaleString()}
      </span>
      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function MedicineTable() {
  const [medicines, setMedicines] = useState<Medicine[]>(MOCK_MEDICINES);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [supplierFilter, setSupplierFilter] = useState('All');
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(ALL_COLUMNS.map((c) => c.id))
  );
  const [columnPickerOpen, setColumnPickerOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Medicine | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const filtered = useMemo(() => {
    let result = [...medicines];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.genericName.toLowerCase().includes(q) ||
          m.manufacturer.toLowerCase().includes(q) ||
          m.category.toLowerCase().includes(q)
      );
    }

    if (categoryFilter !== 'All') {
      result = result.filter((m) => m.category === categoryFilter);
    }

    if (statusFilter !== 'All') {
      const statusMap: Record<string, Medicine['status']> = {
        Active: 'active',
        'Low Stock': 'low_stock',
        'Out of Stock': 'out_of_stock',
        Discontinued: 'discontinued',
      };
      result = result.filter((m) => m.status === statusMap[statusFilter]);
    }

    if (supplierFilter !== 'All') {
      result = result.filter((m) => m.supplier === supplierFilter);
    }

    if (sortKey && sortDir) {
      result.sort((a, b) => {
        const av = a[sortKey];
        const bv = b[sortKey];
        if (typeof av === 'number' && typeof bv === 'number') {
          return sortDir === 'asc' ? av - bv : bv - av;
        }
        return sortDir === 'asc'
          ? String(av).localeCompare(String(bv))
          : String(bv).localeCompare(String(av));
      });
    }

    return result;
  }, [medicines, search, categoryFilter, statusFilter, supplierFilter, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : d === 'desc' ? null : 'asc'));
      if (sortDir === 'desc') setSortKey(null);
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
    setCurrentPage(1);
  };

  const handleSelectAll = () => {
    if (selectedRows.size === paginated.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginated.map((m) => m.id)));
    }
  };

  const handleRowSelect = (id: string) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleStatusChange = (id: string, status: Medicine['status']) => {
    setMedicines((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
    // TODO: PATCH /api/medicines/:id with { status }
    toast.success(`Status updated to "${status.replace('_', ' ')}"`);
  };

  const handleDelete = (medicine: Medicine) => {
    setDeleteTarget(medicine);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setMedicines((prev) => prev.filter((m) => m.id !== deleteTarget.id));
    // TODO: DELETE /api/medicines/:id
    toast.success(`${deleteTarget.name} removed from inventory`);
    setDeleteTarget(null);
  };

  const handleBulkDelete = () => {
    setMedicines((prev) => prev.filter((m) => !selectedRows.has(m.id)));
    // TODO: DELETE /api/medicines/bulk with { ids: [...selectedRows] }
    toast.success(`${selectedRows.size} medicines removed`);
    setSelectedRows(new Set());
  };

  const handleAddOrEdit = (data: Partial<Medicine>) => {
    if (editingMedicine) {
      setMedicines((prev) =>
        prev.map((m) => (m.id === editingMedicine.id ? { ...m, ...data } : m))
      );
      // TODO: PUT /api/medicines/:id with data
      toast.success(`${data.name} updated successfully`);
    } else {
      const newMed: Medicine = {
        id: `med-${Date.now()}`,
        batchCount: 0,
        ...(data as Medicine),
      };
      setMedicines((prev) => [newMed, ...prev]);
      // TODO: POST /api/medicines with data
      toast.success(`${data.name} added to inventory`);
    }
    setAddModalOpen(false);
    setEditingMedicine(null);
  };

  const toggleColumn = (colId: string) => {
    setVisibleColumns((prev) => {
      const next = new Set(prev);
      if (next.has(colId)) next.delete(colId);
      else next.add(colId);
      return next;
    });
  };

  const SortIcon = ({ colKey }: { colKey: SortKey }) => {
    if (sortKey !== colKey) return <ChevronsUpDown size={12} className="text-slate-300" />;
    if (sortDir === 'asc') return <ChevronUp size={12} className="text-teal-600" />;
    if (sortDir === 'desc') return <ChevronDown size={12} className="text-teal-600" />;
    return <ChevronsUpDown size={12} className="text-slate-300" />;
  };

  return (
    <div className="space-y-4">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Medicine Management</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {medicines.length} medicines · {medicines.filter((m) => m.status === 'low_stock').length} low stock ·{' '}
            {medicines.filter((m) => m.status === 'out_of_stock').length} out of stock
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button className="btn-secondary text-xs px-3 py-2">Import CSV</button>
          <button
            onClick={() => { setEditingMedicine(null); setAddModalOpen(true); }}
            className="btn-primary flex items-center gap-1.5 text-xs px-3 py-2"
          >
            <Plus size={14} />
            Add Medicine
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-card p-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search medicines..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="form-input pl-9 py-2 text-sm"
            />
          </div>

          {/* Category filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={`cat-${cat}`}
                onClick={() => { setCategoryFilter(cat); setCurrentPage(1); }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 ${
                  categoryFilter === cat
                    ? 'bg-teal-700 text-white' :'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* More filters toggle */}
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className={`btn-secondary flex items-center gap-1.5 text-xs py-2 ml-auto ${
              filterOpen ? 'bg-teal-50 border-teal-200 text-teal-700' : ''
            }`}
          >
            <Filter size={13} />
            Filters
            {(statusFilter !== 'All' || supplierFilter !== 'All') && (
              <span className="w-4 h-4 bg-teal-600 text-white rounded-full text-xs flex items-center justify-center font-bold">
                {[statusFilter !== 'All', supplierFilter !== 'All'].filter(Boolean).length}
              </span>
            )}
          </button>

          {/* Column visibility */}
          <div className="relative">
            <button
              onClick={() => setColumnPickerOpen(!columnPickerOpen)}
              className="btn-secondary flex items-center gap-1.5 text-xs py-2"
            >
              <Columns size={13} />
              Columns
            </button>
            {columnPickerOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-modal z-20 animate-fade-in p-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide px-2 py-1.5 mb-1">
                  Visible Columns
                </p>
                {ALL_COLUMNS.map((col) => (
                  <button
                    key={col.id}
                    onClick={() => !col.alwaysVisible && toggleColumn(col.id)}
                    disabled={col.alwaysVisible}
                    className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm transition-colors ${
                      col.alwaysVisible
                        ? 'opacity-50 cursor-not-allowed' :'hover:bg-slate-50 cursor-pointer'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                        visibleColumns.has(col.id)
                          ? 'bg-teal-600 border-teal-600' :'border-slate-300'
                      }`}
                    >
                      {visibleColumns.has(col.id) && <Check size={10} className="text-white" />}
                    </div>
                    <span className="text-slate-700">{col.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Extended filters */}
        {filterOpen && (
          <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-slate-100 animate-slide-up">
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-slate-600 whitespace-nowrap">Status</label>
              <div className="flex gap-1.5">
                {STATUSES.map((s) => (
                  <button
                    key={`status-filter-${s}`}
                    onClick={() => { setStatusFilter(s); setCurrentPage(1); }}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                      statusFilter === s
                        ? 'bg-teal-700 text-white' :'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-slate-600 whitespace-nowrap">Supplier</label>
              <div className="flex gap-1.5">
                {SUPPLIERS.map((s) => (
                  <button
                    key={`supplier-filter-${s}`}
                    onClick={() => { setSupplierFilter(s); setCurrentPage(1); }}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                      supplierFilter === s
                        ? 'bg-teal-700 text-white' :'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            {(statusFilter !== 'All' || supplierFilter !== 'All' || categoryFilter !== 'All') && (
              <button
                onClick={() => {
                  setStatusFilter('All');
                  setSupplierFilter('All');
                  setCategoryFilter('All');
                  setCurrentPage(1);
                }}
                className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 font-medium transition-colors ml-auto"
              >
                <X size={12} />
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Bulk action bar */}
      {selectedRows.size > 0 && (
        <div className="bg-teal-700 text-white rounded-xl px-5 py-3 flex items-center gap-4 animate-slide-up shadow-lg">
          <span className="text-sm font-medium">{selectedRows.size} medicines selected</span>
          <div className="flex items-center gap-2 ml-auto">
            <button className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg font-medium transition-colors">
              Export Selected
            </button>
            <button
              onClick={handleBulkDelete}
              className="text-xs bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5"
            >
              <Trash2 size={12} />
              Delete Selected
            </button>
            <button
              onClick={() => setSelectedRows(new Set())}
              className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full min-w-[900px]">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={selectedRows.size === paginated.length && paginated.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                  />
                </th>
                {ALL_COLUMNS.filter((c) => visibleColumns.has(c.id)).map((col) => (
                  <th
                    key={col.id}
                    className="table-header cursor-pointer hover:text-slate-700 select-none"
                    onClick={() => handleSort(col.key as SortKey)}
                  >
                    <div className="flex items-center gap-1.5">
                      {col.label}
                      <SortIcon colKey={col.key as SortKey} />
                    </div>
                  </th>
                ))}
                <th className="table-header w-24 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={visibleColumns.size + 2}
                    className="px-4 py-16 text-center"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                        <Package size={24} className="text-slate-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-700">No medicines found</p>
                        <p className="text-xs text-slate-400 mt-1">
                          Try adjusting your search or filters, or add a new medicine
                        </p>
                      </div>
                      <button
                        onClick={() => setAddModalOpen(true)}
                        className="btn-primary text-xs px-4 py-2 flex items-center gap-1.5"
                      >
                        <Plus size={13} />
                        Add Medicine
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((med) => (
                  <MedicineRow
                    key={med.id}
                    medicine={med}
                    visibleColumns={visibleColumns}
                    selected={selectedRows.has(med.id)}
                    onSelect={() => handleRowSelect(med.id)}
                    onEdit={() => { setEditingMedicine(med); setAddModalOpen(true); }}
                    onDelete={() => handleDelete(med)}
                    onStatusChange={handleStatusChange}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Show</span>
            <select
              value={itemsPerPage}
              onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
              className="border border-slate-200 rounded-lg px-2 py-1 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
            >
              {[10, 25, 50].map((n) => (
                <option key={`per-page-${n}`} value={n}>{n}</option>
              ))}
            </select>
            <span>per page · {filtered.length} total results</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={15} className="text-slate-600" />
            </button>

            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const page = i + 1;
              return (
                <button
                  key={`page-${page}`}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                    currentPage === page
                      ? 'bg-teal-700 text-white' :'hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  {page}
                </button>
              );
            })}

            {totalPages > 5 && (
              <span className="text-xs text-slate-400 px-1">...</span>
            )}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={15} className="text-slate-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {addModalOpen && (
        <AddMedicineModal
          medicine={editingMedicine}
          onClose={() => { setAddModalOpen(false); setEditingMedicine(null); }}
          onSubmit={handleAddOrEdit}
        />
      )}
      {deleteTarget && (
        <DeleteConfirmModal
          medicineName={deleteTarget.name}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}

function MedicineRow({
  medicine,
  visibleColumns,
  selected,
  onSelect,
  onEdit,
  onDelete,
  onStatusChange,
}: {
  medicine: Medicine;
  visibleColumns: Set<string>;
  selected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (id: string, s: Medicine['status']) => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <tr
      className={`table-row ${selected ? 'bg-teal-50/40' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <td className="px-4 py-3">
        <input
          type="checkbox"
          checked={selected}
          onChange={onSelect}
          className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
        />
      </td>

      {visibleColumns.has('col-name') && (
        <td className="table-cell">
          <div>
            <p className="font-semibold text-slate-800 text-sm">{medicine.name}</p>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{medicine.id}</p>
          </div>
        </td>
      )}
      {visibleColumns.has('col-generic') && (
        <td className="table-cell text-slate-500">{medicine.genericName}</td>
      )}
      {visibleColumns.has('col-category') && (
        <td className="table-cell">
          <span className="badge bg-blue-50 text-blue-700 border border-blue-200">
            {medicine.category}
          </span>
        </td>
      )}
      {visibleColumns.has('col-manufacturer') && (
        <td className="table-cell text-slate-600 text-xs">{medicine.manufacturer}</td>
      )}
      {visibleColumns.has('col-batches') &&(
        <td className="table-cell">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-sm tabular-nums text-slate-700">{medicine.batchCount}</span>
            {medicine.batchCount > 0 && (
              <span className="text-xs text-slate-400">batches</span>
            )}
          </div>
        </td>
      )}
      {visibleColumns.has('col-stock') && (
        <td className="table-cell">
          <StockBar qty={medicine.stockQty} reorder={medicine.reorderLevel} />
        </td>
      )}
      {visibleColumns.has('col-reorder') && (
        <td className="table-cell">
          <span className="font-mono text-sm tabular-nums text-slate-500">{medicine.reorderLevel}</span>
        </td>
      )}
      {visibleColumns.has('col-unitprice') && (
        <td className="table-cell">
          <span className="font-mono text-sm tabular-nums text-slate-700">${medicine.unitPrice.toFixed(2)}</span>
        </td>
      )}
      {visibleColumns.has('col-costprice') && (
        <td className="table-cell">
          <span className="font-mono text-sm tabular-nums text-slate-500">${medicine.costPrice.toFixed(2)}</span>
        </td>
      )}
      {visibleColumns.has('col-supplier') && (
        <td className="table-cell text-xs text-slate-500 max-w-[140px] truncate">{medicine.supplier}</td>
      )}
      {visibleColumns.has('col-status') && (
        <td className="table-cell">
          <StatusBadge
            status={medicine.status}
            medicineId={medicine.id}
            onStatusChange={onStatusChange}
          />
        </td>
      )}

      {/* Actions */}
      <td className="table-cell text-right">
        <div className={`flex items-center justify-end gap-1 transition-opacity duration-150 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
          <button
            onClick={onEdit}
            title="Edit medicine"
            className="p-1.5 rounded-lg hover:bg-teal-50 text-slate-400 hover:text-teal-600 transition-colors"
          >
            <Pencil size={14} />
          </button>
          <button
            title="View batches"
            className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors"
          >
            <Eye size={14} />
          </button>
          <button
            onClick={onDelete}
            title="Delete medicine — this cannot be undone"
            className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}