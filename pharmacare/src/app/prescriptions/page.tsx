'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Calendar,
  User,
  Pill,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Download,
  Printer
} from 'lucide-react';

interface Prescription {
  id: string;
  prescriptionNo: string;
  patientName: string;
  patientAge: number;
  patientGender: 'Male' | 'Female';
  doctorName: string;
  doctorLicense: string;
  date: string;
  medicines: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    quantity: number;
  }[];
  status: 'pending' | 'dispensed' | 'partial' | 'cancelled';
  notes?: string;
  dispensedBy?: string;
  dispensedAt?: string;
}

const MOCK_PRESCRIPTIONS: Prescription[] = [
  {
    id: 'rx-001',
    prescriptionNo: 'RX-2026-0412',
    patientName: 'Alemayehu Bekele',
    patientAge: 45,
    patientGender: 'Male',
    doctorName: 'Dr. Hanna Tesfaye',
    doctorLicense: 'ETH-MD-12345',
    date: '2026-04-02',
    medicines: [
      {
        name: 'Amoxicillin 500mg',
        dosage: '500mg',
        frequency: '3 times daily',
        duration: '7 days',
        quantity: 21
      },
      {
        name: 'Paracetamol 650mg',
        dosage: '650mg',
        frequency: 'As needed',
        duration: '5 days',
        quantity: 10
      }
    ],
    status: 'dispensed',
    dispensedBy: 'Tigist Haile',
    dispensedAt: '2026-04-02 14:30'
  },
  {
    id: 'rx-002',
    prescriptionNo: 'RX-2026-0411',
    patientName: 'Mekdes Tadesse',
    patientAge: 32,
    patientGender: 'Female',
    doctorName: 'Dr. Dawit Girma',
    doctorLicense: 'ETH-MD-67890',
    date: '2026-04-01',
    medicines: [
      {
        name: 'Metformin 850mg',
        dosage: '850mg',
        frequency: '2 times daily',
        duration: '30 days',
        quantity: 60
      }
    ],
    status: 'pending',
    notes: 'Patient has diabetes, monitor blood sugar'
  },
  {
    id: 'rx-003',
    prescriptionNo: 'RX-2026-0410',
    patientName: 'Yohannes Kebede',
    patientAge: 58,
    patientGender: 'Male',
    doctorName: 'Dr. Selam Worku',
    doctorLicense: 'ETH-MD-11223',
    date: '2026-03-31',
    medicines: [
      {
        name: 'Atorvastatin 20mg',
        dosage: '20mg',
        frequency: 'Once daily at night',
        duration: '30 days',
        quantity: 30
      },
      {
        name: 'Amlodipine 5mg',
        dosage: '5mg',
        frequency: 'Once daily',
        duration: '30 days',
        quantity: 30
      }
    ],
    status: 'partial',
    dispensedBy: 'Tigist Haile',
    dispensedAt: '2026-03-31 16:45',
    notes: 'Only Atorvastatin dispensed, Amlodipine out of stock'
  }
];

export default function PrescriptionPage() {
  const [prescriptions] = useState<Prescription[]>(MOCK_PRESCRIPTIONS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);

  const filteredPrescriptions = prescriptions.filter(rx => {
    const matchesSearch = 
      rx.prescriptionNo.toLowerCase().includes(search.toLowerCase()) ||
      rx.patientName.toLowerCase().includes(search.toLowerCase()) ||
      rx.doctorName.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || rx.status === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Prescription['status']) => {
    const badges = {
      pending: 'bg-amber-100 text-amber-700 border-amber-200',
      dispensed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      partial: 'bg-blue-100 text-blue-700 border-blue-200',
      cancelled: 'bg-red-100 text-red-700 border-red-200'
    };
    
    const icons = {
      pending: <Clock size={12} />,
      dispensed: <CheckCircle size={12} />,
      partial: <AlertCircle size={12} />,
      cancelled: <XCircle size={12} />
    };
    
    const labels = {
      pending: 'Pending',
      dispensed: 'Dispensed',
      partial: 'Partial',
      cancelled: 'Cancelled'
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${badges[status]}`}>
        {icons[status]}
        {labels[status]}
      </span>
    );
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Prescription Management</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {prescriptions.length} prescriptions · {prescriptions.filter(p => p.status === 'pending').length} pending
            </p>
          </div>
          <button className="btn-primary flex items-center gap-2">
            <Plus size={16} />
            New Prescription
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-card p-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[250px] max-w-md">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by prescription no, patient, or doctor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="form-input pl-9 py-2 text-sm w-full"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              {['All', 'Pending', 'Dispensed', 'Partial', 'Cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    statusFilter === status
                      ? 'bg-teal-700 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Prescriptions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredPrescriptions.map((rx) => (
            <div
              key={rx.id}
              className="bg-white rounded-xl border border-slate-200 shadow-card hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedPrescription(rx)}
            >
              <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <FileText size={16} className="text-teal-600" />
                      <span className="font-mono text-sm font-semibold text-slate-800">
                        {rx.prescriptionNo}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {new Date(rx.date).toLocaleDateString('en-ET', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  {getStatusBadge(rx.status)}
                </div>

                {/* Patient Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <User size={14} className="text-slate-400" />
                    <span className="text-sm font-medium text-slate-700">{rx.patientName}</span>
                    <span className="text-xs text-slate-400">
                      {rx.patientAge}y, {rx.patientGender}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText size={14} className="text-slate-400" />
                    <span className="text-xs text-slate-600">{rx.doctorName}</span>
                    <span className="text-xs text-slate-400">({rx.doctorLicense})</span>
                  </div>
                </div>

                {/* Medicines */}
                <div className="bg-slate-50 rounded-lg p-3 mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Pill size={14} className="text-teal-600" />
                    <span className="text-xs font-semibold text-slate-700">
                      {rx.medicines.length} Medicine{rx.medicines.length > 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {rx.medicines.slice(0, 2).map((med, idx) => (
                      <div key={idx} className="text-xs text-slate-600">
                        • {med.name} - {med.frequency} × {med.duration}
                      </div>
                    ))}
                    {rx.medicines.length > 2 && (
                      <div className="text-xs text-teal-600 font-medium">
                        +{rx.medicines.length - 2} more
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                {rx.status === 'dispensed' && rx.dispensedBy && (
                  <div className="text-xs text-slate-500 border-t border-slate-100 pt-3">
                    Dispensed by {rx.dispensedBy} on {rx.dispensedAt}
                  </div>
                )}
                {rx.notes && (
                  <div className="text-xs text-amber-600 bg-amber-50 rounded p-2 border border-amber-200">
                    <AlertCircle size={12} className="inline mr-1" />
                    {rx.notes}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredPrescriptions.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-card p-12 text-center">
            <FileText size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No prescriptions found</h3>
            <p className="text-sm text-slate-500">
              Try adjusting your search or filters
            </p>
          </div>
        )}

        {/* Prescription Detail Modal */}
        {selectedPrescription && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setSelectedPrescription(null)}
            />
            <div className="relative bg-white rounded-2xl shadow-modal w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Prescription Details</h2>
                  <p className="text-sm text-slate-500">{selectedPrescription.prescriptionNo}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors" title="Print">
                    <Printer size={18} className="text-slate-600" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors" title="Download">
                    <Download size={18} className="text-slate-600" />
                  </button>
                  <button
                    onClick={() => setSelectedPrescription(null)}
                    className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <XCircle size={18} className="text-slate-600" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                {/* Status */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600">Status</span>
                  {getStatusBadge(selectedPrescription.status)}
                </div>

                {/* Patient Information */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">Patient Information</h3>
                  <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Name</span>
                      <span className="text-sm font-medium text-slate-800">{selectedPrescription.patientName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Age</span>
                      <span className="text-sm font-medium text-slate-800">{selectedPrescription.patientAge} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Gender</span>
                      <span className="text-sm font-medium text-slate-800">{selectedPrescription.patientGender}</span>
                    </div>
                  </div>
                </div>

                {/* Doctor Information */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">Prescribing Doctor</h3>
                  <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Name</span>
                      <span className="text-sm font-medium text-slate-800">{selectedPrescription.doctorName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">License No.</span>
                      <span className="text-sm font-mono text-slate-800">{selectedPrescription.doctorLicense}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Date</span>
                      <span className="text-sm font-medium text-slate-800">
                        {new Date(selectedPrescription.date).toLocaleDateString('en-ET', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Medicines */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">Prescribed Medicines</h3>
                  <div className="space-y-3">
                    {selectedPrescription.medicines.map((med, idx) => (
                      <div key={idx} className="border border-slate-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-slate-800">{med.name}</h4>
                          <span className="text-sm font-mono text-teal-600">Qty: {med.quantity}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-slate-500">Dosage:</span>
                            <span className="ml-2 text-slate-700">{med.dosage}</span>
                          </div>
                          <div>
                            <span className="text-slate-500">Frequency:</span>
                            <span className="ml-2 text-slate-700">{med.frequency}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-slate-500">Duration:</span>
                            <span className="ml-2 text-slate-700">{med.duration}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                {selectedPrescription.notes && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 mb-3">Notes</h3>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <p className="text-sm text-amber-800">{selectedPrescription.notes}</p>
                    </div>
                  </div>
                )}

                {/* Dispensing Info */}
                {selectedPrescription.status === 'dispensed' && selectedPrescription.dispensedBy && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 mb-3">Dispensing Information</h3>
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-emerald-700">Dispensed by</span>
                        <span className="text-sm font-medium text-emerald-800">{selectedPrescription.dispensedBy}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-emerald-700">Date & Time</span>
                        <span className="text-sm font-medium text-emerald-800">{selectedPrescription.dispensedAt}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                {selectedPrescription.status === 'pending' && (
                  <div className="flex gap-3 pt-4 border-t border-slate-200">
                    <button className="btn-primary flex-1">
                      Dispense Prescription
                    </button>
                    <button className="btn-secondary">
                      Mark as Partial
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
// Commit on 2024-06-12 at 15:55
// Commit on 2024-06-27 at 10:8
// Commit on 2024-06-30 at 13:2
// Commit on 2024-06-6 at 15:34
// Commit on 2024-06-12 at 12:45
