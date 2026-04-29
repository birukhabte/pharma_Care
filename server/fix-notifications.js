require('dotenv').config();
const mongoose = require('mongoose');

async function fixNotifications() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const User = require('./src/models/User');
    const Notification = require('./src/models/Notification');

    // Step 1: Check users
    console.log('📋 Step 1: Checking users...');
    const allUsers = await User.find().select('fullName email role');
    console.log(`Total users: ${allUsers.length}`);
    
    if (allUsers.length === 0) {
      console.log('❌ No users found! Please create users first.');
      process.exit(1);
    }

    allUsers.forEach(u => {
      console.log(`  - ${u.fullName} (${u.email}) - Role: "${u.role}"`);
    });

    // Step 2: Check for users with required roles
    console.log('\n📋 Step 2: Checking required roles...');
    const adminUsers = await User.find({ role: 'admin' });
    const cashierUsers = await User.find({ role: 'cashier' });
    const pharmacistUsers = await User.find({ role: 'pharmacist' });

    console.log(`Admins: ${adminUsers.length}`);
    console.log(`Cashiers: ${cashierUsers.length}`);
    console.log(`Pharmacists: ${pharmacistUsers.length}`);

    if (adminUsers.length === 0) {
      console.log('\n⚠️  WARNING: No admin users found!');
      console.log('Notifications for admins will not be delivered.');
    }

    if (cashierUsers.length === 0) {
      console.log('\n⚠️  WARNING: No cashier users found!');
      console.log('Notifications for cashiers will not be delivered.');
    }

    // Step 3: Create test notifications
    console.log('\n📋 Step 3: Creating test notifications...');
    
    if (adminUsers.length > 0) {
      const admin = adminUsers[0];
      await Notification.create({
        userId: admin._id,
        type: 'info',
        category: 'sales',
        title: 'Test Notification for Admin',
        message: 'This is a test notification to verify the system is working',
        priority: 'medium',
        read: false
      });
      console.log(`✅ Created test notification for admin: ${admin.fullName}`);
    }

    if (cashierUsers.length > 0) {
      const cashier = cashierUsers[0];
      await Notification.create({
        userId: cashier._id,
        type: 'info',
        category: 'sales',
        title: 'Test Notification for Cashier',
        message: 'This is a test notification to verify the system is working',
        priority: 'high',
        read: false
      });
      console.log(`✅ Created test notification for cashier: ${cashier.fullName}`);
    }

    // Step 4: Check notifications
    console.log('\n📋 Step 4: Checking notifications...');
    const totalNotifications = await Notification.countDocuments();
    const unreadNotifications = await Notification.countDocuments({ read: false });
    console.log(`Total notifications: ${totalNotifications}`);
    console.log(`Unread notifications: ${unreadNotifications}`);

    // Step 5: Show recent notifications
    console.log('\n📋 Step 5: Recent notifications:');
    const recentNotifications = await Notification.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'fullName email role');

    recentNotifications.forEach(n => {
      const user = n.userId ? `${n.userId.fullName} (${n.userId.role})` : 'No user';
      console.log(`  - [${n.type}] ${n.title}`);
      console.log(`    For: ${user}`);
      console.log(`    Status: ${n.read ? 'Read' : 'UNREAD'}`);
      console.log(`    Created: ${n.createdAt.toLocaleString()}`);
    });

    // Step 6: Instructions
    console.log('\n📋 Step 6: Next steps:');
    console.log('1. Make sure your server is running: npm run dev');
    console.log('2. Login to the frontend with an admin or cashier account');
    console.log('3. Check the notification bell icon in the navbar');
    console.log('4. You should see the test notifications created above');
    console.log('\nIf notifications still don\'t appear:');
    console.log('- Check browser console for errors');
    console.log('- Check server logs for notification API calls');
    console.log('- Verify the logged-in user has the correct role');

    await mongoose.disconnect();
    console.log('\n✅ Fix completed');
  } catch (error) {
    console.error('❌ Error:', error);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

fixNotifications();
