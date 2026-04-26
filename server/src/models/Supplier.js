const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  contactPerson: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: { type: String, default: 'Ethiopia' }
  },
  category: {
    type: String,
    enum: ['pharmaceutical', 'medical_equipment', 'general_supplies', 'other'],
    default: 'pharmaceutical'
  },
  taxId: String,
  licenseNumber: String,
  paymentTerms: {
    type: String,
    default: 'Net 30'
  },
  creditLimit: {
    type: Number,
    default: 0
  },
  currentBalance: {
    type: Number,
    default: 0
  },
  totalOrders: {
    type: Number,
    default: 0
  },
  totalPurchaseAmount: {
    type: Number,
    default: 0
  },
  lastOrderDate: Date,
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  notes: String
}, {
  timestamps: true
});

// Indexes
supplierSchema.index({ name: 1 });
supplierSchema.index({ category: 1 });
supplierSchema.index({ status: 1 });
// Compound index for common query patterns
supplierSchema.index({ status: 1, name: 1 });
supplierSchema.index({ category: 1, status: 1 });

module.exports = mongoose.model('Supplier', supplierSchema);
// Commit on 2024-06-16 at 17:3
// Commit on 2024-06-17 at 9:0
// Commit on 2024-06-4 at 18:20
