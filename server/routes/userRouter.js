import express from 'express'
import {
  addUserRating,
  getUserData,
  purchaseCourse,
  verifyPayment,
  updateUserCourseProgress,
  userEnrolledCourses,
  getUserCourseProgress,
  getBatchProgress,
  adminCompletePurchase,
} from '../controllers/userController.js'
import { submitApplication, listUserApplications, getUserApplication } from '../controllers/applicationController.js'
import validate from '../middleware/validate.js'
import {
  purchaseCourseSchema,
  updateProgressSchema,
  getCourseProgressSchema,
  batchProgressSchema,
  addRatingSchema,
  adminCompletePurchaseSchema,
  verifyPaymentSchema,
} from '../validators/userValidators.js'

const userRouter = express.Router()

// Application routes
userRouter.post('/applications', submitApplication)
userRouter.get('/applications', listUserApplications)
userRouter.get('/applications/:id', getUserApplication)

// User data routes
userRouter.get('/data', getUserData)
userRouter.get('/enrolled-courses', userEnrolledCourses)
userRouter.get('/myenrollments', userEnrolledCourses)

// Validated mutation routes
userRouter.post('/purchase', validate(purchaseCourseSchema), purchaseCourse)
userRouter.post('/verify-payment', validate(verifyPaymentSchema), verifyPayment)
userRouter.post('/update-course-progress', validate(updateProgressSchema), updateUserCourseProgress)
userRouter.post('/get-course-progress', validate(getCourseProgressSchema), getUserCourseProgress)
userRouter.post('/batch-progress', validate(batchProgressSchema), getBatchProgress)  // NEW — fixes N+1
userRouter.post('/add-rating', validate(addRatingSchema), addUserRating)

// Admin routes
userRouter.post('/admin/complete-purchase', validate(adminCompletePurchaseSchema), adminCompletePurchase)

export default userRouter