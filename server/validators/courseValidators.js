import { z } from 'zod'

/**
 * Zod validators for course endpoints.
 */

const objectIdRegex = /^[0-9a-fA-F]{24}$/

export const getCourseByIdSchema = z.object({
  params: z.object({
    id: z.string().regex(objectIdRegex, 'Invalid course ID format'),
  }),
})

export const listCoursesSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().min(1).max(50).default(12),
    search: z.string().optional(),
  }),
})
