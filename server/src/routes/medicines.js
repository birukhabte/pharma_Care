const express = require('express');
const { body, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/auth');
const Medicine = require('../models/Medicine');

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const startTime = Date.now();
    const { status, category, search, page = 1, limit = 100 } = req.query;
    
    const query = {};
    if (status && status !== 'all') query.status = status;
    if (category && category !== 'all') query.category = category;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { genericName: { $regex: search, $options: 'i' } },
        { manufacturer: { $regex: search, $options: 'i' } }
      ];
    }

    // Use lean() for faster queries and select only needed fields
    const medicines = await Medicine.find(query)
      .select('name genericName category manufacturer stock reorderLevel unitPrice costPrice supplier status dosageForm strength hsnCode gstRate schedule createdAt')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .lean()
      .exec();
    
    const queryEndTime = Date.now();
    console.log(`Medicines query took ${queryEndTime - startTime}ms, count: ${medicines.length}`);

    res.json({ medicines, total: medicines.length });
  } catch (error) {
    console.error('Medicines route error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ error: 'Medicine not found' });
    }
    res.json(medicine);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post(
  '/',
  authMiddleware,
  [
    body('name').notEmpty().withMessage('Medicine name is required'),
    body('genericName').notEmpty().withMessage('Generic name is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('unitPrice').isFloat({ min: 0 }).withMessage('Valid unit price is required'),
    body('costPrice').isFloat({ min: 0 }).withMessage('Valid cost price is required'),
    body('productionDate').notEmpty().withMessage('Production date is required')
      .isISO8601().withMessage('Production date must be a valid date'),
    body('expiryDate').notEmpty().withMessage('Expiry date is required')
      .isISO8601().withMessage('Expiry date must be a valid date')
      .custom((value, { req }) => {
        if (new Date(value) <= new Date(req.body.productionDate)) {
          throw new Error('Expiry date must be after production date');
        }
        return true;
      })
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const newMedicine = new Medicine(req.body);
      await newMedicine.save();
      res.status(201).json(newMedicine);
    } catch (error) {
      console.error('Error creating medicine:', error);
      res.status(500).json({ error: 'Server error', details: error.message });
    }
  }
);

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!medicine) {
      return res.status(404).json({ error: 'Medicine not found' });
    }
    
    res.json(medicine);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!medicine) {
      return res.status(404).json({ error: 'Medicine not found' });
    }
    
    res.json(medicine);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndDelete(req.params.id);
    
    if (!medicine) {
      return res.status(404).json({ error: 'Medicine not found' });
    }
    
    res.json({ message: 'Medicine deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/', authMiddleware, async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids)) {
      return res.status(400).json({ error: 'ids must be an array' });
    }

    await Medicine.deleteMany({ _id: { $in: ids } });
    res.json({ message: `${ids.length} medicines deleted successfully` });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
// Commit on 2024-06-8 at 18:9
// Commit on 2024-06-24 at 12:42
// Commit on 2024-06-27 at 15:50
