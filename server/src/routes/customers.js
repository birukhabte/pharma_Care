const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const authenticate = require('../middleware/auth');
const { checkPermission } = require('../middleware/rbac');

// Get all customers
router.get('/', authenticate, async (req, res) => {
  try {
    const { status, search, page = 1, limit = 50 } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const customers = await Customer.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Customer.countDocuments(query);

    res.json({
      customers,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get customer by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create customer
router.post('/', authenticate, checkPermission('customers', 'create'), async (req, res) => {
  try {
    const customer = new Customer(req.body);
    const newCustomer = await customer.save();
    res.status(201).json(newCustomer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update customer
router.put('/:id', authenticate, checkPermission('customers', 'update'), async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete customer
router.delete('/:id', authenticate, checkPermission('customers', 'delete'), async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update loyalty points
router.patch('/:id/loyalty', authenticate, async (req, res) => {
  try {
    const { points, operation } = req.body;
    const customer = await Customer.findById(req.params.id);
    
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    if (operation === 'add') {
      customer.loyaltyPoints += points;
    } else if (operation === 'redeem') {
      if (customer.loyaltyPoints < points) {
        return res.status(400).json({ message: 'Insufficient loyalty points' });
      }
      customer.loyaltyPoints -= points;
    }

    await customer.save();
    res.json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
// Commit on 2024-06-3 at 12:34
// Commit on 2024-06-21 at 16:49
// Commit on 2024-06-31 at 15:29
// Commit on 2024-06-11 at 12:5
