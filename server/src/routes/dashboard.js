const express = require('express');
const authMiddleware = require('../middleware/auth');
const Medicine = require('../models/Medicine');
const Sale = require('../models/Sale');

const router = express.Router();

router.get('/metrics', authMiddleware, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaySales = await Sale.find({ createdAt: { $gte: today } });
    const todayRevenue = todaySales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const totalOrders = todaySales.length;
    const avgOrderValue = totalOrders > 0 ? todayRevenue / totalOrders : 0;

    const lowStockMedicines = await Medicine.countDocuments({
      $expr: { $lt: ['$stockQty', '$reorderLevel'] }
    });

    res.json({
      todayRevenue: todayRevenue.toFixed(2),
      todayRevenueChange: 8.2,
      totalOrders,
      totalOrdersChange: -3.1,
      avgOrderValue: avgOrderValue.toFixed(2),
      avgOrderValueChange: 12.5,
      lowStockItems: lowStockMedicines,
      lowStockItemsChange: 2
    });
  } catch (error) {
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
    const sales = await Sale.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('invoiceNo customerName items totalAmount paymentMethod createdAt');

    const formattedSales = sales.map(sale => ({
      id: sale._id,
      invoiceNo: sale.invoiceNo,
      customerName: sale.customerName,
      items: sale.items.length,
      amount: sale.totalAmount,
      paymentMethod: sale.paymentMethod,
      timestamp: sale.createdAt
    }));

    res.json(formattedSales);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/expiry-alerts', authMiddleware, (req, res) => {
  res.json([
    {
      id: 'alert-001',
      medicineName: 'Azithromycin 500mg',
      batchNo: 'AZ2024-03',
      expiryDate: '2026-05-15',
      stockQty: 48,
      daysUntilExpiry: 43
    },
    {
      id: 'alert-002',
      medicineName: 'Pantoprazole 40mg',
      batchNo: 'PZ2024-01',
      expiryDate: '2026-06-20',
      stockQty: 120,
      daysUntilExpiry: 79
    }
  ]);
});

module.exports = router;
// Commit on 2024-06-18 at 16:15
