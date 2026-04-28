require('dotenv').config();
const mongoose = require('mongoose');

async function debugNotifications() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const Notification = require('./src/models/Notification');
    const User = require('./src/models/User');

    // Check users
    console.log('👥 Checking users...');
    const allUsers = await User.find().select('fullName email role');
    console.log(`Total users: ${allUsers.length}`);
    allUsers.forEach(u => {
      console.log(`  - ${u.fullName} (${u.email}) - Role: ${u.role}`);
    });

    // Check admin users specifically
    console.log('\n👑 Admin users:');
    const adminUsers = await User.find({ role: 'admin' }).select('fullName email role');
    console.log(`Total admins: ${adminUsers.length}`);
    adminUsers.forEach(u => {
      console.log(`  - ${u.fullName} (${u.email})`);
    });

    // Check cashier users
    console.log('\n💰 Cashier users:');
    const cashierUsers = await User.find({ role: 'cashier' }).select('fullName email role');
    console.log(`Total cashiers: ${cashierUsers.length}`);
    cashierUsers.forEach(u => {
      console.log(`  - ${u.fullName} (${u.email})`);
    });

    // Check all notifications
    console.log('\n🔔 All notifications:');
    const notifications = await Notification.find().sort({ createdAt: -1 }).limit(10).populate('userId', 'fullName email');
    console.log(`Total notifications: ${await Notification.countDocuments()}`);
    console.log(`Recent 10 notifications:`);
    notifications.forEach(n => {
      const userName = n.userId ? `${n.userId.fullName} (${n.userId.email})` : 'No user';
      console.log(`  - [${n.type}] ${n.title} - ${userName} - ${n.read ? 'Read' : 'Unread'}`);
      console.log(`    Message: ${n.message}`);
      console.log(`    Created: ${n.createdAt}`);
    });

    // Check notifications by category
    console.log('\n📊 Notifications by category:');
    const categories = await Notification.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    categories.forEach(c => {
      console.log(`  - ${c._id}: ${c.count}`);
    });

    // Check unread notifications per user
    console.log('\n📬 Unread notifications per user:');
    const unreadByUser = await Notification.aggregate([
      { $match: { read: false } },
      { $group: { _id: '$userId', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    for (const item of unreadByUser) {
      if (item._id) {
        const user = await User.findById(item._id).select('fullName email');
        console.log(`  - ${user ? user.fullName : 'Unknown'}: ${item.count} unread`);
      } else {
        console.log(`  - No userId: ${item.count} notifications`);
      }
    }

    await mongoose.disconnect();
    console.log('\n✅ Debug completed');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

debugNotifications();
