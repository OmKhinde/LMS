import asyncHandler from '../middleware/asyncHandler.js'
import * as courseService from '../services/courseService.js'

/**
 * Course controller — thin HTTP handlers.
 * All business logic is in courseService.
 * asyncHandler catches errors → global error handler.
 */

// Get All Published Courses (with pagination & search)
export const getAllCourses = asyncHandler(async (req, res) => {
  const { page, limit, search } = req.validated?.query || req.query
  const result = await courseService.getAllCourses(page, limit, search)
  res.status(200).json({ success: true, ...result })
})

// Get Course by ID
export const getCourseById = asyncHandler(async (req, res) => {
  const { id } = req.validated?.params || req.params
  const course = await courseService.getCourseById(id)
  res.status(200).json({ success: true, course })
})
