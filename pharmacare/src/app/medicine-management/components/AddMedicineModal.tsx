'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Loader2, Pill, Package, DollarSign, Building2, ChevronDown } from 'lucide-react';
import type { Medicine } from './MedicineTable';

interface AddMedicineModalProps {
  medicine: Medicine | null;
  onClose: () => void;
  onSubmit: (data: Partial<Medicine>) => void;
}

type FormData = {
  name: string;
  genericName: string;
  category: string;
  manufacturer: string;
  dosageForm: string;
  strength: string;
  unitPrice: number;
  costPrice: number;
  reorderLevel: number;
  stockQty: number;
  supplier: string;
  hsnCode: string;
  gstRate: number;
  schedule: string;
  status: Medicine['status'];
};

const CATEGORIES = ['Antibiotics', 'Antidiabetics', 'Cardiovascular', 'Gastrointestinal', 'Antihistamines', 'Analgesics', 'Vitamins & Supplements', 'Dermatology', 'Respiratory', 'Neurology'];
const DOSAGE_FORMS = ['Tablet', 'Capsule', 'Syrup', 'Injection', 'Cream', 'Ointment', 'Drops', 'Inhaler', 'Patch', 'Suppository'];
const SCHEDULES = ['OTC', 'H', 'H1', 'X', 'G'];
const SUPPLIERS = ['MedWholesale India', 'PharmaDist Co.', 'HealthSupply Hub', 'NationalMed Distributors', 'CityPharma Suppliers'];
const GST_RATES = [0, 5, 12, 18];

export default function AddMedicineModal({
  medicine,
  onClose,
  onSubmit,
}: AddMedicineModalProps) {
  const isEditing = !!medicine;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      genericName: '',
      category: '',
      manufacturer: '',
      dosageForm: 'Tablet',
      strength: '',
      unitPrice: 0,
      costPrice: 0,
      reorderLevel: 100,
      stockQty: 0,
      supplier: '',
      hsnCode: '',
      gstRate: 12,
      schedule: 'H',
      status: 'active',
    },
  });

  useEffect(() => {
    if (medicine) {
      reset({
        name: medicine.name,
        genericName: medicine.genericName,
        category: medicine.category,
        manufacturer: medicine.manufacturer,
        dosageForm: medicine.dosageForm,
        strength: medicine.strength,
        unitPrice: medicine.unitPrice,
        costPrice: medicine.costPrice,
        reorderLevel: medicine.reorderLevel,
        stockQty: medicine.stockQty,
        supplier: medicine.supplier,
        hsnCode: medicine.hsnCode,
        gstRate: medicine.gstRate,
        schedule: medicine.schedule,
        status: medicine.status,
      });
    }
  }, [medicine, reset]);

  const handleFormSubmit = async (data: FormData) => {
    await new Promise((r) => setTimeout(r, 600));
    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-modal w-full max-w-2xl max-h-[90vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-teal-100 flex items-center justify-center">
              <Pill size={18} className="text-teal-700" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                {isEditing ? 'Edit Medicine' : 'Add New Medicine'}
              </h2>
              <p className="text-xs text-slate-400">
                {isEditing ? `Editing ${medicine?.name}` : 'Add a new medicine to your inventory'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X size={18} className="text-slate-500" />
          </button>
        </div>

        {/* Form body */}
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="flex-1 overflow-y-auto scrollbar-thin"
        >
          <div className="px-6 py-5 space-y-6">

            {/* Section 1: Basic Information */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Pill size={14} className="text-teal-600" />
                <h3 className="text-sm font-semibold text-slate-700">Basic Information</h3>
                <div className="flex-1 h-px bg-slate-100 ml-2" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Medicine name */}
                <div className="sm:col-span-2">
                  <label className="form-label">Medicine name <span className="text-red-500">*</span></label>
                  <p className="text-xs text-slate-400 mb-1.5">Include dosage form and strength in the name (e.g. Amoxicillin 500mg Cap)</p>
                  <input
                    type="text"
                    placeholder="Amoxicillin 500mg Cap"
                    className={`form-input ${errors.name ? 'form-input-error' : ''}`}
                    {...register('name', { required: 'Medicine name is required' })}
                  />
                  {errors.name && <p className="form-error">{errors.name.message}</p>}
                </div>

                {/* Generic name */}
                <div>
                  <label className="form-label">Generic / INN name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    placeholder="Amoxicillin"
                    className={`form-input ${errors.genericName ? 'form-input-error' : ''}`}
                    {...register('genericName', { required: 'Generic name is required' })}
                  />
                  {errors.genericName && <p className="form-error">{errors.genericName.message}</p>}
                </div>

                {/* Category */}
                <div>
                  <label className="form-label">Category <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select
                      className={`form-input appearance-none pr-9 ${errors.category ? 'form-input-error' : ''}`}
                      {...register('category', { required: 'Category is required' })}
                    >
                      <option value="">Select category...</option>
                      {CATEGORIES.map((c) => (
                        <option key={`cat-opt-${c}`} value={c}>{c}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                  {errors.category && <p className="form-error">{errors.category.message}</p>}
                </div>

                {/* Manufacturer */}
                <div>
                  <label className="form-label">Manufacturer <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Building2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Cipla Ltd."
                      className={`form-input pl-9 ${errors.manufacturer ? 'form-input-error' : ''}`}
                      {...register('manufacturer', { required: 'Manufacturer is required' })}
                    />
                  </div>
                  {errors.manufacturer && <p className="form-error">{errors.manufacturer.message}</p>}
                </div>

                {/* Dosage form */}
                <div>
                  <label className="form-label">Dosage form <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select
                      className={`form-input appearance-none pr-9 ${errors.dosageForm ? 'form-input-error' : ''}`}
                      {...register('dosageForm', { required: 'Dosage form is required' })}
                    >
                      {DOSAGE_FORMS.map((f) => (
                        <option key={`dosage-${f}`} value={f}>{f}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                  {errors.dosageForm && <p className="form-error">{errors.dosageForm.message}</p>}
                </div>

                {/* Strength */}
                <div>
                  <label className="form-label">Strength <span className="text-red-500">*</span></label>
                  <p className="text-xs text-slate-400 mb-1.5">e.g. 500mg, 10ml, 2.5%</p>
                  <input
                    type="text"
                    placeholder="500mg"
                    className={`form-input ${errors.strength ? 'form-input-error' : ''}`}
                    {...register('strength', { required: 'Strength is required' })}
                  />
                  {errors.strength && <p className="form-error">{errors.strength.message}</p>}
                </div>

                {/* Schedule */}
                <div>
                  <label className="form-label">Drug schedule</label>
                  <p className="text-xs text-slate-400 mb-1.5">Determines prescription requirements</p>
                  <div className="relative">
                    <select
                      className="form-input appearance-none pr-9"
                      {...register('schedule')}
                    >
                      {SCHEDULES.map((s) => (
                        <option key={`schedule-${s}`} value={s}>{s}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Pricing & Inventory */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <DollarSign size={14} className="text-teal-600" />
                <h3 className="text-sm font-semibold text-slate-700">Pricing & Inventory</h3>
                <div className="flex-1 h-px bg-slate-100 ml-2" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Unit price */}
                <div>
                  <label className="form-label">Selling price (per unit) <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">Br</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.85"
                      className={`form-input pl-9 ${errors.unitPrice ? 'form-input-error' : ''}`}
                      {...register('unitPrice', {
                        required: 'Selling price is required',
                        min: { value: 0.01, message: 'Price must be greater than 0' },
                        valueAsNumber: true,
                      })}
                    />
                  </div>
                  {errors.unitPrice && <p className="form-error">{errors.unitPrice.message}</p>}
                </div>

                {/* Cost price */}
                <div>
                  <label className="form-label">Cost price (per unit) <span className="text-red-500">*</span></label>
                  <p className="text-xs text-slate-400 mb-1.5">Purchase price from supplier</p>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">Br</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.58"
                      className={`form-input pl-9 ${errors.costPrice ? 'form-input-error' : ''}`}
                      {...register('costPrice', {
                        required: 'Cost price is required',
                        min: { value: 0.01, message: 'Cost must be greater than 0' },
                        valueAsNumber: true,
                      })}
                    />
                  </div>
                  {errors.costPrice && <p className="form-error">{errors.costPrice.message}</p>}
                </div>

                {/* Opening stock */}
                <div>
                  <label className="form-label">Opening stock qty</label>
                  <p className="text-xs text-slate-400 mb-1.5">Current units available in pharmacy</p>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    className="form-input"
                    {...register('stockQty', { valueAsNumber: true, min: 0 })}
                  />
                </div>

                {/* Reorder level */}
                <div>
                  <label className="form-label">Reorder level <span className="text-red-500">*</span></label>
                  <p className="text-xs text-slate-400 mb-1.5">Alert triggers when stock falls below this</p>
                  <input
                    type="number"
                    min="1"
                    placeholder="100"
                    className={`form-input ${errors.reorderLevel ? 'form-input-error' : ''}`}
                    {...register('reorderLevel', {
                      required: 'Reorder level is required',
                      min: { value: 1, message: 'Must be at least 1' },
                      valueAsNumber: true,
                    })}
                  />
                  {errors.reorderLevel && <p className="form-error">{errors.reorderLevel.message}</p>}
                </div>

                {/* GST rate */}
                <div>
                  <label className="form-label">GST rate (%)</label>
                  <div className="relative">
                    <select
                      className="form-input appearance-none pr-9"
                      {...register('gstRate', { valueAsNumber: true })}
                    >
                      {GST_RATES.map((r) => (
                        <option key={`gst-${r}`} value={r}>{r}%</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* HSN code */}
                <div>
                  <label className="form-label">HSN code</label>
                  <p className="text-xs text-slate-400 mb-1.5">Harmonized System Nomenclature for GST filing</p>
                  <input
                    type="text"
                    placeholder="30041011"
                    className="form-input font-mono"
                    {...register('hsnCode')}
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Supplier & Status */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Package size={14} className="text-teal-600" />
                <h3 className="text-sm font-semibold text-slate-700">Supplier & Status</h3>
                <div className="flex-1 h-px bg-slate-100 ml-2" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Supplier */}
                <div>
                  <label className="form-label">Primary supplier <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select
                      className={`form-input appearance-none pr-9 ${errors.supplier ? 'form-input-error' : ''}`}
                      {...register('supplier', { required: 'Supplier is required' })}
                    >
                      <option value="">Select supplier...</option>
                      {SUPPLIERS.map((s) => (
                        <option key={`supplier-opt-${s}`} value={s}>{s}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                  {errors.supplier && <p className="form-error">{errors.supplier.message}</p>}
                </div>

                {/* Status */}
                <div>
                  <label className="form-label">Initial status</label>
                  <div className="relative">
                    <select
                      className="form-input appearance-none pr-9"
                      {...register('status')}
                    >
                      <option value="active">Active</option>
                      <option value="low_stock">Low Stock</option>
                      <option value="out_of_stock">Out of Stock</option>
                      <option value="discontinued">Discontinued</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky footer */}
          <div className="sticky bottom-0 bg-white border-t border-slate-100 px-6 py-4 flex items-center justify-between gap-3 flex-shrink-0">
            <p className="text-xs text-slate-400">
              <span className="text-red-500">*</span> Required fields
            </p>
            <div className="flex items-center gap-3">
              <button type="button" onClick={onClose} className="btn-secondary px-5">
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary flex items-center gap-2 px-5 min-w-[140px] justify-center"
              >
                {isSubmitting ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <>
                    {isEditing ? 'Save Changes' : 'Add Medicine'}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}