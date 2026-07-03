import Course from '../models/Course.js'
import AppError from '../utils/AppError.js'
import { stripLectureUrls } from '../utils/helpers.js'
import { PAGINATION } from '../utils/constants.js'

/**
 * Course service — business logic for course operations.
 */

/**
 * Get all published courses with pagination and optional search.
 * Excludes courseContent and enrolledStudents for list view performance.
 *
 * @param {number} page - Page number (1-indexed)
 * @param {number} limit - Items per page
 * @param {string} [search] - Optional search term for course title
 * @returns {{ courses, pagination }}
 */
export const getAllCourses = async (page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT, search) => {
  const filter = { isPublished: true }

  if (search) {
    filter.courseTitle = { $regex: search, $options: 'i' }
  }

  const skip = (page - 1) * limit
  const total = await Course.countDocuments(filter)

  const courses = await Course.find(filter)
    .select('-courseContent -enrolledStudents')
    .populate({ path: 'educator', select: 'name imageUrl' })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)

  return {
    courses,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  }
}

/**
 * Get a single course by ID with full details.
 * Strips lecture URLs for non-preview lectures (public safety).
 *
 * @param {string} courseId - MongoDB ObjectId string
 * @returns {Object} Course data with populated educator
 */
export const getCourseById = async (courseId) => {
  const course = await Course.findById(courseId).populate({ path: 'educator', select: 'name imageUrl' })

  if (!course) {
    throw new AppError('Course not found', 404)
  }

  // Strip lectureUrl from non-preview lectures for public access
  return stripLectureUrls(course)
}
