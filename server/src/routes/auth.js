const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

const router = express.Router();

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  async (req, res) => {
    try {
      console.log('🔐 Login attempt:', { email: req.body.email, timestamp: new Date().toISOString() });
      
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log('❌ Validation errors:', errors.array());
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        console.log('❌ User not found:', email);
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      console.log('✅ User found:', { email: user.email, role: user.role });
      
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        console.log('❌ Invalid password for:', email);
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      console.log('✅ Password valid, generating token...');

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role, fullName: user.fullName },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
      );

      console.log('✅ Login successful for:', user.email);
      
      res.json({
        token,
        user: {
          id: user._id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          pharmacyName: user.pharmacyName
        }
      });
    } catch (error) {
      console.log('❌ Server error during login:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('fullName').notEmpty().withMessage('Full name is required'),
    body('pharmacyName').notEmpty().withMessage('Pharmacy name is required'),
    body('role').notEmpty().withMessage('Role is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, fullName, pharmacyName, role } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        email,
        password: hashedPassword,
        fullName,
        pharmacyName,
        role
      });

      await newUser.save();

      const token = jwt.sign(
        { id: newUser._id, email: newUser.email, role: newUser.role, fullName: newUser.fullName },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
      );

      res.status(201).json({
        token,
        user: {
          id: newUser._id,
          email: newUser.email,
          fullName: newUser.fullName,
          role: newUser.role,
          pharmacyName: newUser.pharmacyName
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

module.exports = router;
// Commit on 2024-06-4 at 16:2
// Commit on 2024-06-8 at 14:2
// Commit on 2024-06-18 at 11:39
