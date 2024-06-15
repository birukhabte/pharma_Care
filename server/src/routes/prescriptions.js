const express = require('express');
const router = express.Router();
const Prescription = require('../models/Prescription');
const authenticate = require('../middleware/auth');
const { checkPermission } = require('../middleware/rbac');

// Get all prescriptions
router.get('/', authenticate, async (req, res) => {
  try {
    const { status, search, page = 1, limit = 50 } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { prescriptionNumber: { $regex: search, $options: 'i' } },
        { patientName: { $regex: search, $options: 'i' } },
        { doctorName: { $regex: search, $options: 'i' } }
      ];
    }

    const prescriptions = await Prescription.find(query)
      .populate('customerId', 'name phone')
      .populate('filledBy', 'fullName')
      .sort({ issueDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Prescription.countDocuments(query);

    res.json({
      prescriptions,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get prescription by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate('customerId')
      .populate('filledBy', 'fullName')
      .populate('medicines.medicineId');
    
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }
    res.json(prescription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create prescription
router.post('/', authenticate, checkPermission('prescriptions', 'create'), async (req, res) => {
  try {
    const prescription = new Prescription(req.body);
    const newPrescription = await prescription.save();
    res.status(201).json(newPrescription);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update prescription
router.put('/:id', authenticate, checkPermission('prescriptions', 'update'), async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }
    res.json(prescription);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Fill prescription
router.patch('/:id/fill', authenticate, async (req, res) => {
  try {
    const { saleId } = req.body;
    const prescription = await Prescription.findById(req.params.id);
    
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    prescription.status = 'filled';
    prescription.filledDate = new Date();
    prescription.filledBy = req.user.id;
    prescription.saleId = saleId;

    await prescription.save();
    res.json(prescription);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete prescription
router.delete('/:id', authenticate, checkPermission('prescriptions', 'delete'), async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndDelete(req.params.id);
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }
    res.json({ message: 'Prescription deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
// Commit on 2024-06-4 at 13:13
// Commit on 2024-06-15 at 16:14
