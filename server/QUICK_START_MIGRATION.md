# Quick Start: Database Migration

## 🚀 Run Migration in 3 Steps

### Step 1: Navigate to server directory
```bash
cd server
```

### Step 2: Run migration
```bash
npm run migrate
```

### Step 3: Restart server
```bash
npm start
```

That's it! ✅

---

## What Happens During Migration?

The migration script will:

1. **Connect** to your MongoDB database
2. **Create** 8 new collections:
   - customers
   - suppliers
   - prescriptions
   - purchaseorders
   - stockmovements
   - settings
   - auditlogs
   - notifications

3. **Add** indexes for performance
4. **Seed** sample data:
   - 3 customers
   - 3 suppliers
   - 1 settings document

5. **Verify** everything is created correctly

---

## Expected Output

```
🚀 Starting database migration...

✅ MongoDB Connected

📊 Creating indexes...
  ✓ User indexes created
  ✓ Medicine indexes created
  ... (all 12 collections)
✅ All indexes created successfully

🌱 Seeding sample data...
  ✓ Sample customers created
  ✓ Sample suppliers created
  ✓ Default settings created
✅ Sample data seeded successfully

🔍 Verifying collections...
  ✓ users
  ✓ medicines
  ... (all 12 collections)

✅ Migration completed successfully!
```

---

## Test the New APIs

After migration, test the endpoints:

```bash
# Make the test script executable
chmod +x test-migration.sh

# Run tests
./test-migration.sh
```

Or manually test:

```bash
# Get customers
curl http://localhost:5000/api/customers

# Get suppliers
curl http://localhost:5000/api/suppliers

# Get settings
curl http://localhost:5000/api/settings
```

---

## Troubleshooting

### ❌ Connection Error
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Check your .env file
cat .env | grep MONGODB_URI
```

### ❌ Permission Error
```bash
# Make sure you're in the server directory
cd server

# Check if node_modules exists
ls node_modules
```

### ❌ Module Not Found
```bash
# Reinstall dependencies
npm install
```

---

## Need More Details?

See the full documentation:
- **MIGRATION_GUIDE.md** - Detailed migration guide
- **DATABASE_SCHEMA.md** - Complete database schema and API docs

---

## Quick Commands

```bash
# Run migration
npm run migrate

# Start server
npm start

# Start in development mode
npm run dev

# Test endpoints
./test-migration.sh
```

---

## What's Next?

After successful migration:

1. ✅ All 12 collections are ready
2. ✅ All API endpoints are available
3. ✅ Sample data is loaded
4. ✅ You can start using the new features!

Check the API routes:
- `/api/customers` - Customer management
- `/api/suppliers` - Supplier management
- `/api/prescriptions` - Prescription tracking
- `/api/purchase-orders` - Purchase orders
- `/api/stock-movements` - Inventory tracking
- `/api/settings` - System settings
- `/api/notifications` - User notifications
- `/api/audit-logs` - Activity logs

Happy coding! 🎉
