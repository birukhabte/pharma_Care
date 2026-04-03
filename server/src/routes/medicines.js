const express = require('express');
const { body, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/auth');
const Medicine = require('../models/Medicine');

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const medicines = await Medicine.find().sort({ createdAt: -1 });
    res.json(medicines);
  } catch (error) {
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
    body('costPrice').isFloat({ min: 0 }).withMessage('Valid cost price is required')
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
      res.status(500).json({ error: 'Server error' });
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
