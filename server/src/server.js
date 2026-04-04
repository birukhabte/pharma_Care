require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const medicineRoutes = require('./routes/medicines');
const dashboardRoutes = require('./routes/dashboard');
const customerRoutes = require('./routes/customers');
const supplierRoutes = require('./routes/suppliers');
const prescriptionRoutes = require('./routes/prescriptions');
const purchaseOrderRoutes = require('./routes/purchaseOrders');
const stockMovementRoutes = require('./routes/stockMovements');
const notificationRoutes = require('./routes/notifications');
const settingsRoutes = require('./routes/settings');
const auditLogRoutes = require('./routes/auditLogs');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/purchase-orders', purchaseOrderRoutes);
app.use('/api/stock-movements', stockMovementRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/audit-logs', auditLogRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`PharmaCare API running on port ${PORT}`);
  console.log(`Available routes:`);
  console.log(`  - /api/auth`);
  console.log(`  - /api/medicines`);
  console.log(`  - /api/dashboard`);
  console.log(`  - /api/customers`);
  console.log(`  - /api/suppliers`);
  console.log(`  - /api/prescriptions`);
  console.log(`  - /api/purchase-orders`);
  console.log(`  - /api/stock-movements`);
  console.log(`  - /api/notifications`);
  console.log(`  - /api/settings`);
  console.log(`  - /api/audit-logs`);
});
