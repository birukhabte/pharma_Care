const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  pharmacyName: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ['head_pharmacist', 'pharmacist', 'counter_staff', 'inventory_manager', 'admin']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
