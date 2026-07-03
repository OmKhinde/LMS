import mongoose from 'mongoose'

/**
 * Connects to MongoDB with event listeners and connection options.
 * Throws on failure instead of silently crashing.
 */
const connectDB = async () => {
  mongoose.connection.on('connected', () => {
    console.log('✅ Database Connected')
  })

  mongoose.connection.on('error', (err) => {
    console.error('❌ Database connection error:', err.message)
  })

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ Database disconnected')
  })

  try {
    await mongoose.connect(`${process.env.MONGO_URI}/lms`, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message)
    throw error
  }
}

export default connectDB
