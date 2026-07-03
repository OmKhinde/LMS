import { z } from 'zod'

/**
 * Zod validators for user endpoints.
 */

const objectIdRegex = /^[0-9a-fA-F]{24}$/

export const purchaseCourseSchema = z.object({
  body: z.object({
    courseId: z.string().regex(objectIdRegex, 'Invalid course ID format'),
  }),
})

export const updateProgressSchema = z.object({
  body: z.object({
    courseId: z.string().regex(objectIdRegex, 'Invalid course ID format'),
    lectureId: z.string().min(1, 'Lecture ID is required'),
  }),
})

export const getCourseProgressSchema = z.object({
  body: z.object({
    courseId: z.string().regex(objectIdRegex, 'Invalid course ID format'),
  }),
})

export const batchProgressSchema = z.object({
  body: z.object({
    courseIds: z.array(
      z.string().regex(objectIdRegex, 'Invalid course ID format')
    ).min(1, 'At least one course ID is required'),
  }),
})

export const addRatingSchema = z.object({
  body: z.object({
    courseId: z.string().regex(objectIdRegex, 'Invalid course ID format'),
    rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  }),
})

export const adminCompletePurchaseSchema = z.object({
  body: z.object({
    userId: z.string().min(1, 'User ID is required'),
    courseId: z.string().regex(objectIdRegex, 'Invalid course ID format'),
  }),
})
