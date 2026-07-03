import AppError from '../utils/AppError.js'

/**
 * Generic Zod validation middleware factory.
 * Validates req.body, req.params, and req.query against the provided schema.
 * Attaches validated & coerced data to `req.validated`.
 *
 * @param {import('zod').ZodSchema} schema - Zod schema to validate against
 * @returns {Function} Express middleware
 */
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query,
  })

  if (!result.success) {
    const messages = result.error.issues.map(
      (issue) => `${issue.path.join('.')}: ${issue.message}`
    )
    throw new AppError(`Validation Error: ${messages.join('; ')}`, 400)
  }

  // Attach validated data for use in controllers
  req.validated = result.data
  next()
}

export default validate
