import { CourseProgress } from '../models/CourseProgress.js'
import User from '../models/User.js'
import AppError from '../utils/AppError.js'

/**
 * Progress service — handles course progress tracking.
 */

/**
 * Update progress for a specific lecture.
 * Uses $addToSet for atomic, duplicate-safe updates (fixes FLOW-3).
 * Verifies user is enrolled before allowing progress updates (fixes FLOW-10).
 *
 * @param {string} userId - Clerk user ID
 * @param {string} courseId - Course ObjectId
 * @param {string} lectureId - Lecture identifier
 * @returns {Object} Updated progress data
 */
export const updateProgress = async (userId, courseId, lectureId) => {
  // Verify user is enrolled in the course
  const user = await User.findById(userId)
  if (!user || !user.enrolledCourses.map(id => id.toString()).includes(courseId)) {
    throw new AppError('You must be enrolled in this course to track progress', 403)
  }

  // Use findOneAndUpdate with $addToSet — atomic, no race condition
  const progressData = await CourseProgress.findOneAndUpdate(
    { userId, courseId },
    { $addToSet: { lectureCompleted: lectureId } },
    { upsert: true, new: true }
  )

  return progressData
}

/**
 * Get progress for a specific course.
 *
 * @param {string} userId - Clerk user ID
 * @param {string} courseId - Course ObjectId
 * @returns {Object|null} Progress data
 */
export const getCourseProgress = async (userId, courseId) => {
  const progressData = await CourseProgress.findOne({ userId, courseId })
  return progressData
}

/**
 * Get progress for multiple courses in a single query.
 * Eliminates the N+1 problem from MyEnrollments page (fixes PERF-1).
 *
 * @param {string} userId - Clerk user ID
 * @param {string[]} courseIds - Array of course ObjectIds
 * @returns {Object} Map of courseId → progress data
 */
export const getBatchProgress = async (userId, courseIds) => {
  const progressRecords = await CourseProgress.find({
    userId,
    courseId: { $in: courseIds },
  })

  // Build a map: courseId → progress document
  const progressMap = {}
  for (const record of progressRecords) {
    progressMap[record.courseId.toString()] = {
      completed: record.completed,
      lectureCompleted: record.lectureCompleted,
      lectureCount: record.lectureCompleted.length,
    }
  }

  return progressMap
}
