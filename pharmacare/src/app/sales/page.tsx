'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { ShoppingCart, Search, Plus, Minus, CreditCard, Banknote, Smartphone, X, CheckCircle } from 'lucide-react';

interface Medicine {
  id: string;
  name: string;
  generic: string;
  price: number;
  stock: number;
  category: string;
}

interface CartItem extends Medicine {
  quantity: number;
}

const medicines: Medicine[] = [
  { id: 'm1', name: 'Paracetamol 500mg', generic: 'Acetaminophen', price: 12.5, stock: 240, category: 'Analgesic' },
  { id: 'm2', name: 'Amoxicillin 250mg', generic: 'Amoxicillin', price: 45.0, stock: 120, category: 'Antibiotic' },
  { id: 'm3', name: 'Metformin 500mg', generic: 'Metformin HCl', price: 28.0, stock: 180, category: 'Antidiabetic' },
  { id: 'm4', name: 'Atorvastatin 10mg', generic: 'Atorvastatin', price: 62.0, stock: 95, category: 'Statin' },
  { id: 'm5', name: 'Omeprazole 20mg', generic: 'Omeprazole', price: 34.5, stock: 150, category: 'Antacid' },
  { id: 'm6', name: 'Cetirizine 10mg', generic: 'Cetirizine HCl', price: 18.0, stock: 200, category: 'Antihistamine' },
  { id: 'm7', name: 'Azithromycin 500mg', generic: 'Azithromycin', price: 85.0, stock: 60, category: 'Antibiotic' },
  { id: 'm8', name: 'Ibuprofen 400mg', generic: 'Ibuprofen', price: 22.0, stock: 175, category: 'NSAID' },
  { id: 'm9', name: 'Losartan 50mg', generic: 'Losartan Potassium', price: 55.0, stock: 110, category: 'Antihypertensive' },
  { id: 'm10', name: 'Vitamin D3 1000IU', generic: 'Cholecalciferol', price: 40.0, stock: 300, category: 'Supplement' },
  { id: 'm11', name: 'Pantoprazole 40mg', generic: 'Pantoprazole', price: 48.0, stock: 130, category: 'Antacid' },
  { id: 'm12', name: 'Montelukast 10mg', generic: 'Montelukast Sodium', price: 72.0, stock: 85, category: 'Antiasthmatic' },
];

const paymentMethods = [
  { id: 'cash', label: 'Cash', icon: <Banknote size={18} /> },
  { id: 'card', label: 'Card', icon: <CreditCard size={18} /> },
  { id: 'upi', label: 'UPI', icon: <Smartphone size={18} /> },
];

export default function SalesPage() {
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [discount, setDiscount] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const filtered = medicines.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.generic.toLowerCase().includes(search.toLowerCase()) ||
      m.category.toLowerCase().includes(search.toLowerCase())
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

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setCart([]);
      setCustomerName('');
      setDiscount(0);
      setPaymentMethod('cash');
    }, 2500);
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-full">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Sales / POS</h1>
            <p className="text-sm text-slate-500 mt-0.5">Point of Sale — process customer transactions</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-teal-600 bg-teal-50 border border-teal-200 px-3 py-1.5 rounded-full font-medium">
            <ShoppingCart size={13} />
            Counter Active
          </div>
        </div>

        <div className="flex gap-5 flex-1 min-h-0">
          {/* Left: Medicine Catalog */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Search */}
            <div className="relative mb-4">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search medicines by name, generic or category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
              />
            </div>

            {/* Medicine Grid */}
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-3 overflow-y-auto pr-1 flex-1">
              {filtered.map((med) => {
                const inCart = cart.find((i) => i.id === med.id);
                return (
                  <button
                    key={med.id}
                    onClick={() => addToCart(med)}
                    className={`text-left p-3.5 rounded-xl border transition-all duration-150 hover:shadow-md ${
                      inCart
                        ? 'border-teal-400 bg-teal-50 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-teal-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <p className="text-sm font-semibold text-slate-800 leading-tight">{med.name}</p>
                      {inCart && (
                        <span className="flex-shrink-0 w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {inCart.quantity}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mb-2">{med.generic}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{med.category}</span>
                      <span className="text-sm font-bold text-teal-700">Br {med.price.toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1.5">Stock: {med.stock} units</p>
                  </button>
                );
              })}
              {filtered.length === 0 && (
                <div className="col-span-3 flex flex-col items-center justify-center py-16 text-slate-400">
                  <Search size={32} className="mb-3 opacity-40" />
                  <p className="text-sm">No medicines found for &quot;{search}&quot;</p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Cart & Billing */}
          <div className="w-80 flex-shrink-0 flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden">
            {/* Cart Header */}
            <div className="px-4 py-3.5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart size={16} className="text-teal-600" />
                <span className="font-semibold text-slate-800 text-sm">Cart</span>
              </div>
              <span className="text-xs bg-teal-100 text-teal-700 font-semibold px-2 py-0.5 rounded-full">
                {cart.reduce((s, i) => s + i.quantity, 0)} items
              </span>
            </div>

            {/* Customer Name */}
            <div className="px-4 pt-3 pb-2">
              <input
                type="text"
                placeholder="Customer name (optional)"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-slate-300">
                  <ShoppingCart size={28} className="mb-2" />
                  <p className="text-xs">Cart is empty</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 py-2 border-b border-slate-50 last:border-0">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-800 truncate">{item.name}</p>
                      <p className="text-xs text-slate-400">Br {item.price.toFixed(2)} each</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateQty(item.id, -1)}
                        className="w-6 h-6 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors"
                      >
                        <Minus size={10} />
                      </button>
                      <span className="w-6 text-center text-xs font-semibold text-slate-700">{item.quantity}</span>
                      <button
                        onClick={() => updateQty(item.id, 1)}
                        className="w-6 h-6 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors"
                      >
                        <Plus size={10} />
                      </button>
                    </div>
                    <div className="text-right min-w-[48px]">
                      <p className="text-xs font-semibold text-slate-800">Br {(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-300 hover:text-red-400 transition-colors"
                    >
                      <X size={13} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Billing Summary */}
            <div className="border-t border-slate-100 px-4 py-3 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Subtotal</span>
                <span>Br {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 flex-shrink-0">Discount</span>
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

            {/* Payment Method */}
            <div className="px-4 pb-3">
              <p className="text-xs text-slate-500 mb-2 font-medium">Payment Method</p>
              <div className="grid grid-cols-3 gap-1.5">
                {paymentMethods.map((pm) => (
                  <button
                    key={pm.id}
                    onClick={() => setPaymentMethod(pm.id)}
                    className={`flex flex-col items-center gap-1 py-2 rounded-lg border text-xs font-medium transition-all ${
                      paymentMethod === pm.id
                        ? 'border-teal-500 bg-teal-50 text-teal-700' :'border-slate-200 text-slate-500 hover:border-teal-300'
                    }`}
                  >
                    {pm.icon}
                    {pm.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Checkout Button */}
            <div className="px-4 pb-4">
              <button
                onClick={handleCheckout}
                disabled={cart.length === 0}
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart size={16} />
                Checkout · Br {total.toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/20">
          <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-3 animate-fade-in">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
              <CheckCircle size={36} className="text-emerald-500" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Sale Completed!</h2>
            <p className="text-sm text-slate-500">Br {total.toFixed(2)} received via {paymentMethod.toUpperCase()}</p>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
