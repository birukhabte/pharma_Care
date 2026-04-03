'use client';

import React, { useEffect, useRef } from 'react';
import { Check, AlertTriangle, X, Ban, Activity } from 'lucide-react';
import type { Medicine } from './MedicineTable';

const statusOptions: {
  value: Medicine['status'];
  label: string;
  icon: React.ReactNode;
  className: string;
}[] = [
  {
    value: 'active',
    label: 'Active',
    icon: <Activity size={13} />,
    className: 'text-emerald-700 hover:bg-emerald-50',
  },
  {
    value: 'low_stock',
    label: 'Low Stock',
    icon: <AlertTriangle size={13} />,
    className: 'text-amber-700 hover:bg-amber-50',
  },
  {
    value: 'out_of_stock',
    label: 'Out of Stock',
    icon: <X size={13} />,
    className: 'text-red-700 hover:bg-red-50',
  },
  {
    value: 'discontinued',
    label: 'Discontinued',
    icon: <Ban size={13} />,
    className: 'text-slate-600 hover:bg-slate-100',
  },
];

interface StatusChangeDropdownProps {
  currentStatus: Medicine['status'];
  onSelect: (status: Medicine['status']) => void;
  onClose: () => void;
}

export default function StatusChangeDropdown({
  currentStatus,
  onSelect,
  onClose,
}: StatusChangeDropdownProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute left-0 top-full mt-1.5 w-44 bg-white border border-slate-200 rounded-xl shadow-modal z-30 py-1 animate-fade-in"
    >
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide px-3 py-1.5">
        Change Status
      </p>
      {statusOptions.map((opt) => (
        <button
          key={`status-opt-${opt.value}`}
          onClick={() => onSelect(opt.value)}
          className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium transition-colors ${opt.className}`}
        >
          {opt.icon}
          {opt.label}
          {currentStatus === opt.value && (
            <Check size={12} className="ml-auto" />
          )}
        </button>
      ))}
    </div>
  );
}