'use client';

import React, { useState, useRef, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { getUserRole } from '@/lib/permissions';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { 
  ShoppingCart, Search, Plus, Minus, CreditCard, Banknote, 
  Smartphone, X, CheckCircle, Printer, FileText, User, Clock,
  AlertCircle, Package, DollarSign, Loader2
} from 'lucide-react';

interface Medicine {
  id: string;
  name: string;
  generic: string;
  price: number;
  stock: number;
  category: string;
  type: 'medicine' | 'product';
}

interface CartItem extends Medicine {
  quantity: number;
}

interface PendingOrder {
  id: string;
  orderNumber: string;
  createdAt: string;
  createdBy: string;
  customerName: string;
  customerPhone: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  status: 'pending' | 'completed';
  completedBy?: string;
  completedAt?: string;
  paymentMethod?: 'cash' | 'card' | 'mobile';
}

const paymentMethods = [
  { id: 'cash', label: 'Cash', icon: <Banknote size={18} /> },
  { id: 'card', label: 'Card', icon: <CreditCard size={18} /> },
  { id: 'mobile', label: 'Mobile', icon: <Smartphone size={18} /> },
];

// Mock pending orders - in real app, fetch from database
const mockPendingOrders: PendingOrder[] = [
  {
    id: 'ord1',
    orderNumber: 'ORD-001',
    createdAt: new Date().toISOString(),
    createdBy: 'Tigist Bekele (Pharmacist)',
    customerName: 'Abebe Kebede',
    customerPhone: '+251-911-234567',
    items: [
      { id: 'm1', name: 'Paracetamol 500mg', generic: 'Acetaminophen', price: 12.5, stock: 240, category: 'Analgesic', quantity: 2 },
      { id: 'm2', name: 'Amoxicillin 250mg', generic: 'Amoxicillin', price: 45.0, stock: 120, category: 'Antibiotic', quantity: 1 },
    ],
    subtotal: 70.0,
    discount: 0,
    total: 70.0,
    status: 'pending'
  },
  {
    id: 'ord2',
    orderNumber: 'ORD-002',
    createdAt: new Date(Date.now() - 300000).toISOString(),
    createdBy: 'Tigist Bekele (Pharmacist)',
    customerName: 'Meron Tesfaye',
    customerPhone: '+251-911-345678',
    items: [
      { id: 'm3', name: 'Metformin 500mg', generic: 'Metformin HCl', price: 28.0, stock: 180, category: 'Antidiabetic', quantity: 3 },
    ],
    subtotal: 84.0,
    discount: 8.4,
    total: 75.6,
    status: 'pending'
  },
];

export default function SalesPage() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const role = getUserRole();
    setUserRole(role);
  }, []);

  if (!mounted) {
    return <AppLayout><div className="p-6">Loading...</div></AppLayout>;
  }

  // Cashiers see pending orders view
  if (userRole === 'cashier') {
    return <CashierView />;
  }

  // Pharmacists and admins see order creation view
  return <PharmacistView />;
}

// Pharmacist View - Create Orders
function PharmacistView() {
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<'all' | 'medicine' | 'product'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Load medicines and products on mount
  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      setLoading(true);
      
      // Fetch both medicines and products in parallel
      const [medicinesResponse, productsResponse] = await Promise.all([
        api.getMedicines().catch(() => ({ medicines: [] })),
        api.getProducts().catch(() => ({ products: [] }))
      ]);

      const medicinesData = medicinesResponse.medicines || medicinesResponse || [];
      const productsData = productsResponse.products || productsResponse || [];

      // Map medicines
      const mappedMedicines: Medicine[] = medicinesData.map((m: any) => ({
        id: m._id,
        name: m.name,
        generic: m.genericName || m.name,
        price: m.unitPrice || 0,
        stock: m.stockQty || m.stock || 0,
        category: m.category,
        type: 'medicine' as const
      }));

      // Map products
      const mappedProducts: Medicine[] = productsData.map((p: any) => ({
        id: p._id,
        name: p.name,
        generic: p.name,
        price: p.unitPrice || p.price || 0,
        stock: p.currentStock || p.stock || 0,
        category: p.category,
        type: 'product' as const
      }));

      // Combine and filter out items with no stock
      const allItems = [...mappedMedicines, ...mappedProducts].filter(item => item.stock > 0);
      setMedicines(allItems);
      
      console.log(`Loaded ${mappedMedicines.length} medicines and ${mappedProducts.length} products for POS`);
    } catch (error) {
      console.error('Failed to load inventory:', error);
      toast.error('Failed to load inventory data');
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories
  const categories = React.useMemo(() => {
    const cats = new Set(medicines.map(m => m.category));
    return ['all', ...Array.from(cats).sort()];
  }, [medicines]);

  const filtered = medicines.filter(
    (m) => {
      const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.generic.toLowerCase().includes(search.toLowerCase()) ||
        m.category.toLowerCase().includes(search.toLowerCase());
      
      const matchType = typeFilter === 'all' || m.type === typeFilter;
      const matchCategory = categoryFilter === 'all' || m.category === categoryFilter;
      
      return matchSearch && matchType && matchCategory;
    }
  );

  const addToCart = (medicine: Medicine) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === medicine.id);
      if (existing) {
        return prev.map((i) =>
          i.id === medicine.id && i.quantity < medicine.stock
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...medicine, quantity: 1 }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;

  const handleSaveOrder = async () => {
    if (cart.length === 0) {
      alert('Please add items to cart');
      return;
    }
    if (!customerName) {
      alert('Please enter customer name');
      return;
    }

    try {
      // Save order to database
      const { api } = await import('@/lib/api');
      await api.createOrder({
        customerName,
        customerPhone,
        items: cart.map(item => ({
          medicineId: item.id,
          name: item.name,
          generic: item.generic,
          price: item.price,
          quantity: item.quantity,
          category: item.category
        })),
        subtotal,
        discount: discountAmount,
        total,
      });

      alert('Order saved successfully! Cashier can now complete the payment.');
      
      // Reset form
      setCart([]);
      setCustomerName('');
      setCustomerPhone('');
      setDiscount(0);
    } catch (error: any) {
      console.error('Failed to save order:', error);
      alert('Failed to save order: ' + (error.message || 'Unknown error'));
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Sales / POS - Pharmacist</h1>
            <p className="text-sm text-slate-500 mt-0.5">Prepare orders for customers - Cashier will complete payment</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-teal-600 bg-teal-50 border border-teal-200 px-3 py-1.5 rounded-full font-medium">
            <Package size={13} />
            Order Preparation
          </div>
        </div>

        <div className="flex gap-5 flex-1 min-h-0">
          {/* Medicine Catalog */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="relative mb-3">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search medicines and products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="text-xs font-medium text-slate-600">Type:</span>
              <button
                onClick={() => setTypeFilter('all')}
                className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                  typeFilter === 'all'
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setTypeFilter('medicine')}
                className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                  typeFilter === 'medicine'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Medicines
              </button>
              <button
                onClick={() => setTypeFilter('product')}
                className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                  typeFilter === 'product'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Products
              </button>

              <span className="text-xs font-medium text-slate-600 ml-4">Category:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-1 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-slate-700"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>

              <span className="text-xs text-slate-400 ml-auto">
                {filtered.length} items
              </span>
            </div>

            <div className="grid grid-cols-2 xl:grid-cols-3 gap-3 overflow-y-auto pr-1 flex-1">
              {loading ? (
                <div className="col-span-full flex flex-col items-center justify-center py-12">
                  <Loader2 size={32} className="animate-spin text-teal-600 mb-2" />
                  <p className="text-sm text-slate-500">Loading inventory...</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-12">
                  <Package size={32} className="text-slate-300 mb-2" />
                  <p className="text-sm text-slate-500">
                    {search ? 'No items match your search' : 'No items available'}
                  </p>
                </div>
              ) : (
                filtered.map((med) => {
                  const inCart = cart.find((i) => i.id === med.id);
                  return (
                    <button
                      key={med.id}
                      onClick={() => addToCart(med)}
                      className={`text-left p-3.5 rounded-xl border transition-all ${
                        inCart ? 'border-teal-400 bg-teal-50' : 'border-slate-200 bg-white hover:border-teal-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <p className="text-sm font-semibold text-slate-800">{med.name}</p>
                        {inCart && (
                          <span className="w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {inCart.quantity}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mb-2">{med.generic}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{med.category}</span>
                        <span className="text-sm font-bold text-teal-700">Br {med.price.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-slate-400">Stock: {med.stock}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${med.type === 'medicine' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                          {med.type === 'medicine' ? 'Medicine' : 'Product'}
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Cart */}
          <div className="w-80 flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="px-4 py-3.5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart size={16} className="text-teal-600" />
                <span className="font-semibold text-slate-800 text-sm">Order Cart</span>
              </div>
              <span className="text-xs bg-teal-100 text-teal-700 font-semibold px-2 py-0.5 rounded-full">
                {cart.reduce((s, i) => s + i.quantity, 0)} items
              </span>
            </div>

            <div className="px-4 pt-3 pb-2 space-y-2">
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Customer name *"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <input
                type="tel"
                placeholder="Phone number (optional)"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-slate-300">
                  <ShoppingCart size={28} className="mb-2" />
                  <p className="text-xs">Cart is empty</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 py-2 border-b border-slate-50">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-800 truncate">{item.name}</p>
                      <p className="text-xs text-slate-400">Br {item.price.toFixed(2)} each</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateQty(item.id, -1)}
                        className="w-6 h-6 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-100"
                      >
                        <Minus size={10} />
                      </button>
                      <span className="w-6 text-center text-xs font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQty(item.id, 1)}
                        className="w-6 h-6 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-100"
                      >
                        <Plus size={10} />
                      </button>
                    </div>
                    <div className="text-right min-w-[48px]">
                      <p className="text-xs font-semibold">Br {(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-red-400">
                      <X size={13} />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-slate-100 px-4 py-3 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Subtotal</span>
                <span>Br {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Discount</span>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={discount}
                  onChange={(e) => setDiscount(Math.min(100, Math.max(0, Number(e.target.value))))}
                  className="w-14 px-2 py-1 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 text-center"
                />
                <span className="text-xs text-slate-400">%</span>
                {discountAmount > 0 && (
                  <span className="ml-auto text-xs text-emerald-600">-Br {discountAmount.toFixed(2)}</span>
                )}
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <span className="text-sm font-bold text-slate-800">Total</span>
                <span className="text-base font-bold text-teal-700">Br {total.toFixed(2)}</span>
              </div>
            </div>

            <div className="px-4 pb-4">
              <button
                onClick={handleSaveOrder}
                disabled={cart.length === 0 || !customerName}
                className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <FileText size={16} />
                Save Order for Cashier
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

// Cashier View - Complete Orders
function CashierView() {
  const [allOrders, setAllOrders] = useState<PendingOrder[]>([]);
  const [statusFilter, setStatusFilter] = useState<'pending' | 'completed' | 'all'>('pending');
  const [selectedOrder, setSelectedOrder] = useState<PendingOrder | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [amountReceived, setAmountReceived] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUserName, setCurrentUserName] = useState('');
  const receiptRef = useRef<HTMLDivElement>(null);

  // Load orders on mount
  useEffect(() => {
    loadOrders();
    // Get current user name from localStorage
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      setCurrentUserName(userData.fullName || '');
    }
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const { api } = await import('@/lib/api');
      
      // Fetch both pending and completed orders
      const [pendingResponse, completedResponse] = await Promise.all([
        api.getPendingOrders(),
        api.getOrders({ status: 'completed' })
      ]);
      
      const pendingOrders = pendingResponse.orders || [];
      const completedOrders = completedResponse.orders || [];
      
      // Combine and map to PendingOrder format
      const allOrdersData = [...pendingOrders, ...completedOrders].map((order: any) => ({
        id: order._id,
        orderNumber: order.orderNumber,
        createdAt: order.createdAt,
        createdBy: `${order.createdBy} (${order.createdByRole})`,
        customerName: order.customerName,
        customerPhone: order.customerPhone || '',
        items: order.items.map((item: any) => ({
          id: item.medicineId,
          name: item.name,
          generic: item.generic || '',
          price: item.price,
          stock: 0,
          category: item.category || '',
          quantity: item.quantity
        })),
        subtotal: order.subtotal,
        discount: order.discount,
        total: order.total,
        status: order.status,
        completedBy: order.completedBy,
        completedAt: order.completedAt,
        paymentMethod: order.paymentMethod
      }));
      
      setAllOrders(allOrdersData);
    } catch (error) {
      console.error('Failed to load orders:', error);
      setAllOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter orders based on status
  const filteredOrders = allOrders.filter(order => {
    if (statusFilter === 'all') return true;
    return order.status === statusFilter;
  });

  const pendingCount = allOrders.filter(o => o.status === 'pending').length;
  const completedCount = allOrders.filter(o => o.status === 'completed').length;

  // Calculate cashier's performance metrics for today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const myCompletedOrdersToday = allOrders.filter(order => {
    if (order.status !== 'completed' || !order.completedBy || !order.completedAt) return false;
    const completedDate = new Date(order.completedAt);
    return completedDate >= today && order.completedBy === currentUserName;
  });

  const myTotalSalesToday = myCompletedOrdersToday.reduce((sum, order) => sum + order.total, 0);
  const myTransactionsToday = myCompletedOrdersToday.length;
  const myCashCollected = myCompletedOrdersToday
    .filter(order => order.paymentMethod === 'cash')
    .reduce((sum, order) => sum + order.total, 0);

  const changeAmount = amountReceived ? parseFloat(amountReceived) - (selectedOrder?.total || 0) : 0;

  const handleSelectOrder = (order: PendingOrder) => {
    setSelectedOrder(order);
    setShowPaymentModal(true);
    setPaymentMethod('cash');
    setAmountReceived('');
  };

  const handleCompleteSale = async () => {
    if (paymentMethod === 'cash' && (!amountReceived || parseFloat(amountReceived) < (selectedOrder?.total || 0))) {
      alert('Please enter amount received');
      return;
    }

    if (!selectedOrder) return;

    try {
      // Complete the sale in database
      const { api } = await import('@/lib/api');
      await api.completeOrder(selectedOrder.id, {
        paymentMethod,
        amountReceived: paymentMethod === 'cash' ? parseFloat(amountReceived) : selectedOrder.total,
        change: paymentMethod === 'cash' ? changeAmount : 0
      });

      alert('Sale completed successfully!');
      
      // Reload orders
      await loadOrders();
      
      setShowPaymentModal(false);
      setSelectedOrder(null);
      setAmountReceived('');
    } catch (error: any) {
      console.error('Failed to complete sale:', error);
      alert('Failed to complete sale: ' + (error.message || 'Unknown error'));
    }
  };

  const handlePrintReceipt = () => {
    const printWindow = window.open('', '', 'width=800,height=600');
    if (printWindow && receiptRef.current) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Receipt</title>
            <style>
              body { font-family: monospace; padding: 20px; }
              .receipt { max-width: 300px; margin: 0 auto; }
            </style>
          </head>
          <body>${receiptRef.current.innerHTML}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const getTimeAgo = (dateString: string) => {
    const minutes = Math.floor((Date.now() - new Date(dateString).getTime()) / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <AppLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Sales / POS - Cashier</h1>
            <p className="text-sm text-slate-500 mt-0.5">Complete orders prepared by pharmacists</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full font-medium">
              <Clock size={13} />
              {pendingCount} Pending
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full font-medium">
              <CheckCircle size={13} />
              {completedCount} Completed
            </div>
          </div>
        </div>

        {/* Cashier Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-teal-50 to-teal-100 border border-teal-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center">
                <DollarSign size={20} className="text-white" />
              </div>
              <span className="text-xs font-semibold text-teal-700 bg-teal-200 px-2 py-1 rounded-full">TODAY</span>
            </div>
            <p className="text-sm font-semibold text-teal-700 uppercase tracking-wide mb-1">Total Sales</p>
            <p className="text-3xl font-bold text-teal-900">Br {myTotalSalesToday.toFixed(2)}</p>
            <p className="text-xs text-teal-600 mt-1">Your completed transactions</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <ShoppingCart size={20} className="text-white" />
              </div>
              <span className="text-xs font-semibold text-blue-700 bg-blue-200 px-2 py-1 rounded-full">TODAY</span>
            </div>
            <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide mb-1">Transactions</p>
            <p className="text-3xl font-bold text-blue-900">{myTransactionsToday}</p>
            <p className="text-xs text-blue-600 mt-1">Orders you completed</p>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                <Banknote size={20} className="text-white" />
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-200 px-2 py-1 rounded-full">CASH</span>
            </div>
            <p className="text-sm font-semibold text-emerald-700 uppercase tracking-wide mb-1">Cash Collected</p>
            <p className="text-3xl font-bold text-emerald-900">Br {myCashCollected.toFixed(2)}</p>
            <p className="text-xs text-emerald-600 mt-1">Cash payments received</p>
          </div>
        </div>
        {/* Status Filter */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-sm font-medium text-slate-600">Filter:</span>
          <div className="flex gap-2">
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                statusFilter === 'pending'
                  ? 'bg-amber-100 text-amber-700 border border-amber-300'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                statusFilter === 'completed'
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Completed ({completedCount})
            </button>
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                statusFilter === 'all'
                  ? 'bg-teal-100 text-teal-700 border border-teal-300'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              All Orders ({allOrders.length})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Clock size={32} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Loading Orders...</h3>
            <p className="text-sm text-slate-500">Please wait while we fetch orders</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              {statusFilter === 'pending' ? 'No Pending Orders' : statusFilter === 'completed' ? 'No Completed Orders' : 'No Orders'}
            </h3>
            <p className="text-sm text-slate-500">
              {statusFilter === 'pending' 
                ? 'All orders have been completed. New orders will appear here.' 
                : statusFilter === 'completed'
                ? 'No orders have been completed yet.'
                : 'No orders found.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{order.orderNumber}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{getTimeAgo(order.createdAt)}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    order.status === 'pending' 
                      ? 'bg-amber-100 text-amber-700'
                      : order.status === 'completed'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {order.status === 'pending' ? 'Pending' : order.status === 'completed' ? 'Completed' : order.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <User size={14} className="text-slate-400" />
                    <span className="font-medium text-slate-700">{order.customerName}</span>
                  </div>
                  {order.customerPhone && (
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="ml-5">{order.customerPhone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Package size={14} className="text-slate-400" />
                    <span>{order.items.length} items · {order.items.reduce((s, i) => s + i.quantity, 0)} units</span>
                  </div>
                  <div className="text-xs text-slate-400">
                    Prepared by: {order.createdBy}
                  </div>
                  {order.status === 'completed' && order.completedBy && (
                    <div className="text-xs text-emerald-600">
                      Completed by: {order.completedBy}
                    </div>
                  )}
                  {order.status === 'completed' && order.paymentMethod && (
                    <div className="text-xs text-slate-500">
                      Payment: {order.paymentMethod.toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                  <span className="text-sm text-slate-600">Total Amount</span>
                  <span className="text-xl font-bold text-teal-700">Br {order.total.toFixed(2)}</span>
                </div>

                {order.status === 'pending' ? (
                  <button 
                    onClick={() => handleSelectOrder(order)}
                    className="w-full mt-3 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg transition-colors"
                  >
                    Complete Payment
                  </button>
                ) : (
                  <button 
                    onClick={() => handleSelectOrder(order)}
                    className="w-full mt-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-semibold rounded-lg transition-colors"
                  >
                    View Receipt
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  {selectedOrder.status === 'completed' ? 'Order Receipt' : 'Complete Sale'} - {selectedOrder.orderNumber}
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  {selectedOrder.status === 'completed' ? 'View order details and receipt' : 'Receive payment and print receipt'}
                </p>
              </div>
              <button onClick={() => setShowPaymentModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X size={20} className="text-slate-500" />
              </button>
            </div>

            <div className="p-6">
              <div ref={receiptRef} className="bg-white border-2 border-slate-200 rounded-xl p-6 font-mono text-sm mb-4">
                <div className="text-center border-b-2 border-dashed border-slate-300 pb-4 mb-4">
                  <h3 className="text-lg font-bold">PharmaCare Central</h3>
                  <p className="text-xs text-slate-600 mt-1">Bole Road, Addis Ababa</p>
                  <p className="text-xs text-slate-600">Tel: +251-911-123456</p>
                </div>

                <div className="space-y-1 mb-4 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Order:</span>
                    <span className="font-semibold">{selectedOrder.orderNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Customer:</span>
                    <span>{selectedOrder.customerName}</span>
                  </div>
                  {selectedOrder.customerPhone && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Phone:</span>
                      <span>{selectedOrder.customerPhone}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-600">Prepared by:</span>
                    <span>{selectedOrder.createdBy}</span>
                  </div>
                </div>

                <div className="border-t-2 border-dashed border-slate-300 pt-3 mb-3">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left pb-2">Item</th>
                        <th className="text-center pb-2">Qty</th>
                        <th className="text-right pb-2">Price</th>
                        <th className="text-right pb-2">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map((item, idx) => (
                        <tr key={idx} className="border-b border-slate-100">
                          <td className="py-2">{item.name}</td>
                          <td className="text-center py-2">{item.quantity}</td>
                          <td className="text-right py-2">{item.price.toFixed(2)}</td>
                          <td className="text-right py-2">{(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="border-t-2 border-dashed border-slate-300 pt-3 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>Br {selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Discount:</span>
                      <span>-Br {selectedOrder.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-base pt-2 border-t border-slate-200">
                    <span>TOTAL:</span>
                    <span>Br {selectedOrder.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment:</span>
                    <span className="uppercase">{paymentMethod}</span>
                  </div>
                  {paymentMethod === 'cash' && amountReceived && (
                    <>
                      <div className="flex justify-between">
                        <span>Received:</span>
                        <span>Br {parseFloat(amountReceived).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span>Change:</span>
                        <span>Br {changeAmount.toFixed(2)}</span>
                      </div>
                    </>
                  )}
                </div>

                <div className="text-center mt-6 pt-4 border-t-2 border-dashed border-slate-300 text-xs text-slate-600">
                  <p>Thank you for your purchase!</p>
                </div>
              </div>

              {/* Payment Method Selection */}
              {selectedOrder.status === 'pending' && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-slate-700 mb-2">Payment Method</p>
                  <div className="grid grid-cols-3 gap-2">
                    {paymentMethods.map((pm) => (
                      <button
                        key={pm.id}
                        onClick={() => setPaymentMethod(pm.id)}
                        className={`flex flex-col items-center gap-2 py-3 rounded-lg border text-sm font-medium transition-all ${
                          paymentMethod === pm.id
                            ? 'border-teal-500 bg-teal-50 text-teal-700'
                            : 'border-slate-200 text-slate-500 hover:border-teal-300'
                        }`}
                      >
                        {pm.icon}
                        {pm.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Cash Payment Input */}
              {selectedOrder.status === 'pending' && paymentMethod === 'cash' && (
                <div className="p-4 bg-slate-50 rounded-xl">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Amount Received (Cash)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min={selectedOrder.total}
                    value={amountReceived}
                    onChange={(e) => setAmountReceived(e.target.value)}
                    placeholder={`Minimum: Br ${selectedOrder.total.toFixed(2)}`}
                    className="w-full px-4 py-3 text-lg font-semibold border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  {amountReceived && parseFloat(amountReceived) >= selectedOrder.total && (
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span className="text-slate-600">Change to return:</span>
                      <span className="text-lg font-bold text-teal-700">Br {changeAmount.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 p-6 border-t border-slate-200 bg-slate-50">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 font-medium rounded-xl hover:bg-white transition-colors"
              >
                {selectedOrder.status === 'completed' ? 'Close' : 'Cancel'}
              </button>
              <button
                onClick={handlePrintReceipt}
                className="flex-1 px-4 py-3 bg-slate-600 text-white font-medium rounded-xl hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
              >
                <Printer size={16} />
                Print Receipt
              </button>
              {selectedOrder.status === 'pending' && (
                <button
                  onClick={handleCompleteSale}
                  disabled={paymentMethod === 'cash' && (!amountReceived || parseFloat(amountReceived) < selectedOrder.total)}
                  className="flex-1 px-4 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle size={16} />
                  Complete Sale
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
