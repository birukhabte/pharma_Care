const express = require('express');
const router = express.Router();
const Supplier = require('../models/Supplier');
const authenticate = require('../middleware/auth');
const { checkPermission } = require('../middleware/rbac');

// Get all suppliers
router.get('/', authenticate, async (req, res) => {
  try {
    const startTime = Date.now();
    const { status, category, search, page = 1, limit = 100 } = req.query;
    
    const query = {};
    if (status && status !== 'all') query.status = status;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { contactPerson: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const queryStartTime = Date.now();
    // Use lean() for faster queries and select only needed fields
    // Removed countDocuments for speed - just return all suppliers
    const suppliers = await Supplier.find(query)
      .select('name contactPerson phone email address category status rating totalOrders lastOrderDate createdAt')
      .sort({ name: 1 })
      .limit(limit * 1)
      .lean()
      .exec();
    
    const queryEndTime = Date.now();

    console.log(`Suppliers query took ${queryEndTime - queryStartTime}ms, total: ${queryEndTime - startTime}ms, count: ${suppliers.length}`);

    res.json({
      suppliers,
      totalPages: 1,
      currentPage: 1,
      total: suppliers.length
    });
  } catch (error) {
    console.error('Suppliers route error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get supplier by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    res.json(supplier);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create supplier
router.post('/', authenticate, checkPermission('suppliers', 'create'), async (req, res) => {
  try {
    const supplier = new Supplier(req.body);
    const newSupplier = await supplier.save();
    res.status(201).json(newSupplier);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update supplier
router.put('/:id', authenticate, checkPermission('suppliers', 'update'), async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    res.json(supplier);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete supplier
router.delete('/:id', authenticate, checkPermission('suppliers', 'delete'), async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndDelete(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    res.json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
