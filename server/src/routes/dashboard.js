const express = require('express');
const authMiddleware = require('../middleware/auth');
const Medicine = require('../models/Medicine');
const Sale = require('../models/Sale');
const Order = require('../models/Order');

const router = express.Router();

router.get('/metrics', authMiddleware, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    // Get today's completed orders
    const todayOrders = await Order.find({ 
      status: 'completed',
      completedAt: { $gte: today }
    });
    
    // Get yesterday's completed orders for comparison
    const yesterdayOrders = await Order.find({
      status: 'completed',
      completedAt: { $gte: yesterday, $lt: today }
    });

    // Calculate today's metrics
    const todayRevenue = todayOrders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = todayOrders.length;
    const avgOrderValue = totalOrders > 0 ? todayRevenue / totalOrders : 0;

    // Calculate yesterday's metrics for comparison
    const yesterdayRevenue = yesterdayOrders.reduce((sum, order) => sum + order.total, 0);
    const yesterdayOrderCount = yesterdayOrders.length;
    const yesterdayAvgOrderValue = yesterdayOrderCount > 0 ? yesterdayRevenue / yesterdayOrderCount : 0;

    // Calculate percentage changes
    const todayRevenueChange = yesterdayRevenue > 0 
      ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100 
      : 0;
    
    const totalOrdersChange = yesterdayOrderCount > 0
      ? ((totalOrders - yesterdayOrderCount) / yesterdayOrderCount) * 100
      : 0;
    
    const avgOrderValueChange = yesterdayAvgOrderValue > 0
      ? ((avgOrderValue - yesterdayAvgOrderValue) / yesterdayAvgOrderValue) * 100
      : 0;

    // Low stock medicines (stock < 100 or below reorder level)
    const lowStockMedicines = await Medicine.countDocuments({
      $or: [
        { stockQty: { $lt: 100 } },
        { $expr: { $lt: ['$stockQty', '$reorderLevel'] } }
      ]
    });

    // Medicines expiring this month
    const expiringThisMonth = await Medicine.countDocuments({
      expiryDate: {
        $gte: startOfMonth,
        $lte: endOfMonth
      }
    });

    // Medicines expiring within 7 days (critical)
    const sevenDaysFromNow = new Date(today);
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    
    const expiringCritical = await Medicine.countDocuments({
      expiryDate: {
        $gte: today,
        $lte: sevenDaysFromNow
      }
    });

    // Get total employees (users)
    const User = require('../models/User');
    const totalEmployees = await User.countDocuments({ status: 'active' });

    // Get recent notifications count
    const Notification = require('../models/Notification');
    const recentNotifications = await Notification.countDocuments({
      read: false,
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
    });

    const urgentNotifications = await Notification.countDocuments({
      read: false,
      priority: 'high',
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });

    res.json({
      todayRevenue: todayRevenue.toFixed(2),
      todayRevenueChange: parseFloat(todayRevenueChange.toFixed(1)),
      totalOrders,
      totalOrdersChange: parseFloat(totalOrdersChange.toFixed(1)),
      avgOrderValue: avgOrderValue.toFixed(2),
      avgOrderValueChange: parseFloat(avgOrderValueChange.toFixed(1)),
      lowStockItems: lowStockMedicines,
      lowStockItemsChange: 0, // Can be calculated if needed
      expiringThisMonth,
      expiringCritical,
      totalEmployees,
      recentNotifications,
      urgentNotifications
    });
  } catch (error) {
    console.error('Dashboard metrics error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/sales-trend', authMiddleware, (req, res) => {
  res.json([
    { date: '2026-03-27', revenue: 11200, orders: 132 },
    { date: '2026-03-28', revenue: 13400, orders: 156 },
    { date: '2026-03-29', revenue: 10800, orders: 128 },
    { date: '2026-03-30', revenue: 14200, orders: 168 },
    { date: '2026-03-31', revenue: 12900, orders: 151 },
    { date: '2026-04-01', revenue: 11500, orders: 139 },
    { date: '2026-04-02', revenue: 12450, orders: 147 }
  ]);
});

router.get('/top-medicines', authMiddleware, (req, res) => {
  res.json([
    { name: 'Dolo 650', revenue: 2840, units: 1420 },
    { name: 'Amoxicillin', revenue: 2380, units: 340 },
    { name: 'Atorvastatin', revenue: 1920, units: 240 },
    { name: 'Metformin', revenue: 1680, units: 560 },
    { name: 'Cetirizine', revenue: 1120, units: 800 }
  ]);
});

router.get('/recent-sales', authMiddleware, async (req, res) => {
  try {
    // Get recent completed orders
    const orders = await Order.find({ status: 'completed' })
      .sort({ completedAt: -1 })
      .limit(10)
      .select('orderNumber customerName items total paymentMethod completedAt completedBy');

    const formattedSales = orders.map(order => ({
      id: order._id,
      invoiceNo: order.orderNumber,
      customerName: order.customerName,
      items: order.items.length,
      amount: order.total,
      paymentMethod: order.paymentMethod || 'N/A',
      timestamp: order.completedAt || order.createdAt
    }));

    res.json(formattedSales);
  } catch (error) {
    console.error('Recent sales error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/expiry-alerts', authMiddleware, async (req, res) => {
  try {
    // Get medicines with stock less than 100 or below reorder level
    const lowStockMedicines = await Medicine.find({
      $or: [
        { stockQty: { $lt: 100 } },
        { $expr: { $lt: ['$stockQty', '$reorderLevel'] } }
      ]
    })
    .select('name stockQty reorderLevel expiryDate category')
    .sort({ stockQty: 1 }) // Sort by lowest stock first
    .limit(20); // Limit to 20 alerts

    const alerts = lowStockMedicines.map(medicine => {
      const daysUntilExpiry = medicine.expiryDate 
        ? Math.ceil((new Date(medicine.expiryDate) - new Date()) / (1000 * 60 * 60 * 24))
        : null;

      return {
        id: medicine._id,
        medicineName: medicine.name,
        batchNo: 'N/A', // Can be added if batch tracking is implemented
        expiryDate: medicine.expiryDate ? new Date(medicine.expiryDate).toISOString().split('T')[0] : null,
        stockQty: medicine.stockQty,
        reorderLevel: medicine.reorderLevel,
        category: medicine.category,
        daysUntilExpiry: daysUntilExpiry,
        alertType: medicine.stockQty < 100 ? 'low-stock' : 'reorder-level'
      };
    });

    res.json(alerts);
  } catch (error) {
    console.error('Expiry alerts error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
// Commit on 2024-06-18 at 16:15
// Commit on 2024-06-1 at 18:2
// Commit on 2024-06-15 at 18:30
