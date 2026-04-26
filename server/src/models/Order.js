const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  medicineId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  generic: {
    type: String
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  category: {
    type: String
  }
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true
  },
  customerName: {
    type: String,
    required: true
  },
  customerPhone: {
    type: String
  },
  items: [orderItemSchema],
  subtotal: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending'
  },
  createdBy: {
    type: String,
    required: true
  },
  createdByRole: {
    type: String,
    required: true
  },
  completedBy: {
    type: String
  },
  completedAt: {
    type: Date
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'mobile']
  },
  amountReceived: {
    type: Number
  },
  change: {
    type: Number
  }
}, {
  timestamps: true
});

// Generate order number
orderSchema.pre('save', async function(next) {
  if (this.isNew && !this.orderNumber) {
    try {
      const count = await mongoose.model('Order').countDocuments();
      this.orderNumber = `ORD-${String(count + 1).padStart(4, '0')}`;
      console.log('✅ Generated order number:', this.orderNumber);
    } catch (error) {
      console.log('❌ Error generating order number:', error);
      return next(error);
    }
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
