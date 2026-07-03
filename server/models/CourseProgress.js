import mongoose from 'mongoose';

const courseProgressSchema = new mongoose.Schema({
  userId: { type: String, required: true, ref: 'User' },
  courseId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Course' },
  completed: { type: Boolean, default: false },
  lectureCompleted: [{ type: String }],           // Typed array — was bare []
}, { timestamps: true, minimize: false });

// Unique compound index — one progress record per user per course
courseProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export const CourseProgress = mongoose.model('CourseProgress', courseProgressSchema);
