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

module.exports = router;
