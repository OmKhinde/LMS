import asyncHandler from '../middleware/asyncHandler.js'
import * as educatorService from '../services/educatorService.js'
import { parsedCourseDataSchema } from '../validators/educatorValidators.js'
import AppError from '../utils/AppError.js'
import { getAuthUserId } from '../utils/helpers.js'

/**
 * Educator controller — thin HTTP handlers.
 * All business logic is in educatorService.
 * asyncHandler catches errors → global error handler.
 */

// Update Role to Educator
export const updateRoleToEducator = asyncHandler(async (req, res) => {
  const userId = req.userId || getAuthUserId(req)
  if (!userId) throw new AppError('Authentication required', 401)

  await educatorService.updateRoleToEducator(userId)
  res.status(200).json({ success: true, message: 'You can publish a course now' })
})

// Add Course
export const addCourse = asyncHandler(async (req, res) => {
  const educatorId = req.userId || req.auth?.userId || getAuthUserId(req)
  const { courseData } = req.validated?.body || req.body
  const imageFile = req.file

  // Parse and validate the course data JSON
  let parsedCourseData
  try {
    parsedCourseData = JSON.parse(courseData)
  } catch (e) {
    throw new AppError('Invalid course data JSON', 400)
  }

  // Validate parsed course structure
  const validation = parsedCourseDataSchema.safeParse(parsedCourseData)
  if (!validation.success) {
    const messages = validation.error.issues.map(
      (issue) => `${issue.path.join('.')}: ${issue.message}`
    )
    throw new AppError(`Course data validation failed: ${messages.join('; ')}`, 400)
  }

  await educatorService.addCourse(educatorId, validation.data, imageFile)
  res.status(201).json({ success: true, message: 'Course Added' })
})

// Get Educator Courses
export const getEducatorCourses = asyncHandler(async (req, res) => {
  const educator = req.userId || req.auth?.userId || getAuthUserId(req)
  const courses = await educatorService.getEducatorCourses(educator)
  res.status(200).json({ success: true, courses })
})

// Get Dashboard Data
export const educatorDashboardData = asyncHandler(async (req, res) => {
  const educator = req.userId || req.auth?.userId || getAuthUserId(req)
  const data = await educatorService.getDashboardData(educator)
  res.status(200).json({ success: true, data })
})

// Get Enrolled Students Data
export const getEnrolledStudentsData = asyncHandler(async (req, res) => {
  const educator = req.userId || req.auth?.userId || getAuthUserId(req)
  const data = await educatorService.getEnrolledStudentsData(educator)
  res.status(200).json({ success: true, data })
})

// Delete Course
export const deleteCourse = asyncHandler(async (req, res) => {
  const courseId = req.validated?.params?.id || req.params.id
  const userId = req.userId || req.auth?.userId || getAuthUserId(req)

  if (!userId) throw new AppError('Authentication required', 401)

  await educatorService.deleteCourse(courseId, userId)
  res.status(200).json({ success: true, message: 'Course deleted successfully' })
})