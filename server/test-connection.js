require('dotenv').config();
const mongoose = require('mongoose');

console.log('Testing MongoDB connection...');
console.log('URI:', process.env.MONGODB_URI.replace(/:[^:@]+@/, ':****@')); // Hide password

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ MongoDB connection failed:');
    console.error('Error:', error.message);
    console.error('\nTroubleshooting steps:');
    console.error('1. Verify username and password in MongoDB Atlas');
    console.error('2. Check Network Access - whitelist your IP');
    console.error('3. Wait 1-2 minutes after creating user');
    console.error('4. Ensure user has "Read and write to any database" permission');
    process.exit(1);
  });
