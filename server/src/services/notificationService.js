const Notification = require('../models/Notification');
const User = require('../models/User');

class NotificationService {
  // Create notification for specific user(s)
  async createNotification({ userId, type, category, title, message, link, priority = 'medium', metadata = {} }) {
    try {
      const notification = new Notification({
        userId,
        type,
        category,
        title,
        message,
        link,
        priority,
        metadata
      });
      await notification.save();
      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // Create notification for all users with specific roles
  async createNotificationForRoles({ roles, type, category, title, message, link, priority = 'medium', metadata = {} }) {
    try {
      console.log(`🔔 Creating notifications for roles: ${roles.join(', ')}`);
      const users = await User.find({ role: { $in: roles } }).select('_id');
      console.log(`🔔 Found ${users.length} users with roles: ${roles.join(', ')}`);
      
      const notifications = users.map(user => ({
        userId: user._id,
        type,
        category,
        title,
        message,
        link,
        priority,
        metadata
      }));
      
      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
        console.log(`✅ Created ${notifications.length} notifications: ${title}`);
      } else {
        console.warn(`⚠️ No users found for roles: ${roles.join(', ')}`);
      }
      return notifications.length;
    } catch (error) {
      console.error('❌ Error creating notifications for roles:', error);
      throw error;
    }
  }

  // 💊 INVENTORY NOTIFICATIONS
  async notifyLowStock(medicine) {
    return this.createNotificationForRoles({
      roles: ['admin', 'pharmacist'],
      type: 'warning',
      category: 'inventory',
      title: 'Low Stock Alert',
      message: `${medicine.name} ${medicine.strength} is running low (${medicine.stockQty} units remaining)`,
      link: `/inventory?search=${medicine.name}`,
      priority: 'high',
      metadata: { medicineId: medicine._id, stockQty: medicine.stockQty }
    });
  }

  async notifyOutOfStock(medicine) {
    return this.createNotificationForRoles({
      roles: ['admin', 'pharmacist'],
      type: 'urgent',
      category: 'inventory',
      title: 'Out of Stock',
      message: `${medicine.name} ${medicine.strength} is out of stock`,
      link: `/inventory?search=${medicine.name}`,
      priority: 'urgent',
      metadata: { medicineId: medicine._id }
    });
  }

  async notifyOverstock(medicine, threshold) {
    return this.createNotificationForRoles({
      roles: ['admin'],
      type: 'info',
      category: 'inventory',
      title: 'Overstock Warning',
      message: `${medicine.name} has excessive inventory (${medicine.stockQty} units, threshold: ${threshold})`,
      link: `/inventory?search=${medicine.name}`,
      priority: 'low',
      metadata: { medicineId: medicine._id, stockQty: medicine.stockQty, threshold }
    });
  }

  // ⏳ EXPIRY NOTIFICATIONS
  async notifyNearExpiry(medicine, daysUntilExpiry) {
    return this.createNotificationForRoles({
      roles: ['admin', 'pharmacist'],
      type: 'warning',
      category: 'expiry',
      title: 'Near Expiry Alert',
      message: `${medicine.name} ${medicine.strength} expiring in ${daysUntilExpiry} days`,
      link: `/inventory?search=${medicine.name}`,
      priority: 'high',
      metadata: { medicineId: medicine._id, expiryDate: medicine.expiryDate, daysUntilExpiry }
    });
  }

  async notifyExpired(medicine) {
    return this.createNotificationForRoles({
      roles: ['admin', 'pharmacist'],
      type: 'urgent',
      category: 'expiry',
      title: 'Expired Medicine',
      message: `${medicine.name} ${medicine.strength} has expired and must be removed immediately`,
      link: `/inventory?search=${medicine.name}`,
      priority: 'urgent',
      metadata: { medicineId: medicine._id, expiryDate: medicine.expiryDate }
    });
  }

  async notifyBatchExpiry(batchInfo) {
    return this.createNotificationForRoles({
      roles: ['admin', 'pharmacist'],
      type: 'warning',
      category: 'expiry',
      title: 'Batch Expiry Reminder',
      message: `Batch ${batchInfo.batchNumber} of ${batchInfo.medicineName} expiring soon`,
      link: `/inventory?batch=${batchInfo.batchNumber}`,
      priority: 'high',
      metadata: { batchId: batchInfo._id, batchNumber: batchInfo.batchNumber }
    });
  }

  // 🛒 PURCHASE / SUPPLIER NOTIFICATIONS
  async notifyStockArrival(purchaseOrder) {
    return this.createNotificationForRoles({
      roles: ['admin', 'pharmacist'],
      type: 'success',
      category: 'purchase',
      title: 'Stock Arrival Confirmed',
      message: `Purchase order #${purchaseOrder.orderNumber} has been received`,
      link: `/purchase-orders/${purchaseOrder._id}`,
      priority: 'medium',
      metadata: { purchaseOrderId: purchaseOrder._id }
    });
  }

  async notifyPendingPurchaseOrder(purchaseOrder) {
    return this.createNotificationForRoles({
      roles: ['admin'],
      type: 'info',
      category: 'purchase',
      title: 'Pending Purchase Order',
      message: `Purchase order #${purchaseOrder.orderNumber} is pending approval`,
      link: `/purchase-orders/${purchaseOrder._id}`,
      priority: 'medium',
      metadata: { purchaseOrderId: purchaseOrder._id }
    });
  }

  async notifySupplierDelay(purchaseOrder, expectedDate) {
    return this.createNotificationForRoles({
      roles: ['admin', 'pharmacist'],
      type: 'warning',
      category: 'purchase',
      title: 'Supplier Delivery Delay',
      message: `Purchase order #${purchaseOrder.orderNumber} delayed. Expected: ${expectedDate}`,
      link: `/purchase-orders/${purchaseOrder._id}`,
      priority: 'high',
      metadata: { purchaseOrderId: purchaseOrder._id, expectedDate }
    });
  }

  async notifyPriceChange(medicine, oldPrice, newPrice) {
    return this.createNotificationForRoles({
      roles: ['admin'],
      type: 'info',
      category: 'purchase',
      title: 'Price Change Alert',
      message: `${medicine.name} price changed from ${oldPrice} to ${newPrice}`,
      link: `/inventory?search=${medicine.name}`,
      priority: 'low',
      metadata: { medicineId: medicine._id, oldPrice, newPrice }
    });
  }

  // 💰 SALES NOTIFICATIONS
  async notifyDailySalesSummary(summary) {
    return this.createNotificationForRoles({
      roles: ['admin'],
      type: 'info',
      category: 'sales',
      title: 'Daily Sales Summary',
      message: `Today's sales: ${summary.totalSales} transactions, Revenue: ${summary.totalRevenue}`,
      link: '/reports?tab=sales',
      priority: 'low',
      metadata: summary
    });
  }

  async notifyLargeTransaction(sale) {
    return this.createNotificationForRoles({
      roles: ['admin'],
      type: 'info',
      category: 'sales',
      title: 'Large Transaction Alert',
      message: `Large sale recorded: ${sale.totalAmount} (Invoice #${sale.invoiceNumber})`,
      link: `/sales/${sale._id}`,
      priority: 'medium',
      metadata: { saleId: sale._id, amount: sale.totalAmount }
    });
  }

  async notifyFailedTransaction(transactionInfo) {
    return this.createNotificationForRoles({
      roles: ['admin', 'cashier'],
      type: 'error',
      category: 'sales',
      title: 'Failed Transaction',
      message: `Transaction failed: ${transactionInfo.reason}`,
      link: '/sales',
      priority: 'high',
      metadata: transactionInfo
    });
  }

  // 👥 USER / STAFF NOTIFICATIONS
  async notifyNewUserCreated(newUser, createdBy) {
    return this.createNotificationForRoles({
      roles: ['admin'],
      type: 'info',
      category: 'user',
      title: 'New User Account Created',
      message: `${newUser.fullName} (${newUser.role}) account created by ${createdBy.fullName}`,
      link: `/users/${newUser._id}`,
      priority: 'low',
      metadata: { userId: newUser._id, role: newUser.role }
    });
  }

  async notifyLoginAlert(user, ipAddress, suspicious = false) {
    return this.createNotification({
      userId: user._id,
      type: suspicious ? 'warning' : 'info',
      category: 'security',
      title: suspicious ? 'Suspicious Login Detected' : 'Login Alert',
      message: `Login from ${ipAddress} at ${new Date().toLocaleString()}`,
      priority: suspicious ? 'high' : 'low',
      metadata: { ipAddress, timestamp: new Date() }
    });
  }

  async notifyRoleChange(user, oldRole, newRole) {
    return this.createNotification({
      userId: user._id,
      type: 'info',
      category: 'user',
      title: 'Role Changed',
      message: `Your role has been changed from ${oldRole} to ${newRole}`,
      priority: 'high',
      metadata: { oldRole, newRole }
    });
  }

  // 💳 PAYMENT & BILLING NOTIFICATIONS
  async notifyPaymentReceived(payment) {
    return this.createNotificationForRoles({
      roles: ['admin', 'cashier'],
      type: 'success',
      category: 'payment',
      title: 'Payment Received',
      message: `Payment of ${payment.amount} received for Invoice #${payment.invoiceNumber}`,
      link: `/sales/${payment.saleId}`,
      priority: 'medium',
      metadata: { paymentId: payment._id, amount: payment.amount }
    });
  }

  async notifyPendingPayment(invoice) {
    return this.createNotificationForRoles({
      roles: ['admin'],
      type: 'warning',
      category: 'payment',
      title: 'Pending Payment',
      message: `Invoice #${invoice.invoiceNumber} payment pending (${invoice.daysOverdue} days overdue)`,
      link: `/sales/${invoice._id}`,
      priority: 'high',
      metadata: { invoiceId: invoice._id, daysOverdue: invoice.daysOverdue }
    });
  }

  // 📊 SYSTEM / ADMIN NOTIFICATIONS
  async notifySystemError(errorInfo) {
    return this.createNotificationForRoles({
      roles: ['admin'],
      type: 'error',
      category: 'system',
      title: 'System Error',
      message: `System error: ${errorInfo.message}`,
      priority: 'urgent',
      metadata: errorInfo
    });
  }

  async notifyBackupStatus(success, message) {
    return this.createNotificationForRoles({
      roles: ['admin'],
      type: success ? 'success' : 'error',
      category: 'system',
      title: success ? 'Backup Completed' : 'Backup Failed',
      message,
      priority: success ? 'low' : 'urgent',
      metadata: { timestamp: new Date(), success }
    });
  }

  async notifyDatabaseWarning(warningInfo) {
    return this.createNotificationForRoles({
      roles: ['admin'],
      type: 'warning',
      category: 'system',
      title: 'Database Warning',
      message: warningInfo.message,
      priority: 'high',
      metadata: warningInfo
    });
  }

  // 🔐 SECURITY NOTIFICATIONS
  async notifyFailedLoginAttempts(user, attempts, ipAddress) {
    return this.createNotification({
      userId: user._id,
      type: 'warning',
      category: 'security',
      title: 'Multiple Failed Login Attempts',
      message: `${attempts} failed login attempts from ${ipAddress}`,
      priority: 'urgent',
      metadata: { attempts, ipAddress, timestamp: new Date() }
    });
  }

  async notifyUnauthorizedAccess(user, resource) {
    return this.createNotificationForRoles({
      roles: ['admin'],
      type: 'urgent',
      category: 'security',
      title: 'Unauthorized Access Attempt',
      message: `${user.fullName} attempted to access ${resource} without permission`,
      priority: 'urgent',
      metadata: { userId: user._id, resource, timestamp: new Date() }
    });
  }

  async notifyPasswordChange(user) {
    return this.createNotification({
      userId: user._id,
      type: 'info',
      category: 'security',
      title: 'Password Changed',
      message: 'Your password was successfully changed',
      priority: 'medium',
      metadata: { timestamp: new Date() }
    });
  }

  // 📦 RETURN & ADJUSTMENT NOTIFICATIONS
  async notifyMedicineReturn(returnInfo) {
    return this.createNotificationForRoles({
      roles: ['admin', 'pharmacist'],
      type: 'info',
      category: 'return',
      title: 'Medicine Returned',
      message: `${returnInfo.medicineName} returned: ${returnInfo.reason}`,
      link: `/inventory?search=${returnInfo.medicineName}`,
      priority: 'medium',
      metadata: returnInfo
    });
  }

  async notifyDamagedInventory(damageInfo) {
    return this.createNotificationForRoles({
      roles: ['admin', 'pharmacist'],
      type: 'warning',
      category: 'return',
      title: 'Damaged Inventory',
      message: `${damageInfo.medicineName} marked as damaged (${damageInfo.quantity} units)`,
      link: `/inventory?search=${damageInfo.medicineName}`,
      priority: 'high',
      metadata: damageInfo
    });
  }

  async notifyStockAdjustment(adjustment) {
    return this.createNotificationForRoles({
      roles: ['admin'],
      type: 'info',
      category: 'return',
      title: 'Stock Adjustment',
      message: `Manual stock adjustment for ${adjustment.medicineName}: ${adjustment.change > 0 ? '+' : ''}${adjustment.change} units`,
      link: `/inventory?search=${adjustment.medicineName}`,
      priority: 'medium',
      metadata: adjustment
    });
  }

  // 📱 SMART NOTIFICATIONS (Advanced)
  async notifyTopSellingMedicine(medicineInfo) {
    return this.createNotificationForRoles({
      roles: ['admin'],
      type: 'info',
      category: 'sales',
      title: 'Top Selling Medicine Today',
      message: `${medicineInfo.name} is today's top seller (${medicineInfo.unitsSold} units)`,
      link: `/reports?tab=sales`,
      priority: 'low',
      metadata: medicineInfo
    });
  }

  async notifyUnusualSalesDrop(dropPercentage) {
    return this.createNotificationForRoles({
      roles: ['admin'],
      type: 'warning',
      category: 'sales',
      title: 'Unusual Sales Drop',
      message: `Sales dropped by ${dropPercentage}% compared to average`,
      link: '/reports?tab=sales',
      priority: 'high',
      metadata: { dropPercentage, timestamp: new Date() }
    });
  }

  async notifySlowMovingMedicine(medicine, daysSinceLastSale) {
    return this.createNotificationForRoles({
      roles: ['admin'],
      type: 'info',
      category: 'inventory',
      title: 'Slow Moving Medicine',
      message: `${medicine.name} hasn't sold in ${daysSinceLastSale} days`,
      link: `/inventory?search=${medicine.name}`,
      priority: 'low',
      metadata: { medicineId: medicine._id, daysSinceLastSale }
    });
  }
}

module.exports = new NotificationService();
