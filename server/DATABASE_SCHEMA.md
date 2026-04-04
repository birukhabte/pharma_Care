# PharmaCare Database Schema

## Overview
This document describes all database collections/tables in the PharmaCare system.

## Collections

### 1. Users ✅ (Existing)
**Purpose:** User authentication and role management

**Fields:**
- email, password, fullName, role, phone
- status, lastLogin, createdAt, updatedAt

**Routes:** `/api/auth`

---

### 2. Medicines ✅ (Existing)
**Purpose:** Medicine catalog and inventory

**Fields:**
- name, genericName, category, manufacturer
- price, stock, reorderLevel, status
- description, sideEffects, dosageForm

**Routes:** `/api/medicines`

---

### 3. Batches ✅ (Existing)
**Purpose:** Batch tracking for medicines

**Fields:**
- medicineId, batchNumber, expiryDate
- quantity, costPrice, sellingPrice
- supplier, receivedDate

**Routes:** `/api/medicines/:id/batches`

---

### 4. Sales ✅ (Existing)
**Purpose:** Sales transactions

**Fields:**
- items[], totalAmount, paymentMethod
- customer, cashier, discount
- status, createdAt

**Routes:** `/api/sales`

---

### 5. Customers ✅ (New)
**Purpose:** Customer information and loyalty program

**Fields:**
- name, phone, email, address
- loyaltyPoints, totalPurchases
- lastPurchaseDate, status, registrationDate

**Routes:** `/api/customers`

**Endpoints:**
- GET /api/customers - List all customers
- GET /api/customers/:id - Get customer details
- POST /api/customers - Create customer
- PUT /api/customers/:id - Update customer
- DELETE /api/customers/:id - Delete customer
- PATCH /api/customers/:id/loyalty - Update loyalty points

---

### 6. Suppliers ✅ (New)
**Purpose:** Supplier/vendor management

**Fields:**
- name, contactPerson, phone, email, address
- category, taxId, licenseNumber
- paymentTerms, creditLimit, currentBalance
- totalOrders, status, rating

**Routes:** `/api/suppliers`

**Endpoints:**
- GET /api/suppliers - List all suppliers
- GET /api/suppliers/:id - Get supplier details
- POST /api/suppliers - Create supplier
- PUT /api/suppliers/:id - Update supplier
- DELETE /api/suppliers/:id - Delete supplier

---

### 7. Prescriptions ✅ (New)
**Purpose:** Prescription tracking and management

**Fields:**
- prescriptionNumber, patientName, doctorName
- medicines[], diagnosis, issueDate, expiryDate
- status, filledDate, filledBy, saleId

**Routes:** `/api/prescriptions`

**Endpoints:**
- GET /api/prescriptions - List all prescriptions
- GET /api/prescriptions/:id - Get prescription details
- POST /api/prescriptions - Create prescription
- PUT /api/prescriptions/:id - Update prescription
- PATCH /api/prescriptions/:id/fill - Fill prescription
- DELETE /api/prescriptions/:id - Delete prescription

---

### 8. PurchaseOrders ✅ (New)
**Purpose:** Purchase orders from suppliers

**Fields:**
- orderNumber, supplierId, items[]
- orderDate, expectedDeliveryDate, actualDeliveryDate
- status, subtotal, taxAmount, totalAmount
- paymentStatus, createdBy, approvedBy

**Routes:** `/api/purchase-orders`

**Endpoints:**
- GET /api/purchase-orders - List all orders
- GET /api/purchase-orders/:id - Get order details
- POST /api/purchase-orders - Create order
- PUT /api/purchase-orders/:id - Update order
- PATCH /api/purchase-orders/:id/approve - Approve order
- PATCH /api/purchase-orders/:id/receive - Receive order
- DELETE /api/purchase-orders/:id - Delete order

---

### 9. StockMovements ✅ (New)
**Purpose:** Track all inventory changes

**Fields:**
- medicineId, batchId, type (in/out/adjustment)
- quantity, previousStock, newStock
- reason, referenceType, referenceId
- performedBy, date

**Routes:** `/api/stock-movements`

**Endpoints:**
- GET /api/stock-movements - List all movements
- GET /api/stock-movements/:id - Get movement details
- POST /api/stock-movements - Create movement (adjustment)
- GET /api/stock-movements/medicine/:id/history - Get medicine history

---

### 10. Settings ✅ (New)
**Purpose:** System configuration

**Fields:**
- pharmacyName, address, phone, email
- currency, taxRate, lowStockThreshold
- expiryAlertDays, loyaltyEnabled
- emailNotifications, autoBackupEnabled

**Routes:** `/api/settings`

**Endpoints:**
- GET /api/settings - Get settings
- PUT /api/settings - Update all settings
- PATCH /api/settings/:section - Update specific section

---

### 11. AuditLogs ✅ (New)
**Purpose:** Track all system activities

**Fields:**
- userId, action, entity, entityId
- changes (before/after), ipAddress
- userAgent, status, timestamp

**Routes:** `/api/audit-logs`

**Endpoints:**
- GET /api/audit-logs - List all logs (admin only)
- GET /api/audit-logs/:id - Get log details
- POST /api/audit-logs - Create log (internal)
- GET /api/audit-logs/user/:userId - Get user activity
- GET /api/audit-logs/entity/:entity/:entityId - Get entity history

---

### 12. Notifications ✅ (New)
**Purpose:** System notifications

**Fields:**
- userId, type, category, title, message
- link, read, readAt, priority, expiresAt

**Routes:** `/api/notifications`

**Endpoints:**
- GET /api/notifications - Get user notifications
- PATCH /api/notifications/:id/read - Mark as read
- PATCH /api/notifications/read-all - Mark all as read
- DELETE /api/notifications/:id - Delete notification

---

## Database Summary

**Total Collections:** 12

**Core Collections (4):**
- Users, Medicines, Batches, Sales

**New Collections (8):**
- Customers, Suppliers, Prescriptions, PurchaseOrders
- StockMovements, Settings, AuditLogs, Notifications

## Indexes

All collections have appropriate indexes for:
- Primary lookups (ID, unique fields)
- Search queries (name, phone, email)
- Filtering (status, category, date ranges)
- Sorting (timestamps, dates)

## Relationships

```
Users → Sales (cashier)
Users → PurchaseOrders (createdBy, approvedBy)
Users → StockMovements (performedBy)
Users → Notifications (userId)
Users → AuditLogs (userId)

Medicines → Batches (medicineId)
Medicines → Sales.items (medicineId)
Medicines → StockMovements (medicineId)
Medicines → PurchaseOrders.items (medicineId)

Customers → Sales (customer)
Customers → Prescriptions (customerId)

Suppliers → PurchaseOrders (supplierId)

Prescriptions → Sales (saleId)
```

## Next Steps

1. Restart the server to load new routes
2. Test each endpoint with Postman or similar tool
3. Update frontend to use new APIs
4. Add seed data for testing
5. Implement audit logging middleware
6. Set up notification triggers
