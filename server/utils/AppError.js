/**
 * Custom error class for operational errors in the application.
 * Extends the native Error class with HTTP status codes and
 * an `isOperational` flag to distinguish expected errors
 * (bad input, not found, unauthorized) from programming bugs.
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true
    Error.captureStackTrace(this, this.constructor)
  }
}

export default AppError
