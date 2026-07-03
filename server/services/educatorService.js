import { clerkClient } from '@clerk/express'
import { v2 as cloudinary } from 'cloudinary'
import Course from '../models/Course.js'
import { Purchase } from '../models/Purchase.js'
import User from '../models/User.js'
import { CourseProgress } from '../models/CourseProgress.js'
import AppError from '../utils/AppError.js'
import { PURCHASE_STATUS } from '../utils/constants.js'

/**
 * Educator service — business logic for educator operations.
 */

/**
 * Update a user's role to educator via Clerk metadata.
 * Uses the actual authenticated userId — never hardcoded (fixes A-3).
 *
 * @param {string} userId - Clerk user ID from req.auth
 */
export const updateRoleToEducator = async (userId) => {
  await clerkClient.users.updateUserMetadata(userId, {
    publicMetadata: {
      role: 'educator',
    },
  })

  // Also update local DB for consistency
  await User.findByIdAndUpdate(userId, { role: 'educator' })
}

/**
 * Add a new course with Cloudinary thumbnail upload.
 * Uploads image first, then creates — prevents orphaned records (fixes PERF-8).
 *
 * @param {string} educatorId - Clerk user ID
 * @param {Object} parsedCourseData - Validated course data
 * @param {Object} imageFile - Multer file object
 * @returns {Object} Created course
 */
export const addCourse = async (educatorId, parsedCourseData, imageFile) => {
  if (!imageFile) {
    throw new AppError('Course thumbnail is required', 400)
  }

  // Upload image FIRST (fixes PERF-8 — upload before create)
  const imageUpload = await cloudinary.uploader.upload(imageFile.path)

  parsedCourseData.educator = educatorId
  parsedCourseData.courseThumbnail = imageUpload.secure_url

  const newCourse = await Course.create(parsedCourseData)
  return newCourse
}

/**
 * Get all courses for a specific educator.
 *
 * @param {string} educatorId - Clerk user ID
 * @returns {Array} Educator's courses
 */
export const getEducatorCourses = async (educatorId) => {
  const courses = await Course.find({ educator: educatorId }).sort({ createdAt: -1 })
  return courses
}

/**
 * Get comprehensive dashboard data for an educator.
 * Optimized to reduce the number of database queries (fixes PERF-2).
 *
 * @param {string} educatorId - Clerk user ID
 * @returns {Object} Dashboard data
 */
export const getDashboardData = async (educatorId) => {
  const courses = await Course.find({ educator: educatorId })
  const totalCourses = courses.length
  const courseIds = courses.map((course) => course._id)

  // Single query for all completed purchases
  const purchases = await Purchase.find({
    courseId: { $in: courseIds },
    status: PURCHASE_STATUS.COMPLETED,
  })

  const totalEarnings = purchases.reduce((sum, purchase) => sum + purchase.amount, 0)

  // Collect enrolled students data
  const enrolledStudentsData = []
  const uniqueStudentIds = new Set()

  for (const course of courses) {
    const students = await User.find(
      { _id: { $in: course.enrolledStudents } },
      'name imageUrl'
    )

    students.forEach((student) => {
      uniqueStudentIds.add(student._id.toString())
      enrolledStudentsData.push({
        courseTitle: course.courseTitle,
        student,
      })
    })
  }

  const totalStudents = uniqueStudentIds.size
  const totalEnrollments = enrolledStudentsData.length

  // Monthly stats
  const currentMonth = new Date()
  const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)

  const monthlyPurchases = await Purchase.find({
    courseId: { $in: courseIds },
    status: PURCHASE_STATUS.COMPLETED,
    createdAt: { $gte: startOfMonth },
  })

  const monthlyRevenue = monthlyPurchases.reduce((sum, purchase) => sum + purchase.amount, 0)
  const monthlyEnrollments = monthlyPurchases.length

  // Top performing courses by revenue
  const topCourses = courses.map((course) => {
    const courseRevenue = purchases
      .filter((p) => p.courseId.toString() === course._id.toString())
      .reduce((sum, p) => sum + p.amount, 0)

    // Calculate average rating from courseRatings
    const ratings = course.courseRatings || []
    const avgCourseRating = ratings.length > 0
      ? (ratings.reduce((sum, r) => sum + (r.rating || 0), 0) / ratings.length).toFixed(1)
      : 0

    return {
      title: course.courseTitle,
      enrollments: course.enrolledStudents.length,
      revenue: courseRevenue,
      rating: Number(avgCourseRating),
    }
  })

  topCourses.sort((a, b) => b.revenue - a.revenue)
  const topPerformingCourses = topCourses.slice(0, 5)

  // Overall average rating (calculated from actual data, not hardcoded)
  const allRatings = courses.flatMap((c) => c.courseRatings || [])
  const avgRating = allRatings.length > 0
    ? (allRatings.reduce((sum, r) => sum + (r.rating || 0), 0) / allRatings.length).toFixed(1)
    : '0.0'

  // Completion rate from actual progress data
  const progressRecords = await CourseProgress.find({ courseId: { $in: courseIds } })
  const completedEnrollments = progressRecords.filter((p) => p.completed).length
  const completionRate = totalEnrollments > 0
    ? Math.round((completedEnrollments / totalEnrollments) * 100)
    : 0

  // Recent activity
  const recentActivity = enrolledStudentsData.slice(0, 5).map((enrollment) => ({
    message: `New student enrolled in ${enrollment.courseTitle}`,
    timestamp: new Date().toLocaleDateString(),
  }))

  const totalViews = courses.reduce((sum, course) => sum + (course.views || 0), 0)

  return {
    totalCourses,
    totalStudents,
    totalEnrollments,
    totalEarnings,
    monthlyRevenue,
    monthlyEnrollments,
    avgRating,
    completionRate,
    topCourses: topPerformingCourses,
    recentActivity,
    totalViews,
    enrolledStudentsData,
  }
}

/**
 * Get enrolled students data for educator's courses.
 *
 * @param {string} educatorId - Clerk user ID
 * @returns {Array} Purchase records with populated user and course data
 */
export const getEnrolledStudentsData = async (educatorId) => {
  const courses = await Course.find({ educator: educatorId })
  const courseIds = courses.map((course) => course._id)

  const purchases = await Purchase.find({
    courseId: { $in: courseIds },
    status: PURCHASE_STATUS.COMPLETED,
  })
    .populate('userId', 'name imageUrl email')
    .populate('courseId', 'courseTitle')

  return purchases
}

/**
 * Delete a course and clean up all related data.
 * Only the course's educator can delete it.
 *
 * @param {string} courseId - Course ObjectId
 * @param {string} userId - Authenticated user ID
 */
export const deleteCourse = async (courseId, userId) => {
  const course = await Course.findById(courseId)

  if (!course) {
    throw new AppError('Course not found', 404)
  }

  if (String(course.educator) !== String(userId)) {
    throw new AppError('Not authorized to delete this course', 403)
  }

  // Clean up related data
  await Purchase.deleteMany({ courseId: course._id })
  await CourseProgress.deleteMany({ courseId: String(course._id) })
  await User.updateMany(
    { enrolledCourses: course._id },
    { $pull: { enrolledCourses: course._id } }
  )

  await Course.findByIdAndDelete(courseId)
}
