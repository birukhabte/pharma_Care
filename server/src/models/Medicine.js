const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  genericName: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  manufacturer: {
    type: String,
    required: true
  },
  batchCount: {
    type: Number,
    default: 0
  },
  stockQty: {
    type: Number,
    required: true,
    default: 0
  },
  reorderLevel: {
    type: Number,
    required: true
  },
  unitPrice: {
    type: Number,
    required: true
  },
  costPrice: {
    type: Number,
    required: true
  },
  supplier: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'low_stock', 'out_of_stock', 'discontinued'],
    default: 'active'
  },
  dosageForm: {
    type: String,
    required: true
  },
  strength: {
    type: String,
    required: true
  },
  hsnCode: {
    type: String
  },
  gstRate: {
    type: Number,
    default: 12
  },
  schedule: {
    type: String,
    enum: ['OTC', 'H', 'H1', 'X', 'G'],
    default: 'H'
  },
  productionDate: {
    type: Date
  },
  expiryDate: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for better query performance
medicineSchema.index({ name: 1 });
medicineSchema.index({ genericName: 1 });
medicineSchema.index({ category: 1 });
medicineSchema.index({ status: 1 });
medicineSchema.index({ manufacturer: 1 });
// Compound indexes for common query patterns
medicineSchema.index({ status: 1, category: 1 });
medicineSchema.index({ category: 1, name: 1 });

module.exports = mongoose.model('Medicine', medicineSchema);
// Commit on 2024-06-3 at 9:52
// Commit on 2024-06-2 at 11:2
// Commit on 2024-06-2 at 9:33
// Commit on 2024-06-12 at 16:51
