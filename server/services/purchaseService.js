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
  if (userData.enrolledCourses.some(id => id.toString() === courseId.toString())) {
    throw new AppError('Already enrolled in this course', 409)
  }

  // 4. Handle existing purchase records (pending, failed, or completed)
  const existingPurchase = await Purchase.findOne({ userId, courseId })

  if (existingPurchase) {
    if (existingPurchase.status === PURCHASE_STATUS.COMPLETED) {
      // Purchase completed but user not in enrolledCourses — fix the enrollment
      await handleSuccessfulPayment(existingPurchase._id.toString())
      throw new AppError('Already enrolled in this course', 409)
    }

    if (existingPurchase.status === PURCHASE_STATUS.PENDING) {
      // Check if the Stripe session was actually paid (webhook may have missed)
      if (existingPurchase.stripeSessionId) {
        try {
          const stripeSession = await stripe.checkout.sessions.retrieve(existingPurchase.stripeSessionId)
          if (stripeSession.payment_status === 'paid') {
            // Payment went through but webhook didn't fire — complete enrollment now
            await handleSuccessfulPayment(existingPurchase._id.toString())
            throw new AppError('Payment was already completed. You are now enrolled!', 409)
          }
        } catch (stripeErr) {
          // Stripe session retrieval failed — session may have expired, proceed to create new one
          console.warn('Could not retrieve Stripe session:', stripeErr.message)
        }
      }

      // Pending purchase that was never paid — reset it for reuse
      console.log(`Resetting stale pending purchase ${existingPurchase._id} for reuse`)
    }

    // For failed or stale pending purchases: reuse the existing record
    // (avoids unique index violation on {userId, courseId})
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

  // 6. Upsert Purchase record (reuse existing or create new)
  const newPurchase = await Purchase.findOneAndUpdate(
    { userId, courseId },
    {
      courseId: courseData._id,
      userId,
      amount: roundedAmount,
      status: PURCHASE_STATUS.PENDING,
      stripeSessionId: null, // will be set after Stripe session creation
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  )

  // 7. Create Stripe checkout session
  const clientBase =  process.env.CLIENT_URL || ''

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: (process.env.CURRENCY || 'USD').toLowerCase(),
        product_data: {
          name: courseData.courseTitle,
          description: courseData.courseDescription?.substring(0, 200) || courseData.courseTitle,
        },
        unit_amount: Math.round(roundedAmount * 100),
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

  // 8. Save the Stripe session ID on the purchase for future verification
  await Purchase.findByIdAndUpdate(newPurchase._id, { stripeSessionId: session.id })

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

  // Prevent marking a completed purchase as failed due to a delayed session expiration
  if (purchaseData.status === PURCHASE_STATUS.COMPLETED) {
    console.log(`Purchase ${purchaseId} is already completed. Ignoring failure/expiration.`)
    return
  }

  await Purchase.findByIdAndUpdate(purchaseId, {
    status: PURCHASE_STATUS.FAILED,
  })

  console.log(`❌ Purchase ${purchaseId} marked as failed`)
}

/**
 * Verifies a Stripe checkout session and completes enrollment if payment succeeded.
 * This handles the race condition where the client redirects back before the
 * Stripe webhook fires.
 *
 * @param {string} sessionId - Stripe checkout session ID
 * @param {string} userId - Clerk user ID (from auth, to prevent spoofing)
 * @returns {{ alreadyEnrolled: boolean, enrolled: boolean }}
 */
export const verifyAndCompletePayment = async (sessionId, userId) => {
  // 1. Retrieve the checkout session from Stripe
  const session = await stripe.checkout.sessions.retrieve(sessionId)

  if (!session) {
    throw new AppError('Invalid session ID', 400)
  }

  // 2. Verify the session belongs to this user
  const { purchaseId, userId: sessionUserId } = session.metadata || {}

  if (sessionUserId !== userId) {
    throw new AppError('Session does not belong to this user', 403)
  }

  if (!purchaseId) {
    throw new AppError('No purchase associated with this session', 400)
  }

  // 3. Check if payment was actually successful
  if (session.payment_status !== 'paid') {
    throw new AppError('Payment has not been completed', 400)
  }

  // 4. Check if the purchase has already been completed
  const purchaseData = await Purchase.findById(purchaseId)

  if (!purchaseData) {
    throw new AppError('Purchase record not found', 404)
  }

  if (purchaseData.status === PURCHASE_STATUS.COMPLETED) {
    // Already enrolled (webhook got here first) — that's fine
    return { alreadyEnrolled: true, enrolled: true }
  }

  // 5. Webhook hasn't fired yet — complete the enrollment ourselves
  await handleSuccessfulPayment(purchaseId)

  return { alreadyEnrolled: false, enrolled: true }
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

  if (user.enrolledCourses.some(id => id.toString() === courseId.toString())) {
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
        { userId, courseId },
        { status: PURCHASE_STATUS.COMPLETED, amount: 0 },
        { session, upsert: true, setDefaultsOnInsert: true }
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
