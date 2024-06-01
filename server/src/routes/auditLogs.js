const express = require('express');
const router = express.Router();
const AuditLog = require('../models/AuditLog');
const authenticate = require('../middleware/auth');
const { checkPermission } = require('../middleware/rbac');

// Get all audit logs (admin only)
router.get('/', authenticate, checkPermission('audit_logs', 'read'), async (req, res) => {
  try {
    const { userId, action, entity, startDate, endDate, page = 1, limit = 100 } = req.query;
    
    const query = {};
    if (userId) query.userId = userId;
    if (action) query.action = action;
    if (entity) query.entity = entity;
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const logs = await AuditLog.find(query)
      .populate('userId', 'fullName email')
      .sort({ timestamp: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await AuditLog.countDocuments(query);

    res.json({
      logs,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get audit log by ID
router.get('/:id', authenticate, checkPermission('audit_logs', 'read'), async (req, res) => {
  try {
    const log = await AuditLog.findById(req.params.id)
      .populate('userId', 'fullName email');
    
    if (!log) {
      return res.status(404).json({ message: 'Audit log not found' });
    }
    res.json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create audit log (internal use)
router.post('/', authenticate, async (req, res) => {
  try {
    const logData = {
      ...req.body,
      userId: req.user.id,
      userName: req.user.fullName,
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    };

    const log = new AuditLog(logData);
    await log.save();

    res.status(201).json(log);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get user activity
router.get('/user/:userId', authenticate, async (req, res) => {
  try {
    const logs = await AuditLog.find({ userId: req.params.userId })
      .sort({ timestamp: -1 })
      .limit(100);

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get entity history
router.get('/entity/:entity/:entityId', authenticate, async (req, res) => {
  try {
    const logs = await AuditLog.find({
      entity: req.params.entity,
      entityId: req.params.entityId
    })
      .populate('userId', 'fullName')
      .sort({ timestamp: -1 });

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
// Commit on 2024-06-20 at 13:53
// Commit on 2024-06-29 at 16:33
// Commit on 2024-06-1 at 15:21
