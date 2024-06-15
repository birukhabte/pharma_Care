const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  prescriptionNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  patientName: {
    type: String,
    required: true,
    trim: true
  },
  patientAge: Number,
  patientGender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  patientPhone: String,
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  },
  doctorName: {
    type: String,
    required: true,
    trim: true
  },
  doctorPhone: String,
  doctorLicense: String,
  hospitalClinic: String,
  medicines: [{
    medicineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Medicine'
    },
    medicineName: String,
    dosage: String,
    frequency: String,
    duration: String,
    quantity: Number,
    instructions: String
  }],
  diagnosis: String,
  issueDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  expiryDate: Date,
  status: {
    type: String,
    enum: ['pending', 'partially_filled', 'filled', 'expired', 'cancelled'],
    default: 'pending'
  },
  filledDate: Date,
  filledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  saleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sale'
  },
  notes: String,
  attachments: [String]
}, {
  timestamps: true
});

// Indexes (prescriptionNumber already has unique index from schema definition)
prescriptionSchema.index({ patientName: 1 });
prescriptionSchema.index({ doctorName: 1 });
prescriptionSchema.index({ status: 1 });
prescriptionSchema.index({ issueDate: -1 });

module.exports = mongoose.model('Prescription', prescriptionSchema);
// Commit on 2024-06-1 at 9:24
// Commit on 2024-06-11 at 11:51
// Commit on 2024-06-10 at 18:17
// Commit on 2024-06-15 at 15:20
