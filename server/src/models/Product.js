const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Medical Supplies', 'Personal Care & Hygiene', 'Cosmetics & Beauty', 'Baby Care']
  },
  sku: {
    type: String,
    required: true,
    unique: true
  },
  currentStock: {
    type: Number,
    required: true,
    default: 0
  },
  minStock: {
    type: Number,
    required: true,
    default: 0
  },
  maxStock: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    required: true,
    default: 'Units'
  },
  location: {
    type: String,
    default: 'Warehouse'
  },
  unitPrice: {
    type: Number,
    default: 0
  },
  costPrice: {
    type: Number,
    default: 0
  },
  supplier: {
    type: String
  },
  status: {
    type: String,
    enum: ['in-stock', 'low-stock', 'out-of-stock', 'overstocked'],
    default: 'in-stock'
  },
  lastRestocked: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Auto-update status based on stock levels
productSchema.pre('save', function(next) {
  if (this.currentStock === 0) {
    this.status = 'out-of-stock';
  } else if (this.currentStock < this.minStock) {
    this.status = 'low-stock';
  } else if (this.currentStock > this.maxStock) {
    this.status = 'overstocked';
  } else {
    this.status = 'in-stock';
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
