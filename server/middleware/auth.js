import { clerkClient } from '@clerk/clerk-sdk-node'
import User from '../models/User.js'
import AppError from '../utils/AppError.js'
import { getAuthUserId } from '../utils/helpers.js'

/**
 * Requires authentication. Extracts and validates user ID from Clerk's req.auth.
 * Attaches `req.userId` for downstream use.
 * Returns 401 if not authenticated.
 */
export const requireAuth = (req, res, next) => {
  const userId = getAuthUserId(req)

  if (!userId) {
    throw new AppError('Authentication required. Please log in.', 401)
  }

  req.userId = userId
  next()
}

/**
 * Requires the authenticated user to have the 'educator' role.
 * Checks Clerk publicMetadata first, then falls back to local DB.
 * Returns 403 if the user is not an educator.
 *
 * Must be used AFTER requireAuth.
 */
export const requireEducator = async (req, res, next) => {
  try {
    const userId = req.userId

    // Check Clerk metadata first
    try {
      const clerkUser = await clerkClient.users.getUser(userId)
      const clerkRole =
        clerkUser?.publicMetadata?.role || clerkUser?.public_metadata?.role

      if (clerkRole === 'educator' || clerkRole === 'admin') {
        return next()
      }
    } catch (clerkErr) {
      // Clerk lookup failed, fall through to local DB check
    }

    // Fallback: check local database
    const localUser = await User.findById(userId)
    if (localUser && (localUser.role === 'educator' || localUser.role === 'admin')) {
      return next()
    }

    throw new AppError('Educator role required to access this resource.', 403)
  } catch (error) {
    if (error instanceof AppError) throw error
    next(error)
  }
}

/**
 * Requires the authenticated user to have the 'admin' role.
 * Checks Clerk publicMetadata first, then falls back to local DB.
 * Returns 403 if the user is not an admin.
 *
 * Must be used AFTER requireAuth.
 */
export const requireAdmin = async (req, res, next) => {
  try {
    const userId = req.userId

    // Check Clerk metadata first
    try {
      const clerkUser = await clerkClient.users.getUser(userId)
      const clerkRole =
        clerkUser?.publicMetadata?.role || clerkUser?.public_metadata?.role

      if (clerkRole === 'admin') {
        return next()
      }
    } catch (clerkErr) {
      // Clerk lookup failed, fall through to local DB check
    }

    // Fallback: check local database
    const localUser = await User.findById(userId)
    if (localUser && localUser.role === 'admin') {
      return next()
    }

    throw new AppError('Admin role required to access this resource.', 403)
  } catch (error) {
    if (error instanceof AppError) throw error
    next(error)
  }
}

/**
 * Optional authentication — like requireAuth but doesn't fail if no token.
 * Used for public routes where auth info is nice-to-have but not required.
 * Sets `req.userId` if authenticated, or `null` if not.
 */
export const optionalAuth = (req, res, next) => {
  const userId = getAuthUserId(req)
  req.userId = userId || null
  next()
}
