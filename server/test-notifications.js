require('dotenv').config();
const mongoose = require('mongoose');
const notificationService = require('./src/services/notificationService');

async function testNotifications() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Test payment notification
    console.log('\n📧 Testing payment notification...');
    const result = await notificationService.notifyPaymentReceived({
      _id: 'test123',
      amount: 'ETB 150.00',
      invoiceNumber: 'ORD-001',
      saleId: 'test123'
    });
    console.log(`✅ Created ${result} notifications`);

    // Test large transaction notification
    console.log('\n📧 Testing large transaction notification...');
    const result2 = await notificationService.notifyLargeTransaction({
      _id: 'test456',
      totalAmount: 'ETB 1500.00',
      invoiceNumber: 'ORD-002'
    });
    console.log(`✅ Created ${result2} notifications`);

    // List all notifications
    const Notification = require('./src/models/Notification');
    const notifications = await Notification.find().sort({ createdAt: -1 }).limit(5);
    console.log('\n📋 Recent notifications:');
    notifications.forEach(n => {
      console.log(`  - [${n.type}] ${n.title}: ${n.message}`);
    });

    // List all users with admin or cashier role
    const User = require('./src/models/User');
    const users = await User.find({ role: { $in: ['admin', 'cashier'] } }).select('fullName email role');
    console.log('\n👥 Users with admin/cashier role:');
    users.forEach(u => {
      console.log(`  - ${u.fullName} (${u.email}) - ${u.role}`);
    });

    await mongoose.disconnect();
    console.log('\n✅ Test completed');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testNotifications();
