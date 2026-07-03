import 'dotenv/config'
import { validateEnv } from './config/env.js'
import connectDB from './config/database.js'
import connectCloudinary from './config/cloudinary.js'
import app from './app.js'

/**
 * Clean startup script.
 * 1. Validates all environment variables (fail fast on bad config)
 * 2. Connects to MongoDB with retry/error handling
 * 3. Configures Cloudinary (sync config)
 * 4. Starts the HTTP server
 *
 * No more top-level await. Proper error handling on startup.
 * Graceful exit on failure.
 */
const start = async () => {
  try {
    // Step 1: Validate environment variables
    const env = validateEnv()
    console.log(`🔧 Environment validated (${env.NODE_ENV} mode)`)

    // Step 2: Connect to MongoDB
    await connectDB()

    // Step 3: Configure Cloudinary (synchronous)
    connectCloudinary()
    console.log('☁️  Cloudinary configured')

    // Step 4: Start server
    app.listen(env.PORT, () => {
      console.log(`🚀 Server running on port ${env.PORT}`)
      console.log(`📡 Health check: http://localhost:${env.PORT}/health`)
    })
  } catch (error) {
    console.error('❌ Failed to start server:', error.message)
    process.exit(1)
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err.message)
  process.exit(1)
})

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message)
  process.exit(1)
})

start()
