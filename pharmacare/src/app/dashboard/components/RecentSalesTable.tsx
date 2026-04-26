'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { ExternalLink, Receipt, Loader2 } from 'lucide-react';

const recentSales = [
  {
    id: 'inv-20260402-0091',
    customer: 'Mekdes Tadesse',
    items: 4,
    amount: 86.40,
    paymentMethod: 'Cash',
    status: 'completed',
    time: '16:52',
    prescriptionNo: 'Rx-2841',
  },
  {
    id: 'inv-20260402-0090',
    customer: 'Yohannes Kebede',
    items: 2,
    amount: 124.00,
    paymentMethod: 'Cash',
    status: 'completed',
    time: '16:38',
    prescriptionNo: null,
  },
  {
    id: 'inv-20260402-0089',
    customer: 'Selam Worku',
    items: 7,
    amount: 312.75,
    paymentMethod: 'Card',
    status: 'completed',
    time: '16:21',
    prescriptionNo: 'Rx-2840',
  },
  {
    id: 'inv-20260402-0088',
    customer: 'Getachew Alemu',
    items: 1,
    amount: 18.50,
    paymentMethod: 'Cash',
    status: 'completed',
    time: '16:09',
    prescriptionNo: null,
  },
  {
    id: 'inv-20260402-0087',
    customer: 'Bethlehem Assefa',
    items: 3,
    amount: 67.20,
    paymentMethod: 'Mobile Money',
    status: 'refunded',
    time: '15:54',
    prescriptionNo: null,
  },
  {
    id: 'inv-20260402-0086',
    customer: 'Tesfaye Mengistu',
    items: 5,
    amount: 203.90,
    paymentMethod: 'Card',
    status: 'completed',
    time: '15:41',
    prescriptionNo: 'Rx-2839',
  },
  {
    id: 'inv-20260402-0085',
    customer: 'Hiwot Desta',
    items: 2,
    amount: 44.60,
    paymentMethod: 'Cash',
    status: 'completed',
    time: '15:28',
    prescriptionNo: null,
  },
];

const statusBadge: Record<string, string> = {
  completed: 'badge badge-active',
  refunded: 'badge bg-slate-100 text-slate-500 border border-slate-200',
  pending: 'badge badge-low-stock',
};

const paymentBadge: Record<string, string> = {
  'Mobile Money': 'bg-purple-50 text-purple-700 border border-purple-200',
  Cash: 'bg-slate-100 text-slate-600 border border-slate-200',
  Card: 'bg-blue-50 text-blue-700 border border-blue-200',
};

export default function RecentSalesTable() {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSales();
  }, []);

  const loadSales = async () => {
    try {
      setLoading(true);
      const data = await api.getRecentSales();
      setSales(data.map((sale: any) => ({
        id: sale.invoiceNo || sale.id,
        customer: sale.customerName,
        items: sale.items,
        amount: sale.amount,
        paymentMethod: sale.paymentMethod,
        status: 'completed',
        time: new Date(sale.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
        prescriptionNo: null,
      })));
    } catch (error: any) {
      toast.error('Failed to load recent sales');
      setSales(recentSales);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-semibold text-slate-800">Recent Sales</h3>
            <p className="text-xs text-slate-400 mt-0.5">Today&apos;s counter transactions</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <Loader2 size={32} className="animate-spin text-teal-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-semibold text-slate-800">Recent Sales</h3>
          <p className="text-xs text-slate-400 mt-0.5">Today&apos;s counter transactions</p>
        </div>
        <button className="flex items-center gap-1.5 text-xs text-teal-600 font-medium hover:text-teal-700 transition-colors">
          View all
          <ExternalLink size={12} />
        </button>
      </div>

      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full min-w-[640px]">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="table-header">Invoice</th>
              <th className="table-header">Customer</th>
              <th className="table-header">Items</th>
              <th className="table-header">Amount</th>
              <th className="table-header">Payment</th>
              <th className="table-header">Status</th>
              <th className="table-header">Time</th>
              <th className="table-header w-10"></th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr
                key={sale.id}
                className="table-row cursor-pointer"
                onMouseEnter={() => setHoveredRow(sale.id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td className="table-cell">
                  <div className="flex items-center gap-2">
                    <Receipt size={13} className="text-slate-400 flex-shrink-0" />
                    <span className="font-mono text-xs text-slate-600">{sale.id}</span>
                  </div>
                  {sale.prescriptionNo && (
                    <p className="text-xs text-teal-600 font-mono mt-0.5 ml-5">
                      {sale.prescriptionNo}
                    </p>
                  )}
                </td>
                <td className="table-cell font-medium text-slate-800">{sale.customer}</td>
                <td className="table-cell">
                  <span className="font-mono text-slate-600">{sale.items}</span>
                </td>
                <td className="table-cell">
                  <span className="font-mono font-semibold text-slate-800 tabular-nums">
                    Br {sale.amount.toFixed(2)}
                  </span>
                </td>
                <td className="table-cell">
                  <span className={`badge text-xs ${paymentBadge[sale.paymentMethod]}`}>
                    {sale.paymentMethod}
                  </span>
                </td>
                <td className="table-cell">
                  <span className={statusBadge[sale.status]}>
                    {sale.status === 'completed' ? 'Paid' : sale.status === 'refunded' ? 'Refunded' : 'Pending'}
                  </span>
                </td>
                <td className="table-cell font-mono text-slate-500">{sale.time}</td>
                <td className="table-cell">
                  <button
                    className={`p-1.5 rounded-lg transition-all duration-150 ${
                      hoveredRow === sale.id
                        ? 'bg-teal-50 text-teal-600' :'text-transparent'
                    }`}
                    title="View invoice"
                  >
                    <ExternalLink size={13} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
        <p className="text-xs text-slate-500">
          Showing {sales.length} recent transactions
        </p>
        <p className="text-xs font-semibold text-slate-700 font-mono tabular-nums">
          Total: Br {sales.reduce((sum, s) => sum + s.amount, 0).toFixed(2)}
        </p>
      </div>
    </div>
  );
}