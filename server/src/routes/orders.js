const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const authenticate = require('../middleware/auth');

// Get all pending orders (for cashier)
router.get('/pending', authenticate, async (req, res) => {
  try {
    const orders = await Order.find({ status: 'pending' })
      .sort({ createdAt: -1 });
    
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all orders (with filters)
router.get('/', authenticate, async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    const orders = await Order.find(query)
      .sort({ createdAt: -1 });
    
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get sales analytics/reports (MUST be before /:id route)
router.get('/analytics', authenticate, async (req, res) => {
  try {
    console.log('📊 Analytics endpoint called by user:', req.user);
    console.log('📊 Query params:', req.query);
    
    const { startDate, endDate, groupBy = 'day' } = req.query;
    
    // Default to last 7 days if no dates provided
    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    // Set end date to end of day
    end.setHours(23, 59, 59, 999);
    start.setHours(0, 0, 0, 0);
    
    console.log('📊 Sales analytics query:', { start, end, groupBy });
    
    // Get completed orders in date range
    const orders = await Order.find({
      status: 'completed',
      completedAt: {
        $gte: start,
        $lte: end
      }
    }).sort({ completedAt: 1 });
    
    console.log(`📊 Found ${orders.length} completed orders`);
    
    // Group orders by date
    const salesByDate = {};
    const paymentMethods = { cash: 0, card: 0, mobile: 0 };
    const cashierPerformance = {};
    
    orders.forEach(order => {
      const dateKey = order.completedAt.toISOString().split('T')[0];
      
      if (!salesByDate[dateKey]) {
        salesByDate[dateKey] = {
          date: dateKey,
          revenue: 0,
          transactions: 0,
          items: 0
        };
      }
      
      salesByDate[dateKey].revenue += order.total;
      salesByDate[dateKey].transactions += 1;
      salesByDate[dateKey].items += order.items.reduce((sum, item) => sum + item.quantity, 0);
      
      // Payment methods
      if (order.paymentMethod) {
        paymentMethods[order.paymentMethod] += order.total;
      }
      
      // Cashier performance
      if (order.completedBy) {
        if (!cashierPerformance[order.completedBy]) {
          cashierPerformance[order.completedBy] = {
            name: order.completedBy,
            revenue: 0,
            transactions: 0
          };
        }
        cashierPerformance[order.completedBy].revenue += order.total;
        cashierPerformance[order.completedBy].transactions += 1;
      }
    });
    
    // Convert to arrays and fill missing dates
    const salesData = [];
    const currentDate = new Date(start);
    
    while (currentDate <= end) {
      const dateKey = currentDate.toISOString().split('T')[0];
      salesData.push(salesByDate[dateKey] || {
        date: dateKey,
        revenue: 0,
        transactions: 0,
        items: 0
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Calculate totals
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalTransactions = orders.length;
    const avgOrderValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;
    
    // Calculate payment method percentages
    const totalPayments = Object.values(paymentMethods).reduce((sum, amount) => sum + amount, 0);
    const paymentMethodsWithPercentage = Object.entries(paymentMethods).map(([method, amount]) => ({
      method,
      amount,
      percentage: totalPayments > 0 ? (amount / totalPayments) * 100 : 0
    }));
    
    res.json({
      summary: {
        totalRevenue,
        totalTransactions,
        avgOrderValue,
        dateRange: { start, end }
      },
      salesData,
      paymentMethods: paymentMethodsWithPercentage,
      cashierPerformance: Object.values(cashierPerformance)
    });
  } catch (error) {
    console.error('❌ Error getting sales analytics:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get single order
router.get('/:id', authenticate, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create order (pharmacist)
router.post('/', authenticate, async (req, res) => {
  try {
    console.log('📦 Creating order, user:', req.user);
    console.log('📦 Request body:', req.body);
    
    const { customerName, customerPhone, items, subtotal, discount, total } = req.body;
    
    // Validate required fields
    if (!customerName || !items || items.length === 0) {
      console.log('❌ Validation failed: missing customerName or items');
      return res.status(400).json({ message: 'Customer name and items are required' });
    }
    
    if (!req.user.fullName) {
      console.log('❌ Missing fullName in token:', req.user);
      return res.status(400).json({ message: 'User fullName not found in token. Please logout and login again.' });
    }
    
    const order = new Order({
      customerName,
      customerPhone,
      items,
      subtotal,
      discount,
      total,
      createdBy: req.user.fullName,
      createdByRole: req.user.role,
      status: 'pending'
    });
    
    await order.save();
    
    console.log('✅ Order created successfully:', order.orderNumber);
    
    res.status(201).json({
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    console.log('❌ Error creating order:', error.message);
    res.status(400).json({ message: error.message });
  }
});

// Complete order (cashier)
router.post('/:id/complete', authenticate, async (req, res) => {
  try {
    const { paymentMethod, amountReceived, change } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Order is not pending' });
    }
    
    order.status = 'completed';
    order.completedBy = req.user.fullName;
    order.completedAt = new Date();
    order.paymentMethod = paymentMethod;
    order.amountReceived = amountReceived;
    order.change = change;
    
    await order.save();
    
    res.json({
      message: 'Order completed successfully',
      order
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Cancel order
router.post('/:id/cancel', authenticate, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending orders can be cancelled' });
    }
    
    order.status = 'cancelled';
    await order.save();
    
    res.json({
      message: 'Order cancelled successfully',
      order
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Create sample orders for testing (development only)
router.post('/create-sample-data', authenticate, async (req, res) => {
  try {
    // Only allow in development
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ message: 'Not allowed in production' });
    }
    
    // Clear existing orders
    await Order.deleteMany({});
    
    // Create sample completed orders
    const sampleOrders = [
      {
        customerName: 'Alemayehu Tadesse',
        customerPhone: '+251911234567',
        items: [
          {
            medicineId: '507f1f77bcf86cd799439011',
            name: 'Amoxicillin 500mg',
            generic: 'Amoxicillin',
            price: 25.50,
            quantity: 2,
            category: 'Antibiotics'
          },
          {
            medicineId: '507f1f77bcf86cd799439012',
            name: 'Paracetamol 500mg',
            generic: 'Paracetamol',
            price: 5.00,
            quantity: 10,
            category: 'Analgesics'
          }
        ],
        subtotal: 101.00,
        discount: 1.00,
        total: 100.00,
        status: 'completed',
        createdBy: req.user.fullName,
        createdByRole: req.user.role,
        completedBy: 'Dawit Tesfaye',
        completedAt: new Date('2026-04-25T10:30:00Z'),
        paymentMethod: 'cash',
        amountReceived: 100.00,
        change: 0.00
      },
      {
        customerName: 'Hanna Girma',
        customerPhone: '+251922345678',
        items: [
          {
            medicineId: '507f1f77bcf86cd799439013',
            name: 'Metformin 850mg',
            generic: 'Metformin HCl',
            price: 15.75,
            quantity: 3,
            category: 'Antidiabetics'
          }
        ],
        subtotal: 47.25,
        discount: 0.00,
        total: 47.25,
        status: 'completed',
        createdBy: req.user.fullName,
        createdByRole: req.user.role,
        completedBy: 'Dawit Tesfaye',
        completedAt: new Date('2026-04-24T14:15:00Z'),
        paymentMethod: 'card',
        amountReceived: 47.25,
        change: 0.00
      },
      {
        customerName: 'Mulugeta Bekele',
        customerPhone: '+251933456789',
        items: [
          {
            medicineId: '507f1f77bcf86cd799439014',
            name: 'Atorvastatin 20mg',
            generic: 'Atorvastatin Calcium',
            price: 32.00,
            quantity: 1,
            category: 'Cardiovascular'
          },
          {
            medicineId: '507f1f77bcf86cd799439012',
            name: 'Paracetamol 500mg',
            generic: 'Paracetamol',
            price: 5.00,
            quantity: 5,
            category: 'Analgesics'
          }
        ],
        subtotal: 57.00,
        discount: 2.00,
        total: 55.00,
        status: 'completed',
        createdBy: req.user.fullName,
        createdByRole: req.user.role,
        completedBy: 'Alemayehu Tadesse',
        completedAt: new Date('2026-04-23T16:45:00Z'),
        paymentMethod: 'mobile',
        amountReceived: 55.00,
        change: 0.00
      },
      {
        customerName: 'Selamawit Tesfaye',
        customerPhone: '+251944567890',
        items: [
          {
            medicineId: '507f1f77bcf86cd799439011',
            name: 'Amoxicillin 500mg',
            generic: 'Amoxicillin',
            price: 25.50,
            quantity: 1,
            category: 'Antibiotics'
          }
        ],
        subtotal: 25.50,
        discount: 0.00,
        total: 25.50,
        status: 'completed',
        createdBy: req.user.fullName,
        createdByRole: req.user.role,
        completedBy: 'Dawit Tesfaye',
        completedAt: new Date('2026-04-22T09:20:00Z'),
        paymentMethod: 'cash',
        amountReceived: 30.00,
        change: 4.50
      },
      {
        customerName: 'Yohannes Mekuria',
        customerPhone: '+251955678901',
        items: [
          {
            medicineId: '507f1f77bcf86cd799439013',
            name: 'Metformin 850mg',
            generic: 'Metformin HCl',
            price: 15.75,
            quantity: 2,
            category: 'Antidiabetics'
          },
          {
            medicineId: '507f1f77bcf86cd799439014',
            name: 'Atorvastatin 20mg',
            generic: 'Atorvastatin Calcium',
            price: 32.00,
            quantity: 1,
            category: 'Cardiovascular'
          }
        ],
        subtotal: 63.50,
        discount: 3.50,
        total: 60.00,
        status: 'completed',
        createdBy: req.user.fullName,
        createdByRole: req.user.role,
        completedBy: 'Alemayehu Tadesse',
        completedAt: new Date('2026-04-21T11:10:00Z'),
        paymentMethod: 'card',
        amountReceived: 60.00,
        change: 0.00
      }
    ];

    const createdOrders = await Order.insertMany(sampleOrders);
    
    // Calculate summary
    const totalRevenue = sampleOrders.reduce((sum, order) => sum + order.total, 0);
    const paymentBreakdown = sampleOrders.reduce((acc, order) => {
      acc[order.paymentMethod] = (acc[order.paymentMethod] || 0) + order.total;
      return acc;
    }, {});
    
    res.json({
      message: 'Sample orders created successfully',
      count: createdOrders.length,
      totalRevenue,
      paymentBreakdown,
      orders: createdOrders
    });
  } catch (error) {
    console.error('❌ Error creating sample orders:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
