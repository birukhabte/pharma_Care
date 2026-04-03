require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Medicine = require('../models/Medicine');
const Sale = require('../models/Sale');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await User.deleteMany({});
    await Medicine.deleteMany({});
    await Sale.deleteMany({});

    const hashedPassword = await bcrypt.hash('Pharma@2026', 10);
    
    const users = await User.insertMany([
      {
        email: 'ravi.patel@pharmacare.in',
        password: hashedPassword,
        fullName: 'Ravi Patel',
        role: 'head_pharmacist',
        pharmacyName: 'PharmaCare Central'
      },
      {
        email: 'meera.nair@pharmacare.in',
        password: await bcrypt.hash('Staff@2026', 10),
        fullName: 'Meera Nair',
        role: 'counter_staff',
        pharmacyName: 'PharmaCare Central'
      },
      {
        email: 'arjun.sharma@pharmacare.in',
        password: await bcrypt.hash('Invent@2026', 10),
        fullName: 'Arjun Sharma',
        role: 'inventory_manager',
        pharmacyName: 'PharmaCare Central'
      }
    ]);

    const medicines = await Medicine.insertMany([
      {
        name: 'Amoxicillin 500mg Cap',
        genericName: 'Amoxicillin',
        category: 'Antibiotics',
        manufacturer: 'Cipla Ltd.',
        batchCount: 3,
        stockQty: 480,
        reorderLevel: 200,
        unitPrice: 0.85,
        costPrice: 0.58,
        supplier: 'MedWholesale India',
        status: 'active',
        dosageForm: 'Capsule',
        strength: '500mg',
        hsnCode: '30041011',
        gstRate: 12,
        schedule: 'H'
      },
      {
        name: 'Metformin 850mg Tab',
        genericName: 'Metformin HCl',
        category: 'Antidiabetics',
        manufacturer: 'Sun Pharma',
        batchCount: 2,
        stockQty: 8,
        reorderLevel: 150,
        unitPrice: 0.42,
        costPrice: 0.28,
        supplier: 'PharmaDist Co.',
        status: 'low_stock',
        dosageForm: 'Tablet',
        strength: '850mg',
        hsnCode: '30049099',
        gstRate: 12,
        schedule: 'H'
      },
      {
        name: 'Atorvastatin 20mg Tab',
        genericName: 'Atorvastatin Calcium',
        category: 'Cardiovascular',
        manufacturer: 'Torrent Pharma',
        batchCount: 4,
        stockQty: 620,
        reorderLevel: 180,
        unitPrice: 1.20,
        costPrice: 0.76,
        supplier: 'MedWholesale India',
        status: 'active',
        dosageForm: 'Tablet',
        strength: '20mg',
        hsnCode: '30049099',
        gstRate: 12,
        schedule: 'H'
      },
      {
        name: 'Dolo 650 Paracetamol',
        genericName: 'Paracetamol',
        category: 'Analgesics',
        manufacturer: 'Micro Labs',
        batchCount: 5,
        stockQty: 1240,
        reorderLevel: 500,
        unitPrice: 0.28,
        costPrice: 0.16,
        supplier: 'HealthSupply Hub',
        status: 'active',
        dosageForm: 'Tablet',
        strength: '650mg',
        hsnCode: '30049099',
        gstRate: 12,
        schedule: 'OTC'
      }
    ]);

    await Sale.insertMany([
      {
        invoiceNo: 'INV-2026-0412',
        customerName: 'Rajesh Kumar',
        items: [
          { medicine: medicines[0]._id, quantity: 2, price: 1.70 },
          { medicine: medicines[3]._id, quantity: 10, price: 2.80 }
        ],
        totalAmount: 245.80,
        paymentMethod: 'UPI',
        soldBy: users[1]._id
      },
      {
        invoiceNo: 'INV-2026-0411',
        customerName: 'Priya Sharma',
        items: [
          { medicine: medicines[2]._id, quantity: 30, price: 36.00 }
        ],
        totalAmount: 128.50,
        paymentMethod: 'Cash',
        soldBy: users[1]._id
      }
    ]);

    console.log('Database seeded successfully!');
    console.log(`Created ${users.length} users`);
    console.log(`Created ${medicines.length} medicines`);
    console.log('Created 2 sample sales');
    
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

connectDB().then(seedData);
