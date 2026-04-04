const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    required: true,
    enum: ['info', 'warning', 'alert', 'success', 'error']
  },
  category: {
    type: String,
    enum: ['stock', 'expiry', 'sale', 'order', 'system', 'other'],
    default: 'other'
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  link: String,
  read: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  expiresAt: Date
}, {
  timestamps: true
});

// Indexes
notificationSchema.index({ userId: 1, read: 1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ createdAt: -1 });

// TTL index - automatically delete read notifications older than 30 days
notificationSchema.index({ readAt: 1 }, { expireAfterSeconds: 2592000, partialFilterExpression: { read: true } });

module.exports = mongoose.model('Notification', notificationSchema);
