const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  // Pharmacy Information
  pharmacyName: {
    type: String,
    required: true,
    default: 'PharmaCare'
  },
  pharmacyLicense: String,
  taxId: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: { type: String, default: 'Ethiopia' }
  },
  phone: String,
  email: String,
  website: String,
  logo: String,

  // Business Settings
  currency: {
    type: String,
    default: 'ETB'
  },
  taxRate: {
    type: Number,
    default: 15,
    min: 0,
    max: 100
  },
  fiscalYearStart: {
    type: String,
    default: '01-01'
  },

  // Inventory Settings
  lowStockThreshold: {
    type: Number,
    default: 10,
    min: 0
  },
  expiryAlertDays: {
    type: Number,
    default: 90,
    min: 0
  },
  autoReorderEnabled: {
    type: Boolean,
    default: false
  },
  reorderPoint: {
    type: Number,
    default: 20
  },

  // Sales Settings
  receiptPrefix: {
    type: String,
    default: 'INV'
  },
  receiptFooter: String,
  allowNegativeStock: {
    type: Boolean,
    default: false
  },
  requirePrescription: {
    type: Boolean,
    default: true
  },

  // Loyalty Program
  loyaltyEnabled: {
    type: Boolean,
    default: true
  },
  pointsPerCurrency: {
    type: Number,
    default: 1
  },
  pointsRedemptionRate: {
    type: Number,
    default: 0.01
  },

  // Notification Settings
  emailNotifications: {
    type: Boolean,
    default: true
  },
  smsNotifications: {
    type: Boolean,
    default: false
  },
  lowStockAlerts: {
    type: Boolean,
    default: true
  },
  expiryAlerts: {
    type: Boolean,
    default: true
  },

  // Backup Settings
  autoBackupEnabled: {
    type: Boolean,
    default: false
  },
  backupFrequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly'],
    default: 'weekly'
  },

  // System Settings
  maintenanceMode: {
    type: Boolean,
    default: false
  },
  allowRegistration: {
    type: Boolean,
    default: false
  },
  sessionTimeout: {
    type: Number,
    default: 30
  },

  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Settings', settingsSchema);
