import User from '../models/User.js'
import { clerkClient } from '@clerk/clerk-sdk-node'
import AppError from '../utils/AppError.js'

/**
 * User service — business logic for user data operations.
 */

/**
 * Get user data by ID. Auto-syncs from Clerk if user doesn't exist locally.
 *
 * @param {string} userId - Clerk user ID
 * @returns {Object} User document
 */
export const getUserData = async (userId) => {
  let user = await User.findById(userId)

  if (!user) {
    // Auto-sync from Clerk if user exists there but not locally
    try {
      const clerkUser = await clerkClient.users.getUser(userId)
      const name = clerkUser?.firstName || clerkUser?.fullName || ''
      const email = clerkUser?.emailAddresses?.[0]?.emailAddress || clerkUser?.email || ''
      const imageUrl = clerkUser?.imageUrl || ''
      const role = clerkUser?.publicMetadata?.role || 'student'

      user = await User.findByIdAndUpdate(
        userId,
        { _id: userId, name, email, imageUrl, role },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      )
    } catch (clerkErr) {
      console.warn('User not found locally and Clerk lookup failed:', clerkErr?.message)
      throw new AppError('User not found', 404)
    }
  }

  return user
}

/**
 * Get enrolled courses for a user with populated course and educator data.
 *
 * @param {string} userId - Clerk user ID
 * @returns {{ enrolledCourses: Array, count: number }}
 */
export const getEnrolledCourses = async (userId) => {
  let userData = await User.findById(userId).populate({
    path: 'enrolledCourses',
    populate: {
      path: 'educator',
      select: 'name email',
    },
  })

  if (!userData) {
    // Auto-sync from Clerk
    try {
      const clerkUser = await clerkClient.users.getUser(userId)
      const name = clerkUser?.firstName || clerkUser?.fullName || ''
      const email = clerkUser?.emailAddresses?.[0]?.emailAddress || clerkUser?.email || ''
      const imageUrl = clerkUser?.imageUrl || ''
      const role = clerkUser?.publicMetadata?.role || 'student'

      await User.findByIdAndUpdate(
        userId,
        { _id: userId, name, email, imageUrl, role },
        { upsert: true, setDefaultsOnInsert: true }
      )

      return { enrolledCourses: [], count: 0 }
    } catch (clerkErr) {
      console.warn('Clerk lookup failed when creating local user:', clerkErr?.message)
      throw new AppError('User not found', 404)
    }
  }

  return {
    enrolledCourses: userData.enrolledCourses || [],
    count: userData.enrolledCourses?.length || 0,
  }
}
