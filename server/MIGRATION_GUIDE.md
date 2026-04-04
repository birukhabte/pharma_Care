# Database Migration Guide

## Overview
This guide will help you migrate all new database tables/collections to your MongoDB database.

## Prerequisites

1. MongoDB is running and accessible
2. `.env` file is configured with correct `MONGODB_URI`
3. All dependencies are installed (`npm install`)

## Migration Steps

### Step 1: Run the Migration Script

```bash
cd server
npm run migrate
```

This script will:
- ✅ Connect to your MongoDB database
- ✅ Create all 12 collections with proper schemas
- ✅ Create indexes for optimal performance
- ✅ Seed sample data (customers, suppliers, settings)
- ✅ Verify all collections are created
- ✅ Display document counts

### Step 2: Verify Migration

The script will output something like:

```
🚀 Starting database migration...

✅ MongoDB Connected

📊 Creating indexes...
  ✓ User indexes created
  ✓ Medicine indexes created
  ✓ Batch indexes created
  ✓ Sale indexes created
  ✓ Customer indexes created
  ✓ Supplier indexes created
  ✓ Prescription indexes created
  ✓ PurchaseOrder indexes created
  ✓ StockMovement indexes created
  ✓ Settings indexes created
  ✓ AuditLog indexes created
  ✓ Notification indexes created
✅ All indexes created successfully

🌱 Seeding sample data...
  ✓ Sample customers created
  ✓ Sample suppliers created
  ✓ Default settings created
✅ Sample data seeded successfully

🔍 Verifying collections...

Existing collections:
  ✓ users
  ✓ medicines
  ✓ batches
  ✓ sales
  ✓ customers
  ✓ suppliers
  ✓ prescriptions
  ✓ purchaseorders
  ✓ stockmovements
  ✓ settings
  ✓ auditlogs
  ✓ notifications

Document counts:
  Users: 3
  Medicines: 15
  Batches: 20
  Sales: 10
  Customers: 3
  Suppliers: 3
  Prescriptions: 0
  Purchase Orders: 0
  Stock Movements: 0
  Settings: 1
  Audit Logs: 0
  Notifications: 0

✅ Migration completed successfully!
```

### Step 3: Restart Your Server

```bash
npm start
# or for development
npm run dev
```

### Step 4: Test the New Endpoints

You can test the new endpoints using curl, Postman, or your frontend:

```bash
# Get all customers
curl http://localhost:5000/api/customers

# Get all suppliers
curl http://localhost:5000/api/suppliers

# Get settings
curl http://localhost:5000/api/settings

# Get notifications
curl http://localhost:5000/api/notifications
```

## What Gets Created

### Collections (12 total)

**Existing (4):**
1. users
2. medicines
3. batches
4. sales

**New (8):**
5. customers - Customer information and loyalty
6. suppliers - Supplier/vendor management
7. prescriptions - Prescription tracking
8. purchaseorders - Purchase orders from suppliers
9. stockmovements - Inventory movement tracking
10. settings - System configuration
11. auditlogs - Activity tracking
12. notifications - User notifications

### Sample Data

The migration creates:
- **3 Sample Customers** with Ethiopian names and addresses
- **3 Sample Suppliers** (local and international)
- **1 Default Settings** document with PharmaCare configuration

### Indexes

All collections get optimized indexes for:
- Fast lookups (ID, unique fields)
- Search queries (name, phone, email)
- Filtering (status, category, dates)
- Sorting (timestamps)

## Troubleshooting

### Connection Error

```
❌ MongoDB Connection Error: connect ECONNREFUSED
```

**Solution:** Check your `.env` file and ensure MongoDB is running:
```bash
# Check .env
cat .env | grep MONGODB_URI

# Start MongoDB (if using local)
sudo systemctl start mongod
# or
brew services start mongodb-community
```

### Authentication Error

```
❌ MongoDB Connection Error: Authentication failed
```

**Solution:** Verify your MongoDB credentials in `.env`:
```
MONGODB_URI=mongodb://username:password@host:port/database
```

### Collections Already Exist

If you see:
```
⊘ Customers already exist, skipping
⊘ Suppliers already exist, skipping
```

This is normal! The script won't overwrite existing data.

## Re-running Migration

You can safely run the migration multiple times. It will:
- ✅ Skip creating data that already exists
- ✅ Update indexes if schema changed
- ✅ Not delete any existing data

## Manual Verification

You can also verify using MongoDB Compass or mongo shell:

```bash
# Connect to mongo shell
mongosh "your-connection-string"

# List all collections
show collections

# Count documents
db.customers.countDocuments()
db.suppliers.countDocuments()
db.settings.countDocuments()

# View sample data
db.customers.find().pretty()
db.suppliers.find().pretty()
db.settings.findOne()
```

## Next Steps

After successful migration:

1. ✅ Test all new API endpoints
2. ✅ Update frontend to use new APIs
3. ✅ Review DATABASE_SCHEMA.md for API documentation
4. ✅ Configure settings via `/api/settings`
5. ✅ Start creating prescriptions, purchase orders, etc.

## Rollback (if needed)

If you need to remove the new collections:

```javascript
// In mongo shell
db.customers.drop()
db.suppliers.drop()
db.prescriptions.drop()
db.purchaseorders.drop()
db.stockmovements.drop()
db.settings.drop()
db.auditlogs.drop()
db.notifications.drop()
```

Then re-run the migration.

## Support

If you encounter issues:
1. Check the error message carefully
2. Verify MongoDB connection
3. Ensure all models are properly imported
4. Check server logs for details
