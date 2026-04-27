'use client';

import React from 'react';
import { AlertTriangle, Trash2, X } from '@/components/ui/Icons';

interface DeleteConfirmModalProps {
  medicineName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmModal({
  medicineName,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={onCancel}
      />
      <div className="relative bg-white rounded-2xl shadow-modal w-full max-w-md animate-slide-up">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={22} className="text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-800">Delete Medicine</h3>
              <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                Are you sure you want to remove{' '}
                <span className="font-semibold text-slate-700">{medicineName}</span> from inventory?
                This will also remove all associated batch records and cannot be undone.
              </p>
            </div>
            <button
              onClick={onCancel}
              className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0"
            >
              <X size={16} className="text-slate-500" />
            </button>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button onClick={onCancel} className="btn-secondary px-5">
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="btn-danger flex items-center gap-2 px-5"
            >
              <Trash2 size={14} />
              Delete Medicine
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}