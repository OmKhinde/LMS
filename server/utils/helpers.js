/**
 * Shared utility / helper functions.
 */

/**
 * Extracts authenticated user ID from the Clerk req.auth object.
 * Handles multiple auth object shapes for compatibility.
 * @param {import('express').Request} req
 * @returns {string|null}
 */
export const getAuthUserId = (req) => {
  const auth = typeof req.auth === 'function' ? req.auth() : req.auth
  return auth?.userId || auth?.user_id || auth?.sub || auth?.id || null
}

/**
 * Strips sensitive lecture URLs from course content for public endpoints.
 * Returns a new object — does not mutate the original.
 * @param {Object} course - Mongoose course document (lean or toObject)
 * @returns {Object}
 */
export const stripLectureUrls = (course) => {
  if (!course?.courseContent) return course

  const obj = typeof course.toObject === 'function' ? course.toObject() : { ...course }

  obj.courseContent = obj.courseContent.map((chapter) => ({
    ...chapter,
    chapterContent: chapter.chapterContent.map((lecture) => ({
      ...lecture,
      lectureUrl: lecture.isPreviewFree ? lecture.lectureUrl : '',
    })),
  }))

  return obj
}
