import asyncHandler from '../middleware/asyncHandler.js'
import * as userService from '../services/userService.js'
import * as purchaseService from '../services/purchaseService.js'
import * as progressService from '../services/progressService.js'
import Course from '../models/Course.js'
import User from '../models/User.js'
import AppError from '../utils/AppError.js'
import { getAuthUserId } from '../utils/helpers.js'

/**
 * User controller — thin HTTP handlers.
 * All business logic is in the service layer.
 * asyncHandler catches errors → global error handler.
 */

// Get User Data
export const getUserData = asyncHandler(async (req, res) => {
  const userId = req.userId || getAuthUserId(req)
  const user = await userService.getUserData(userId)
  res.status(200).json({ success: true, user })
})

// Get Enrolled Courses
export const userEnrolledCourses = asyncHandler(async (req, res) => {
  const userId = req.userId || getAuthUserId(req)
  const result = await userService.getEnrolledCourses(userId)
  res.status(200).json({ success: true, ...result })
})

// Purchase Course
export const purchaseCourse = asyncHandler(async (req, res) => {
  const userId = req.userId || getAuthUserId(req)
  const { courseId } = req.validated?.body || req.body
  const origin = req.headers?.origin || process.env.CLIENT_URL || ''

  const result = await purchaseService.createPurchase(userId, courseId, origin)
  res.status(200).json({ success: true, ...result })
})

// Verify Payment (handles the race condition with Stripe webhook)
export const verifyPayment = asyncHandler(async (req, res) => {
  const userId = req.userId || getAuthUserId(req)
  const { sessionId } = req.validated?.body || req.body

  const result = await purchaseService.verifyAndCompletePayment(sessionId, userId)
  res.status(200).json({ success: true, ...result })
})

// Update Course Progress
export const updateUserCourseProgress = asyncHandler(async (req, res) => {
  const userId = req.userId || getAuthUserId(req)
  const { courseId, lectureId } = req.validated?.body || req.body

  const progressData = await progressService.updateProgress(userId, courseId, lectureId)
  res.status(200).json({ success: true, message: 'Progress Updated Successfully', progressData })
})

// Get Course Progress
export const getUserCourseProgress = asyncHandler(async (req, res) => {
  const userId = req.userId || getAuthUserId(req)
  const { courseId } = req.validated?.body || req.body

  const progressData = await progressService.getCourseProgress(userId, courseId)
  res.status(200).json({ success: true, progressData })
})

// Get Batch Progress (NEW — fixes N+1 problem from MyEnrollments)
export const getBatchProgress = asyncHandler(async (req, res) => {
  const userId = req.userId || getAuthUserId(req)
  const { courseIds } = req.validated?.body || req.body

  const progressMap = await progressService.getBatchProgress(userId, courseIds)
  res.status(200).json({ success: true, progressMap })
})

// Add Rating
export const addUserRating = asyncHandler(async (req, res) => {
  const userId = req.userId || getAuthUserId(req)
  const { courseId, rating } = req.validated?.body || req.body

  const course = await Course.findById(courseId)
  if (!course) {
    throw new AppError('Course not found', 404)
  }

  // Verify user is enrolled
  const user = await User.findById(userId)
  if (!user || !user.enrolledCourses.map(id => id.toString()).includes(courseId)) {
    throw new AppError('You must purchase this course before rating', 403)
  }

  // Update or add rating (using string comparison for consistency — fixes FLOW-7)
  const existingRating = course.courseRatings.find(
    (r) => String(r.userId) === String(userId)
  )

  if (existingRating) {
    existingRating.rating = rating
  } else {
    course.courseRatings.push({ userId, rating })
  }

  await course.save()
  res.status(200).json({ success: true, message: 'Rating Added Successfully' })
})

// Admin: Complete Purchase
export const adminCompletePurchase = asyncHandler(async (req, res) => {
  const { userId, courseId } = req.validated?.body || req.body

  const result = await purchaseService.adminCompletePurchase(userId, courseId)
  res.status(200).json({
    success: true,
    message: `User enrolled in ${result.course}`,
    ...result,
  })
})
