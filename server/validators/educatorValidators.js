import { z } from 'zod'

/**
 * Zod validators for educator endpoints.
 */

const objectIdRegex = /^[0-9a-fA-F]{24}$/

/**
 * Validates the courseData JSON string sent in the body when adding a course.
 * Note: The actual courseData comes as a JSON string in req.body.courseData
 * (because the request uses multipart/form-data for the image upload).
 * Full structural validation happens after JSON.parse in the service layer.
 */
export const addCourseSchema = z.object({
  body: z.object({
    courseData: z.string().min(1, 'Course data is required'),
  }),
})

/**
 * Validates the parsed course data structure (used after JSON.parse).
 */
export const parsedCourseDataSchema = z.object({
  courseTitle: z.string().min(1, 'Course title is required').max(200),
  courseDescription: z.string().min(1, 'Course description is required'),
  coursePrice: z.number().positive('Price must be positive'),
  isPublished: z.boolean(),
  discount: z.number().min(0).max(100).default(0),
  courseContent: z.array(
    z.object({
      chapterId: z.string().min(1),
      chapterOrder: z.number().int().nonnegative(),
      chapterTitle: z.string().min(1),
      chapterContent: z.array(
        z.object({
          lectureId: z.number().int(),
          lectureTitle: z.string().min(1),
          lectureDuration: z.number().nonnegative(),
          lectureUrl: z.string().optional(),
          isPreviewFree: z.boolean(),
          lectureOrder: z.number().int().nonnegative(),
        })
      ),
    })
  ).optional().default([]),
})

export const deleteCourseSchema = z.object({
  params: z.object({
    id: z.string().regex(objectIdRegex, 'Invalid course ID format'),
  }),
})
