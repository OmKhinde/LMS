import mongoose from "mongoose";

const PurchaseSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  userId: {
    type: String,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  stripeSessionId: {
    type: String,
    default: null,
  },
}, { timestamps: true });

// Performance index for querying by course + status
PurchaseSchema.index({ courseId: 1, status: 1 });

// Unique compound index — prevents duplicate purchases at the database level
PurchaseSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export const Purchase = mongoose.model('Purchase', PurchaseSchema);