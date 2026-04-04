const express = require('express');
const router = express.Router();
const StockMovement = require('../models/StockMovement');
const Medicine = require('../models/Medicine');
const authenticate = require('../middleware/auth');

// Get all stock movements
router.get('/', authenticate, async (req, res) => {
  try {
    const { medicineId, type, startDate, endDate, page = 1, limit = 100 } = req.query;
    
    const query = {};
    if (medicineId) query.medicineId = medicineId;
    if (type) query.type = type;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const movements = await StockMovement.find(query)
      .populate('medicineId', 'name genericName')
      .populate('batchId', 'batchNumber')
      .populate('performedBy', 'fullName')
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await StockMovement.countDocuments(query);

    res.json({
      movements,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get stock movement by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const movement = await StockMovement.findById(req.params.id)
      .populate('medicineId')
      .populate('batchId')
      .populate('performedBy', 'fullName');
    
    if (!movement) {
      return res.status(404).json({ message: 'Stock movement not found' });
    }
    res.json(movement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create stock movement (adjustment)
router.post('/', authenticate, async (req, res) => {
  try {
    const { medicineId, quantity, type, reason } = req.body;
    
    // Get current stock
    const medicine = await Medicine.findById(medicineId);
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    const previousStock = medicine.stock;
    let newStock = previousStock;

    // Calculate new stock based on type
    if (type === 'in' || type === 'return') {
      newStock = previousStock + quantity;
    } else if (type === 'out' || type === 'adjustment' || type === 'expired' || type === 'damaged') {
      newStock = previousStock - quantity;
    }

    // Create movement record
    const movement = new StockMovement({
      ...req.body,
      previousStock,
      newStock,
      performedBy: req.user.id
    });

    await movement.save();

    // Update medicine stock
    medicine.stock = newStock;
    await medicine.save();

    res.status(201).json(movement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get stock history for a medicine
router.get('/medicine/:medicineId/history', authenticate, async (req, res) => {
  try {
    const movements = await StockMovement.find({ medicineId: req.params.medicineId })
      .populate('batchId', 'batchNumber')
      .populate('performedBy', 'fullName')
      .sort({ date: -1 })
      .limit(100);

    res.json(movements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
