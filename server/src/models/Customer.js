const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    sparse: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: { type: String, default: 'Ethiopia' }
  },
  dateOfBirth: Date,
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  loyaltyPoints: {
    type: Number,
    default: 0,
    min: 0
  },
  totalPurchases: {
    type: Number,
    default: 0,
    min: 0
  },
  lastPurchaseDate: Date,
  status: {
    type: String,
    enum: ['active', 'inactive', 'blocked'],
    default: 'active'
  },
  notes: String,
  registrationDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes (phone already has unique index from schema definition)
customerSchema.index({ name: 1 });
customerSchema.index({ status: 1 });

module.exports = mongoose.model('Customer', customerSchema);
// Commit on 2024-06-8 at 17:34
// Commit on 2024-06-11 at 13:54
