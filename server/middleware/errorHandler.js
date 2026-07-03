import AppError from '../utils/AppError.js'

/**
 * Global Express error handler.
 *
 * - Sends proper HTTP status codes (400, 401, 403, 404, 500)
 * - Returns consistent error response format: { success: false, message }
 * - Hides internal error details in production
 * - Logs full error stack in development
 * - Handles Mongoose validation errors, cast errors, and duplicate key errors
 * - Handles Zod validation errors
 * - Handles Multer file upload errors
 */
const errorHandler = (err, req, res, next) => {
  // Default values
  let statusCode = err.statusCode || err.status || 500
  let message = err.message || 'Internal Server Error'

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400
    const messages = Object.values(err.errors).map((e) => e.message)
    message = `Validation Error: ${messages.join(', ')}`
  }

  // Mongoose Cast Error (invalid ObjectId etc.)
  if (err.name === 'CastError') {
    statusCode = 400
    message = `Invalid ${err.path}: ${err.value}`
  }

  // Mongoose Duplicate Key Error
  if (err.code === 11000) {
    statusCode = 409
    const field = Object.keys(err.keyValue).join(', ')
    message = `Duplicate value for field: ${field}`
  }

  // Zod Validation Error
  if (err.name === 'ZodError') {
    statusCode = 400
    const messages = err.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`)
    message = `Validation Error: ${messages.join(', ')}`
  }

  // Multer Error (file too large, wrong type)
  if (err.name === 'MulterError') {
    statusCode = 400
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'File too large. Maximum size is 5MB.'
    }
  }

  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.error('❌ Error:', {
      message,
      statusCode,
      stack: err.stack,
      isOperational: err.isOperational,
    })
  } else {
    // In production, only log unexpected errors
    if (!err.isOperational) {
      console.error('❌ Unexpected Error:', err)
    }
  }

  // Build response
  const response = {
    success: false,
    message: err.isOperational || statusCode < 500 ? message : 'Something went wrong',
  }

  // Include stack trace in development only
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack
  }

  res.status(statusCode).json(response)
}

export default errorHandler
