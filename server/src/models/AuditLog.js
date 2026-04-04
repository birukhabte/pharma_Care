const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: String,
  action: {
    type: String,
    required: true,
    enum: ['create', 'read', 'update', 'delete', 'login', 'logout', 'export', 'import', 'other']
  },
  entity: {
    type: String,
    required: true
  },
  entityId: mongoose.Schema.Types.ObjectId,
  changes: {
    before: mongoose.Schema.Types.Mixed,
    after: mongoose.Schema.Types.Mixed
  },
  ipAddress: String,
  userAgent: String,
  status: {
    type: String,
    enum: ['success', 'failure'],
    default: 'success'
  },
  errorMessage: String,
  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  }
}, {
  timestamps: true
});

// Indexes
auditLogSchema.index({ userId: 1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ entity: 1 });
auditLogSchema.index({ timestamp: -1 });

// TTL index - automatically delete logs older than 1 year
auditLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 31536000 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
