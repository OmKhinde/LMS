/**
 * Centralized application constants.
 * Eliminates magic strings and numbers throughout the codebase.
 */

export const PURCHASE_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
}

export const USER_ROLES = {
  STUDENT: 'student',
  EDUCATOR: 'educator',
  ADMIN: 'admin',
}

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 50,
}

export const UPLOAD = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_MIME_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
}

export const RATE_LIMIT = {
  AUTH_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  AUTH_MAX_REQUESTS: 100,
  WEBHOOK_WINDOW_MS: 1 * 60 * 1000, // 1 minute
  WEBHOOK_MAX_REQUESTS: 50,
}
