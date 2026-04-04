const mongoose = require('mongoose');

const purchaseOrderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  supplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: true
  },
  items: [{
    medicineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Medicine'
    },
    medicineName: String,
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0
    },
    batchNumber: String,
    expiryDate: Date
  }],
  orderDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  expectedDeliveryDate: Date,
  actualDeliveryDate: Date,
  status: {
    type: String,
    enum: ['draft', 'pending', 'approved', 'ordered', 'partially_received', 'received', 'cancelled'],
    default: 'draft'
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  taxAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  shippingCost: {
    type: Number,
    default: 0,
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'partially_paid', 'paid'],
    default: 'unpaid'
  },
  paidAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  receivedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: String,
  attachments: [String]
}, {
  timestamps: true
});

// Indexes (orderNumber already has unique index from schema definition)
purchaseOrderSchema.index({ supplierId: 1 });
purchaseOrderSchema.index({ status: 1 });
purchaseOrderSchema.index({ orderDate: -1 });

module.exports = mongoose.model('PurchaseOrder', purchaseOrderSchema);
