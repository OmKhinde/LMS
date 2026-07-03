/**
 * Wraps async route handlers to catch rejected promises
 * and forward errors to Express error middleware.
 * Eliminates the need for try/catch in every controller.
 *
 * @param {Function} fn - Async Express route handler
 * @returns {Function} Express middleware
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

export default asyncHandler
