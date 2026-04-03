'use client';

import React from 'react';
import { Clock, AlertTriangle, ChevronRight } from 'lucide-react';

const expiryAlerts = [
  {
    id: 'batch-exp-001',
    medicine: 'Amoxicillin 500mg',
    batchNo: 'AMX-2024-B14',
    expiryDate: 'Apr 14, 2026',
    daysLeft: 12,
    qty: 240,
    severity: 'critical',
  },
  {
    id: 'batch-exp-002',
    medicine: 'Metronidazole 400mg',
    batchNo: 'MTZ-2024-C08',
    expiryDate: 'Apr 18, 2026',
    daysLeft: 16,
    qty: 180,
    severity: 'critical',
  },
  {
    id: 'batch-exp-003',
    medicine: 'Ciprofloxacin 250mg',
    batchNo: 'CIP-2025-A03',
    expiryDate: 'Apr 22, 2026',
    daysLeft: 20,
    qty: 96,
    severity: 'warning',
  },
  {
    id: 'batch-exp-004',
    medicine: 'Ranitidine 150mg',
    batchNo: 'RAN-2025-D11',
    expiryDate: 'Apr 25, 2026',
    daysLeft: 23,
    qty: 320,
    severity: 'warning',
  },
  {
    id: 'batch-exp-005',
    medicine: 'Ibuprofen 400mg',
    batchNo: 'IBU-2025-B07',
    expiryDate: 'Apr 28, 2026',
    daysLeft: 26,
    qty: 144,
    severity: 'warning',
  },
  {
    id: 'batch-exp-006',
    medicine: 'Paracetamol 500mg',
    batchNo: 'PCM-2025-C19',
    expiryDate: 'May 2, 2026',
    daysLeft: 30,
    qty: 480,
    severity: 'info',
  },
];

export default function ExpiryAlertList() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden h-full">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-semibold text-slate-800 flex items-center gap-2">
            <AlertTriangle size={15} className="text-amber-500" />
            Expiry Alerts
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Batches expiring within 30 days</p>
        </div>
        <span className="badge badge-low-stock">{expiryAlerts?.length}</span>
      </div>
      <ul className="divide-y divide-slate-50 max-h-[340px] overflow-y-auto scrollbar-thin">
        {expiryAlerts?.map((alert) => (
          <li
            key={alert?.id}
            className="px-5 py-3.5 hover:bg-slate-50 cursor-pointer transition-colors group"
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                  alert?.severity === 'critical' ?'bg-red-500'
                    : alert?.severity === 'warning' ?'bg-amber-500' :'bg-teal-400'
                }`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{alert?.medicine}</p>
                <p className="text-xs font-mono text-slate-400 mt-0.5">{alert?.batchNo}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <div className="flex items-center gap-1 text-xs">
                    <Clock size={11} className={
                      alert?.severity === 'critical' ? 'text-red-500' : 'text-amber-500'
                    } />
                    <span
                      className={`font-semibold ${
                        alert?.severity === 'critical' ?'text-red-600'
                          : alert?.severity === 'warning' ?'text-amber-600' :'text-slate-500'
                      }`}
                    >
                      {alert?.daysLeft}d left
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">{alert?.expiryDate}</span>
                  <span className="text-xs text-slate-400 font-mono">{alert?.qty} units</span>
                </div>
              </div>
              <ChevronRight
                size={14}
                className="text-slate-300 group-hover:text-slate-500 transition-colors flex-shrink-0 mt-1"
              />
            </div>
          </li>
        ))}
      </ul>
      <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50">
        <button className="text-xs text-teal-600 font-medium hover:text-teal-700 transition-colors w-full text-center">
          View all expiring batches →
        </button>
      </div>
    </div>
  );
}