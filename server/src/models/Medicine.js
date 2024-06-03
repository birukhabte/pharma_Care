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
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Medicine', medicineSchema);
// Commit on 2024-06-3 at 9:52
