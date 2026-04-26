const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const authenticate = require('../middleware/auth');

// Get all users
router.get('/', authenticate, async (req, res) => {
  try {
    const { role, status, search } = req.query;
    
    // Build query
    const query = {};
    if (role && role !== 'all') query.role = role;
    if (status && status !== 'all') query.status = status;
    
    // Add search functionality
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    
    const users = await User.find(query)
      .select('-password') // Exclude password from response
      .sort({ createdAt: -1 });
    
    res.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get single user
router.get('/:id', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create new user
router.post('/', authenticate, async (req, res) => {
  try {
    console.log('📝 Creating new user:', req.body);
    
    const { fullName, email, phone, role, password, pharmacyName } = req.body;
    
    // Validate required fields
    if (!fullName || !email || !role || !password) {
      console.log('❌ Validation failed: missing required fields');
      return res.status(400).json({ 
        message: 'Full name, email, role, and password are required' 
      });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('❌ User already exists:', email);
      return res.status(400).json({ 
        message: 'User with this email already exists' 
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Get pharmacy name from current user if not provided
    const currentUser = await User.findById(req.user.id);
    const userPharmacyName = pharmacyName || currentUser?.pharmacyName || 'PharmaCare';
    
    // Create user
    const user = new User({
      fullName,
      email,
      phone,
      role,
      password: hashedPassword,
      pharmacyName: userPharmacyName,
      status: 'active'
    });
    
    await user.save();
    console.log('✅ User created successfully:', user.email);
    
    // Return user without password
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.status(201).json({
      message: 'User created successfully',
      user: userResponse
    });
  } catch (error) {
    console.error('❌ Error creating user:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update user
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { fullName, email, phone, role, status } = req.body;
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if email is being changed and if it already exists
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ 
          message: 'User with this email already exists' 
        });
      }
    }
    
    // Update fields
    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (role) user.role = role;
    if (status) user.status = status;
    
    await user.save();
    
    // Return user without password
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.json({
      message: 'User updated successfully',
      user: userResponse
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update user password
router.patch('/:id/password', authenticate, async (req, res) => {
  try {
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    
    await user.save();
    
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ message: error.message });
  }
});

// Delete user
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Prevent deleting the last admin
    if (user.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return res.status(400).json({ 
          message: 'Cannot delete the last administrator' 
        });
      }
    }
    
    await User.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;