const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
  medicine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medicine',
    required: true
  },
  batchNumber: {
    type: String,
    required: true,
    unique: true
  },
  manufacturingDate: {
    type: Date
  },
  expiryDate: {
    type: Date,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  remainingQty: {
    type: Number,
    required: true
  },
  costPrice: {
    type: Number,
    required: true
  },
  mrp: {
    type: Number,
    required: true
  },
  supplier: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'expiring_soon', 'expired', 'recalled'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Index for efficient expiry queries
batchSchema.index({ expiryDate: 1, status: 1 });
batchSchema.index({ medicine: 1 });

module.exports = mongoose.model('Batch', batchSchema);
