import { z } from 'zod'

/**
 * Validates all required environment variables at startup using Zod.
 * If any variable is missing or invalid, prints a clear error and exits.
 */
const envSchema = z.object({
  MONGO_URI: z.string().min(1, 'MONGO_URI is required'),
  STRIPE_SECRET_KEY: z.string().startsWith('sk_', 'STRIPE_SECRET_KEY must start with sk_'),
  STRIPE_WEBHOOK_SECRET: z.string().min(1, 'STRIPE_WEBHOOK_SECRET is required'),
  CLERK_WEBHOOK_SECRET: z.string().min(1, 'CLERK_WEBHOOK_SECRET is required'),
  CLERK_SECRET_KEY: z.string().min(1, 'CLERK_SECRET_KEY is required'),
  CLOUDINARY_CLOUD_NAME: z.string().min(1, 'CLOUDINARY_CLOUD_NAME is required'),
  CLOUDINARY_API_KEY: z.string().min(1, 'CLOUDINARY_API_KEY is required'),
  CLOUDINARY_API_SECRET: z.string().min(1, 'CLOUDINARY_API_SECRET is required'),
  CURRENCY: z.string().default('usd'),
  CLIENT_URL: z.string().default('http://localhost:5173'),
  PORT: z.coerce.number().default(5000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

let _env = null

/**
 * Validates environment variables and returns a frozen config object.
 * Caches the result so validation only runs once.
 * @returns {z.infer<typeof envSchema>}
 */
export const validateEnv = () => {
  if (_env) return _env

  const result = envSchema.safeParse(process.env)

  if (!result.success) {
    console.error('❌ Environment variable validation failed:')
    result.error.issues.forEach((issue) => {
      console.error(`   - ${issue.path.join('.')}: ${issue.message}`)
    })
    process.exit(1)
  }

  _env = Object.freeze(result.data)
  return _env
}

/**
 * Returns the cached validated env. Throws if validateEnv() hasn't been called.
 * Use this in modules that import env after startup.
 */
export const getEnv = () => {
  if (!_env) {
    throw new Error('Environment not validated yet. Call validateEnv() first.')
  }
  return _env
}
