require('dotenv').config();
const mongoose = require('mongoose');

async function createTestNotification() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const notificationService = require('./src/services/notificationService');
    const User = require('./src/models/User');

    // Find an admin user
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      console.log('❌ No admin user found. Please create an admin user first.');
      process.exit(1);
    }

    console.log(`📧 Creating test notification for admin: ${admin.fullName} (${admin.email})\n`);

    // Test 1: Create notification for specific user
    console.log('Test 1: Creating notification for specific user...');
    await notificationService.createNotification({
      userId: admin._id,
      type: 'info',
      category: 'sales',
      title: 'Test Notification',
      message: 'This is a test notification created manually',
      priority: 'medium'
    });
    console.log('✅ Created notification for specific user\n');

    // Test 2: Create notification for all admins
    console.log('Test 2: Creating notification for all admins...');
    const count = await notificationService.createNotificationForRoles({
      roles: ['admin'],
      type: 'success',
      category: 'sales',
      title: 'Test Sale Notification',
      message: 'Test sale completed: Paracetamol (5 units, 95 remaining)',
      link: '/sales',
      priority: 'medium'
    });
    console.log(`✅ Created ${count} notifications for admins\n`);

    // Test 3: Simulate payment received
    console.log('Test 3: Simulating payment received notification...');
    await notificationService.notifyPaymentReceived({
      _id: 'test123',
      amount: 'ETB 250.00',
      invoiceNumber: 'TEST-001',
      saleId: 'test123'
    });
    console.log('✅ Created payment received notification\n');

    // List recent notifications
    const Notification = require('./src/models/Notification');
    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'fullName email');
    
    console.log('📋 Recent 5 notifications:');
    notifications.forEach(n => {
      const userName = n.userId ? `${n.userId.fullName}` : 'No user';
      console.log(`  - [${n.type}] ${n.title} - For: ${userName} - ${n.read ? 'Read' : 'Unread'}`);
    });

    await mongoose.disconnect();
    console.log('\n✅ Test completed successfully');
  } catch (error) {
    console.error('❌ Error:', error);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

createTestNotification();
