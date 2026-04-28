const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const authenticate = require('../middleware/auth');

// Get user notifications
router.get('/', authenticate, async (req, res) => {
  try {
    const { read, type, category, priority, page = 1, limit = 50 } = req.query;
    
    const query = { userId: req.user.id };
    if (read !== undefined) query.read = read === 'true';
    if (type) query.type = type;
    if (category) query.category = category;
    if (priority) query.priority = priority;

    const notifications = await Notification.find(query)
      .sort({ priority: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({ userId: req.user.id, read: false });

    // Get counts by category
    const categoryCounts = await Notification.aggregate([
      { $match: { userId: req.user.id, read: false } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    // Get counts by priority
    const priorityCounts = await Notification.aggregate([
      { $match: { userId: req.user.id, read: false } },
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    res.json({
      notifications,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
      unreadCount,
      categoryCounts: categoryCounts.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      priorityCounts: priorityCounts.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {})
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark notification as read
router.patch('/:id/read', authenticate, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { read: true, readAt: new Date() },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json(notification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Mark all as read
router.patch('/read-all', authenticate, async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user.id, read: false },
      { read: true, readAt: new Date() }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete notification
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete all read notifications
router.delete('/read/all', authenticate, async (req, res) => {
  try {
    const result = await Notification.deleteMany({
      userId: req.user.id,
      read: true
    });

    res.json({ 
      message: 'All read notifications deleted successfully',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get notification statistics
router.get('/stats', authenticate, async (req, res) => {
  try {
    const stats = await Notification.aggregate([
      { $match: { userId: req.user.id } },
      {
        $facet: {
          byCategory: [
            { $group: { _id: '$category', total: { $sum: 1 }, unread: { $sum: { $cond: ['$read', 0, 1] } } } }
          ],
          byPriority: [
            { $group: { _id: '$priority', total: { $sum: 1 }, unread: { $sum: { $cond: ['$read', 0, 1] } } } }
          ],
          byType: [
            { $group: { _id: '$type', total: { $sum: 1 }, unread: { $sum: { $cond: ['$read', 0, 1] } } } }
          ],
          overall: [
            { $group: { _id: null, total: { $sum: 1 }, unread: { $sum: { $cond: ['$read', 0, 1] } } } }
          ]
        }
      }
    ]);

    res.json(stats[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
// Commit on 2024-06-16 at 13:12
// Commit on 2024-06-6 at 17:59
