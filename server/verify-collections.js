require('dotenv').config();
const mongoose = require('mongoose');

async function verify() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\nCollections found:');
    collections.forEach(c => console.log(`  - ${c.name}`));
    
    // Count documents
    const Customer = require('./src/models/Customer');
    const Supplier = require('./src/models/Supplier');
    const Settings = require('./src/models/Settings');
    
    console.log('\nDocument counts:');
    console.log(`  Customers: ${await Customer.countDocuments()}`);
    console.log(`  Suppliers: ${await Supplier.countDocuments()}`);
    console.log(`  Settings: ${await Settings.countDocuments()}`);
    
    await mongoose.connection.close();
    console.log('\nVerification complete!');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

verify();
