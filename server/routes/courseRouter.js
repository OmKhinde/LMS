import express from 'express'
import { getAllCourses, getCourseById } from '../controllers/courseController.js'
import validate from '../middleware/validate.js'
import { listCoursesSchema, getCourseByIdSchema } from '../validators/courseValidators.js'

const courseRouter = express.Router()

// Public routes — no auth required
courseRouter.get('/all', validate(listCoursesSchema), getAllCourses)
courseRouter.get('/:id', validate(getCourseByIdSchema), getCourseById)

export default courseRouter