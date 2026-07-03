import express from 'express'
import {
  addCourse,
  educatorDashboardData,
  getEducatorCourses,
  getEnrolledStudentsData,
  updateRoleToEducator,
  deleteCourse,
} from '../controllers/educatorControllers.js'
import upload from '../config/multer.js'  // New config with file limits
import { requireAuth, requireEducator } from '../middleware/auth.js'
import validate from '../middleware/validate.js'
import { addCourseSchema, deleteCourseSchema } from '../validators/educatorValidators.js'

const educatorRouter = express.Router()

// Update role — only needs auth, NOT educator role (user isn't educator yet)
educatorRouter.get('/update-role', requireAuth, updateRoleToEducator)

// Educator-protected routes with validation
educatorRouter.post('/add-course', requireAuth, requireEducator, upload.single('image'), validate(addCourseSchema), addCourse)
educatorRouter.get('/courses', requireAuth, requireEducator, getEducatorCourses)
educatorRouter.get('/dashboard', requireAuth, requireEducator, educatorDashboardData)
educatorRouter.get('/enrolled-students', requireAuth, requireEducator, getEnrolledStudentsData)
educatorRouter.delete('/courses/:id', requireAuth, requireEducator, validate(deleteCourseSchema), deleteCourse)

export default educatorRouter