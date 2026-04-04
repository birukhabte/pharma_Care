require('dotenv').config();
const mongoose = require('mongoose');

// Import all models
const User = require('../models/User');
const Medicine = require('../models/Medicine');
const Batch = require('../models/Batch');
const Sale = require('../models/Sale');
const Customer = require('../models/Customer');
const Supplier = require('../models/Supplier');
const Prescription = require('../models/Prescription');
const PurchaseOrder = require('../models/PurchaseOrder');
const StockMovement = require('../models/StockMovement');
const Settings = require('../models/Settings');
const AuditLog = require('../models/AuditLog');
const Notification = require('../models/Notification');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

const createIndexes = async () => {
  console.log('\n📊 Creating indexes...');
  
  try {
    await User.createIndexes();
    console.log('  ✓ User indexes created');
    
    await Medicine.createIndexes();
    console.log('  ✓ Medicine indexes created');
    
    await Batch.createIndexes();
    console.log('  ✓ Batch indexes created');
    
    await Sale.createIndexes();
    console.log('  ✓ Sale indexes created');
    
    await Customer.createIndexes();
    console.log('  ✓ Customer indexes created');
    
    await Supplier.createIndexes();
    console.log('  ✓ Supplier indexes created');
    
    await Prescription.createIndexes();
    console.log('  ✓ Prescription indexes created');
    
    await PurchaseOrder.createIndexes();
    console.log('  ✓ PurchaseOrder indexes created');
    
    await StockMovement.createIndexes();
    console.log('  ✓ StockMovement indexes created');
    
    await Settings.createIndexes();
    console.log('  ✓ Settings indexes created');
    
    await AuditLog.createIndexes();
    console.log('  ✓ AuditLog indexes created');
    
    await Notification.createIndexes();
    console.log('  ✓ Notification indexes created');
    
    console.log('✅ All indexes created successfully');
  } catch (error) {
    console.error('❌ Error creating indexes:', error.message);
  }
};

const seedSampleData = async () => {
  console.log('\n🌱 Seeding sample data...');
  
  try {
    // Check if data already exists
    const customerCount = await Customer.countDocuments();
    const supplierCount = await Supplier.countDocuments();
    const settingsCount = await Settings.countDocuments();
    
    // Seed Customers
    if (customerCount === 0) {
      const customers = [
        {
          name: 'Abebe Kebede',
          phone: '+251911234567',
          email: 'abebe.k@email.com',
          address: {
            street: 'Bole Road',
            city: 'Addis Ababa',
            state: 'Addis Ababa',
            country: 'Ethiopia'
          },
          loyaltyPoints: 150,
          totalPurchases: 5,
          status: 'active'
        },
        {
          name: 'Tigist Haile',
          phone: '+251922345678',
          email: 'tigist.h@email.com',
          address: {
            street: 'Mexico Square',
            city: 'Addis Ababa',
            state: 'Addis Ababa',
            country: 'Ethiopia'
          },
          loyaltyPoints: 320,
          totalPurchases: 12,
          status: 'active'
        },
        {
          name: 'Dawit Tesfaye',
          phone: '+251933456789',
          email: 'dawit.t@email.com',
          address: {
            street: 'Piazza',
            city: 'Addis Ababa',
            state: 'Addis Ababa',
            country: 'Ethiopia'
          },
          loyaltyPoints: 80,
          totalPurchases: 3,
          status: 'active'
        }
      ];
      
      await Customer.insertMany(customers);
      console.log('  ✓ Sample customers created');
    } else {
      console.log('  ⊘ Customers already exist, skipping');
    }
    
    // Seed Suppliers
    if (supplierCount === 0) {
      const suppliers = [
        {
          name: 'Ethiopian Pharmaceuticals Manufacturing',
          contactPerson: 'Mulugeta Assefa',
          phone: '+251116123456',
          email: 'info@epharm.et',
          address: {
            street: 'Industrial Area',
            city: 'Addis Ababa',
            state: 'Addis Ababa',
            country: 'Ethiopia'
          },
          category: 'pharmaceutical',
          paymentTerms: 'Net 30',
          creditLimit: 500000,
          status: 'active',
          rating: 4.5
        },
        {
          name: 'Global Medical Supplies',
          contactPerson: 'Sarah Johnson',
          phone: '+251117234567',
          email: 'contact@globalmed.com',
          address: {
            street: 'Airport Road',
            city: 'Addis Ababa',
            state: 'Addis Ababa',
            country: 'Ethiopia'
          },
          category: 'medical_equipment',
          paymentTerms: 'Net 45',
          creditLimit: 750000,
          status: 'active',
          rating: 4.8
        },
        {
          name: 'Addis Medical Distributors',
          contactPerson: 'Yohannes Bekele',
          phone: '+251118345678',
          email: 'sales@addismed.et',
          address: {
            street: 'Merkato',
            city: 'Addis Ababa',
            state: 'Addis Ababa',
            country: 'Ethiopia'
          },
          category: 'pharmaceutical',
          paymentTerms: 'Net 30',
          creditLimit: 300000,
          status: 'active',
          rating: 4.2
        }
      ];
      
      await Supplier.insertMany(suppliers);
      console.log('  ✓ Sample suppliers created');
    } else {
      console.log('  ⊘ Suppliers already exist, skipping');
    }
    
    // Seed Settings
    if (settingsCount === 0) {
      const settings = new Settings({
        pharmacyName: 'PharmaCare',
        pharmacyLicense: 'PH-2024-001',
        taxId: 'TIN-123456789',
        address: {
          street: 'Bole Road, Near Edna Mall',
          city: 'Addis Ababa',
          state: 'Addis Ababa',
          zipCode: '1000',
          country: 'Ethiopia'
        },
        phone: '+251116789012',
        email: 'info@pharmacare.et',
        website: 'www.pharmacare.et',
        currency: 'ETB',
        taxRate: 15,
        lowStockThreshold: 10,
        expiryAlertDays: 90,
        loyaltyEnabled: true,
        pointsPerCurrency: 1,
        pointsRedemptionRate: 0.01,
        emailNotifications: true,
        lowStockAlerts: true,
        expiryAlerts: true
      });
      
      await settings.save();
      console.log('  ✓ Default settings created');
    } else {
      console.log('  ⊘ Settings already exist, skipping');
    }
    
    console.log('✅ Sample data seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding data:', error.message);
  }
};

const verifyCollections = async () => {
  console.log('\n🔍 Verifying collections...');
  
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    const expectedCollections = [
      'users',
      'medicines',
      'batches',
      'sales',
      'customers',
      'suppliers',
      'prescriptions',
      'purchaseorders',
      'stockmovements',
      'settings',
      'auditlogs',
      'notifications'
    ];
    
    console.log('\nExisting collections:');
    expectedCollections.forEach(name => {
      const exists = collectionNames.includes(name);
      console.log(`  ${exists ? '✓' : '✗'} ${name}`);
    });
    
    // Count documents
    console.log('\nDocument counts:');
    console.log(`  Users: ${await User.countDocuments()}`);
    console.log(`  Medicines: ${await Medicine.countDocuments()}`);
    console.log(`  Batches: ${await Batch.countDocuments()}`);
    console.log(`  Sales: ${await Sale.countDocuments()}`);
    console.log(`  Customers: ${await Customer.countDocuments()}`);
    console.log(`  Suppliers: ${await Supplier.countDocuments()}`);
    console.log(`  Prescriptions: ${await Prescription.countDocuments()}`);
    console.log(`  Purchase Orders: ${await PurchaseOrder.countDocuments()}`);
    console.log(`  Stock Movements: ${await StockMovement.countDocuments()}`);
    console.log(`  Settings: ${await Settings.countDocuments()}`);
    console.log(`  Audit Logs: ${await AuditLog.countDocuments()}`);
    console.log(`  Notifications: ${await Notification.countDocuments()}`);
    
  } catch (error) {
    console.error('❌ Error verifying collections:', error.message);
  }
};

const migrate = async () => {
  console.log('🚀 Starting database migration...\n');
  console.log('Database:', process.env.MONGODB_URI?.replace(/\/\/.*:.*@/, '//***:***@'));
  
  try {
    await connectDB();
    await createIndexes();
    await seedSampleData();
    await verifyCollections();
    
    console.log('\n✅ Migration completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('  1. Restart your server: npm start');
    console.log('  2. Test the new endpoints');
    console.log('  3. Check the DATABASE_SCHEMA.md for API documentation');
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
};

// Run migration
migrate();
