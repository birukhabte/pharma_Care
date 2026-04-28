const cron = require('node-cron');
const Medicine = require('../models/Medicine');
const Sale = require('../models/Sale');
const notificationService = require('./notificationService');

class NotificationScheduler {
  constructor() {
    this.jobs = [];
  }

  // Check for low stock and out of stock medicines
  async checkInventoryLevels() {
    try {
      const medicines = await Medicine.find({ status: { $in: ['active', 'low_stock', 'out_of_stock'] } });

      for (const medicine of medicines) {
        // Out of stock
        if (medicine.stockQty === 0 && medicine.status !== 'out_of_stock') {
          await notificationService.notifyOutOfStock(medicine);
          medicine.status = 'out_of_stock';
          await medicine.save();
        }
        // Low stock
        else if (medicine.stockQty > 0 && medicine.stockQty <= medicine.reorderLevel && medicine.status !== 'low_stock') {
          await notificationService.notifyLowStock(medicine);
          medicine.status = 'low_stock';
          await medicine.save();
        }
        // Back to active
        else if (medicine.stockQty > medicine.reorderLevel && medicine.status === 'low_stock') {
          medicine.status = 'active';
          await medicine.save();
        }
      }

      console.log('✓ Inventory levels checked');
    } catch (error) {
      console.error('Error checking inventory levels:', error);
    }
  }

  // Check for expiring medicines
  async checkExpiringMedicines() {
    try {
      const now = new Date();
      const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      const ninetyDaysFromNow = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

      // Find medicines expiring within 90 days
      const expiringMedicines = await Medicine.find({
        expiryDate: { $lte: ninetyDaysFromNow, $gt: now },
        stockQty: { $gt: 0 }
      });

      for (const medicine of expiringMedicines) {
        const daysUntilExpiry = Math.ceil((medicine.expiryDate - now) / (1000 * 60 * 60 * 24));

        // Notify for medicines expiring within 30 days
        if (daysUntilExpiry <= 30) {
          await notificationService.notifyNearExpiry(medicine, daysUntilExpiry);
        }
      }

      // Find expired medicines
      const expiredMedicines = await Medicine.find({
        expiryDate: { $lte: now },
        stockQty: { $gt: 0 }
      });

      for (const medicine of expiredMedicines) {
        await notificationService.notifyExpired(medicine);
      }

      console.log('✓ Expiring medicines checked');
    } catch (error) {
      console.error('Error checking expiring medicines:', error);
    }
  }

  // Generate daily sales summary
  async generateDailySalesSummary() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const sales = await Sale.find({
        createdAt: { $gte: today, $lt: tomorrow }
      });

      const summary = {
        date: today.toISOString().split('T')[0],
        totalSales: sales.length,
        totalRevenue: sales.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0),
        totalItems: sales.reduce((sum, sale) => sum + (sale.items?.length || 0), 0)
      };

      await notificationService.notifyDailySalesSummary(summary);
      console.log('✓ Daily sales summary generated');
    } catch (error) {
      console.error('Error generating daily sales summary:', error);
    }
  }

  // Check for slow-moving medicines
  async checkSlowMovingMedicines() {
    try {
      const sixtyDaysAgo = new Date();
      sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

      const medicines = await Medicine.find({ stockQty: { $gt: 0 } });

      for (const medicine of medicines) {
        // Check if medicine has been sold in the last 60 days
        const recentSales = await Sale.countDocuments({
          'items.medicineId': medicine._id,
          createdAt: { $gte: sixtyDaysAgo }
        });

        if (recentSales === 0) {
          await notificationService.notifySlowMovingMedicine(medicine, 60);
        }
      }

      console.log('✓ Slow-moving medicines checked');
    } catch (error) {
      console.error('Error checking slow-moving medicines:', error);
    }
  }

  // Start all scheduled jobs
  start() {
    console.log('🔔 Starting notification scheduler...');

    // Check inventory levels every hour
    this.jobs.push(
      cron.schedule('0 * * * *', () => {
        console.log('Running inventory level check...');
        this.checkInventoryLevels();
      })
    );

    // Check expiring medicines twice daily (8 AM and 6 PM)
    this.jobs.push(
      cron.schedule('0 8,18 * * *', () => {
        console.log('Running expiry check...');
        this.checkExpiringMedicines();
      })
    );

    // Generate daily sales summary at 11:59 PM
    this.jobs.push(
      cron.schedule('59 23 * * *', () => {
        console.log('Generating daily sales summary...');
        this.generateDailySalesSummary();
      })
    );

    // Check slow-moving medicines weekly (Sunday at 9 AM)
    this.jobs.push(
      cron.schedule('0 9 * * 0', () => {
        console.log('Checking slow-moving medicines...');
        this.checkSlowMovingMedicines();
      })
    );

    // Run initial checks on startup
    setTimeout(() => {
      this.checkInventoryLevels();
      this.checkExpiringMedicines();
    }, 5000);

    console.log('✓ Notification scheduler started');
  }

  // Stop all scheduled jobs
  stop() {
    this.jobs.forEach(job => job.stop());
    this.jobs = [];
    console.log('✓ Notification scheduler stopped');
  }
}

module.exports = new NotificationScheduler();
