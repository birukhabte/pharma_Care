const express = require('express');
const router = express.Router();
const PurchaseOrder = require('../models/PurchaseOrder');
const authenticate = require('../middleware/auth');
const { checkPermission } = require('../middleware/rbac');

// Get all purchase orders
router.get('/', authenticate, async (req, res) => {
  try {
    const { status, supplierId, page = 1, limit = 50 } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (supplierId) query.supplierId = supplierId;

    const orders = await PurchaseOrder.find(query)
      .populate('supplierId', 'name contactPerson phone')
      .populate('createdBy', 'fullName')
      .populate('approvedBy', 'fullName')
      .sort({ orderDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await PurchaseOrder.countDocuments(query);

    res.json({
      orders,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get purchase order by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const order = await PurchaseOrder.findById(req.params.id)
      .populate('supplierId')
      .populate('items.medicineId')
      .populate('createdBy', 'fullName')
      .populate('approvedBy', 'fullName')
      .populate('receivedBy', 'fullName');
    
    if (!order) {
      return res.status(404).json({ message: 'Purchase order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create purchase order
router.post('/', authenticate, checkPermission('purchase_orders', 'create'), async (req, res) => {
  try {
    const orderData = {
      ...req.body,
      createdBy: req.user.id
    };
    const order = new PurchaseOrder(orderData);
    const newOrder = await order.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update purchase order
router.put('/:id', authenticate, checkPermission('purchase_orders', 'update'), async (req, res) => {
  try {
    const order = await PurchaseOrder.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!order) {
      return res.status(404).json({ message: 'Purchase order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Approve purchase order
router.patch('/:id/approve', authenticate, checkPermission('purchase_orders', 'approve'), async (req, res) => {
  try {
    const order = await PurchaseOrder.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Purchase order not found' });
    }

    order.status = 'approved';
    order.approvedBy = req.user.id;
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Receive purchase order
router.patch('/:id/receive', authenticate, async (req, res) => {
  try {
    const { receivedItems } = req.body;
    const order = await PurchaseOrder.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Purchase order not found' });
    }

    const allReceived = receivedItems.every(item => item.received);
    
    order.status = allReceived ? 'received' : 'partially_received';
    order.actualDeliveryDate = new Date();
    order.receivedBy = req.user.id;

    await order.save();
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete purchase order
router.delete('/:id', authenticate, checkPermission('purchase_orders', 'delete'), async (req, res) => {
  try {
    const order = await PurchaseOrder.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Purchase order not found' });
    }
    res.json({ message: 'Purchase order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
