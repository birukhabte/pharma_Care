'use client';

import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, ChevronRight } from 'lucide-react';
import { api } from '@/lib/api';

export default function ExpiryAlertList() {
  const [expiryAlerts, setExpiryAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExpiryAlerts();
  }, []);

  const loadExpiryAlerts = async () => {
    try {
      const data = await api.getExpiryAlerts();
      setExpiryAlerts(data || []);
    } catch (error) {
      console.error('Failed to load expiry alerts:', error);
      setExpiryAlerts([]);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden h-full">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-semibold text-slate-800 flex items-center gap-2">
            <AlertTriangle size={15} className="text-amber-500" />
            Low Stock Alerts
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Medicines with stock below 100 units</p>
        </div>
        <span className="badge badge-low-stock">{expiryAlerts?.length}</span>
      </div>
      <ul className="divide-y divide-slate-50 max-h-[340px] overflow-y-auto scrollbar-thin">
        {loading ? (
          <li className="px-5 py-8 text-center text-xs text-slate-400">
            Loading stock alerts...
          </li>
        ) : expiryAlerts.length === 0 ? (
          <li className="px-5 py-8 text-center text-xs text-slate-400">
            No low stock items found
          </li>
        ) : (
          expiryAlerts?.map((alert) => {
            const isLowStock = alert?.stockQty < 100;
            const isCritical = alert?.stockQty < alert?.reorderLevel;
            const severity = isCritical ? 'critical' : isLowStock ? 'warning' : 'normal';
            
            return (
              <li
                key={alert?.id}
                className="px-5 py-3.5 hover:bg-slate-50 cursor-pointer transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                      severity === 'critical' ? 'bg-red-500'
                        : severity === 'warning' ? 'bg-amber-500' : 'bg-teal-400'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{alert?.medicineName}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{alert?.category || 'General'}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <div className="flex items-center gap-1 text-xs">
                        <AlertTriangle size={11} className={
                          severity === 'critical' ? 'text-red-500' : 'text-amber-500'
                        } />
                        <span
                          className={`font-semibold ${
                            severity === 'critical' ? 'text-red-600'
                              : severity === 'warning' ? 'text-amber-600' : 'text-slate-500'
                          }`}
                        >
                          {alert?.stockQty} units
                        </span>
                      </div>
                      <span className="text-xs text-slate-400">
                        Reorder: {alert?.reorderLevel}
                      </span>
                      {alert?.expiryDate && (
                        <span className="text-xs text-slate-400">
                          Exp: {alert?.expiryDate}
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight
                    size={14}
                    className="text-slate-300 group-hover:text-slate-500 transition-colors flex-shrink-0 mt-1"
                  />
                </div>
              </li>
            );
          })
        )}
      </ul>
      <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50">
        <button className="text-xs text-teal-600 font-medium hover:text-teal-700 transition-colors w-full text-center">
          View all low stock items →
        </button>
      </div>
    </div>
  );
}