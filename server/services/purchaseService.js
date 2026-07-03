import mongoose from 'mongoose'
import Stripe from 'stripe'
import { Purchase } from '../models/Purchase.js'
import User from '../models/User.js'
import Course from '../models/Course.js'
import AppError from '../utils/AppError.js'
import { PURCHASE_STATUS } from '../utils/constants.js'

// Singleton Stripe instance (fixes PERF-5 — no per-request instantiation)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

/**
 * Purchase service — handles purchase creation, Stripe integration,
 * and payment completion with MongoDB transactions.
 */

/**
 * Creates a new purchase and initiates Stripe checkout session.
 *
 * @param {string} userId - Clerk user ID
 * @param {string} courseId - MongoDB course ObjectId
 * @param {string} origin - Client origin URL for redirect
 * @returns {{ sessionUrl, sessionId, amount }}
 */
export const createPurchase = async (userId, courseId, origin) => {
  // 1. Verify user exists
  const userData = await User.findById(userId)
  if (!userData) {
    throw new AppError('User not found', 404)
  }

  // 2. Verify course exists
  const courseData = await Course.findById(courseId)
  if (!courseData) {
    throw new AppError('Course not found', 404)
  }

  // 3. Check if already enrolled (fixes FLOW-5)
  if (userData.enrolledCourses.includes(courseId)) {
    throw new AppError('Already enrolled in this course', 409)
  }

  // 4. Check for existing pending purchase — cleanup stale ones
  const existingPurchase = await Purchase.findOne({
    userId,
    courseId,
    status: PURCHASE_STATUS.PENDING,
  })

  if (existingPurchase) {
    // Clean up stale pending purchase (older than 30 minutes)
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000)
    if (existingPurchase.createdAt < thirtyMinutesAgo) {
      await Purchase.findByIdAndUpdate(existingPurchase._id, { status: PURCHASE_STATUS.FAILED })
    } else {
      throw new AppError('You have a pending purchase for this course. Please complete or wait.', 409)
    }
  }

  // 5. Calculate amount SERVER-SIDE (never trust client)
  const price = Number(courseData.coursePrice) || 0
  const discount = Number(courseData.discount) || 0

  if (price <= 0) {
    throw new AppError('Invalid course price', 400)
  }

  const finalAmount = price - (discount * price / 100)
  const roundedAmount = Number(finalAmount.toFixed(2))

  if (isNaN(roundedAmount) || roundedAmount <= 0) {
    throw new AppError('Invalid amount calculated', 400)
  }

  // 6. Create Purchase record
  const newPurchase = await Purchase.create({
    courseId: courseData._id,
    userId,
    amount: roundedAmount,
  })

  // 7. Create Stripe checkout session
  const clientBase = origin || process.env.CLIENT_URL || ''

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: (process.env.CURRENCY || 'USD').toLowerCase(),
        product_data: {
          name: courseData.courseTitle,
          description: courseData.courseDescription?.substring(0, 200) || courseData.courseTitle,
        },
        unit_amount: Math.floor(roundedAmount * 100),
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `${clientBase}/loading/myenrollments?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${clientBase}/course/${courseId}?cancelled=true`,
    metadata: {
      courseId,
      userId,
      purchaseId: newPurchase._id.toString(),
    },
  })

  return {
    sessionUrl: session.url,
    sessionId: session.id,
    amount: roundedAmount,
  }
}

/**
 * Handles successful payment — enrolls user in course.
 * Uses MongoDB transaction for atomicity (fixes FLOW-4).
 *
 * @param {string} purchaseId - Purchase record ID
 */
export const handleSuccessfulPayment = async (purchaseId) => {
  const purchaseData = await Purchase.findById(purchaseId)

  if (!purchaseData) {
    console.error(`Purchase not found: ${purchaseId}`)
    return
  }

  if (purchaseData.status === PURCHASE_STATUS.COMPLETED) {
    console.log(`Purchase ${purchaseId} already completed — skipping`)
    return
  }

  // Use MongoDB transaction for all-or-nothing enrollment
  const session = await mongoose.startSession()

  try {
    await session.withTransaction(async () => {
      // a. Update purchase status
      await Purchase.findByIdAndUpdate(
        purchaseId,
        { status: PURCHASE_STATUS.COMPLETED },
        { session }
      )

      // b. Add courseId to user's enrolledCourses
      await User.findByIdAndUpdate(
        purchaseData.userId,
        { $addToSet: { enrolledCourses: purchaseData.courseId } },
        { session }
      )

      // c. Add userId to course's enrolledStudents
      await Course.findByIdAndUpdate(
        purchaseData.courseId,
        { $addToSet: { enrolledStudents: purchaseData.userId } },
        { session }
      )
    })

    console.log(`✅ Purchase ${purchaseId} completed with transaction`)
  } catch (error) {
    console.error(`❌ Transaction failed for purchase ${purchaseId}:`, error.message)
    throw error
  } finally {
    await session.endSession()
  }
}

/**
 * Handles failed payment — marks purchase as failed.
 *
 * @param {string} purchaseId - Purchase record ID
 */
export const handleFailedPayment = async (purchaseId) => {
  const purchaseData = await Purchase.findById(purchaseId)

  if (!purchaseData) {
    console.error(`Purchase not found for failure: ${purchaseId}`)
    return
  }

  await Purchase.findByIdAndUpdate(purchaseId, {
    status: PURCHASE_STATUS.FAILED,
  })

  console.log(`❌ Purchase ${purchaseId} marked as failed`)
}

/**
 * Admin-level purchase completion — enrolls user without Stripe.
 *
 * @param {string} userId - User to enroll
 * @param {string} courseId - Course to enroll in
 */
export const adminCompletePurchase = async (userId, courseId) => {
  const user = await User.findById(userId)
  const course = await Course.findById(courseId)

  if (!user || !course) {
    throw new AppError('User or course not found', 404)
  }

  if (user.enrolledCourses.includes(courseId)) {
    throw new AppError('User already enrolled in this course', 409)
  }

  // Use transaction for atomicity
  const session = await mongoose.startSession()

  try {
    await session.withTransaction(async () => {
      await User.findByIdAndUpdate(
        userId,
        { $addToSet: { enrolledCourses: courseId } },
        { session }
      )

      await Course.findByIdAndUpdate(
        courseId,
        { $addToSet: { enrolledStudents: userId } },
        { session }
      )

      // Update or create purchase record
      await Purchase.findOneAndUpdate(
        { userId, courseId, status: PURCHASE_STATUS.PENDING },
        { status: PURCHASE_STATUS.COMPLETED },
        { session }
      )
    })
  } finally {
    await session.endSession()
  }

  return {
    user: user.name,
    course: course.courseTitle,
  }
}
