import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  _id: { type: String, required: true },                              // Clerk user ID
  name: { type: String, required: true, trim: true, default: '' },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, default: '' },
  imageUrl: { type: String, default: '' },
  role: { type: String, enum: ['student', 'educator', 'admin'], default: 'student' },
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;