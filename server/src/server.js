require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const medicineRoutes = require('./routes/medicines');
const dashboardRoutes = require('./routes/dashboard');
const supplierRoutes = require('./routes/suppliers');
const prescriptionRoutes = require('./routes/prescriptions');
const purchaseOrderRoutes = require('./routes/purchaseOrders');
const stockMovementRoutes = require('./routes/stockMovements');
const notificationRoutes = require('./routes/notifications');
const settingsRoutes = require('./routes/settings');
const auditLogRoutes = require('./routes/auditLogs');
const seedRoutes = require('./routes/seed');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/purchase-orders', purchaseOrderRoutes);
app.use('/api/stock-movements', stockMovementRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/audit-logs', auditLogRoutes);
app.use('/api/seed', seedRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server (only in non-serverless environment)
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`PharmaCare API running on port ${PORT}`);
    console.log(`Available routes:`);
    console.log(`  - /api/auth`);
    console.log(`  - /api/medicines`);
    console.log(`  - /api/dashboard`);
    console.log(`  - /api/suppliers`);
    console.log(`  - /api/prescriptions`);
    console.log(`  - /api/purchase-orders`);
    console.log(`  - /api/stock-movements`);
    console.log(`  - /api/notifications`);
    console.log(`  - /api/settings`);
    console.log(`  - /api/audit-logs`);
    console.log(`  - /api/products`);
    console.log(`  - /api/orders`);
    console.log(`  - /api/seed (POST to seed database)`);
  });
}

// Export for Vercel serverless functions
module.exports = app;
