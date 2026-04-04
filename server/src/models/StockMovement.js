const mongoose = require('mongoose');

const stockMovementSchema = new mongoose.Schema({
  medicineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medicine',
    required: true
  },
  batchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Batch'
  },
  type: {
    type: String,
    enum: ['in', 'out', 'adjustment', 'return', 'expired', 'damaged'],
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  previousStock: {
    type: Number,
    required: true
  },
  newStock: {
    type: Number,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  referenceType: {
    type: String,
    enum: ['sale', 'purchase', 'adjustment', 'prescription', 'return', 'other']
  },
  referenceId: mongoose.Schema.Types.ObjectId,
  referenceNumber: String,
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  notes: String
}, {
  timestamps: true
});

// Indexes
stockMovementSchema.index({ medicineId: 1 });
stockMovementSchema.index({ batchId: 1 });
stockMovementSchema.index({ type: 1 });
stockMovementSchema.index({ date: -1 });
stockMovementSchema.index({ performedBy: 1 });

module.exports = mongoose.model('StockMovement', stockMovementSchema);
