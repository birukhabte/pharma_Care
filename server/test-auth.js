require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const testAuth = async () => {
  try {
    // Find the admin user
    const user = await User.findOne({ email: 'admin@pharmacare.et' });
    
    if (!user) {
      console.log('❌ Admin user not found');
      
      // Create admin user
      const hashedPassword = await bcrypt.hash('Pharma@2026', 10);
      const newUser = new User({
        email: 'admin@pharmacare.et',
        password: hashedPassword,
        fullName: 'Alemayehu Tadesse',
        role: 'admin',
        pharmacyName: 'PharmaCare Addis Ababa'
      });
      
      await newUser.save();
      console.log('✅ Created admin user');
    } else {
      console.log('✅ Admin user found:', user.email);
      
      // Test password
      const isValidPassword = await bcrypt.compare('Pharma@2026', user.password);
      console.log('🔐 Password test result:', isValidPassword);
      
      if (!isValidPassword) {
        console.log('❌ Password mismatch - updating password');
        const hashedPassword = await bcrypt.hash('Pharma@2026', 10);
        user.password = hashedPassword;
        await user.save();
        console.log('✅ Password updated');
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error testing auth:', error);
    process.exit(1);
  }
};

connectDB().then(testAuth);