import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import { clerkMiddleware } from '@clerk/express'
import path from 'path'
import { fileURLToPath } from 'url'

// Note: getEnv() is not used at module level because app.js loads before
// validateEnv() runs in server.js. Use process.env directly here.

// Middleware
import errorHandler from './middleware/errorHandler.js'
import { requireAuth, requireEducator, requireAdmin } from './middleware/auth.js'

// Routes (existing — these will be refactored in Phase 5)
import educatorRouter from './routes/educatorRoutes.js'
import courseRouter from './routes/courseRouter.js'
import userRouter from './routes/userRouter.js'
import adminRoutes from './routes/adminRoutes.js'
import { clerkWebhooks, stripeWebhooks } from './controllers/webhooks.js'

// Constants
import { RATE_LIMIT } from './utils/constants.js'

// DB (for health check)
import mongoose from 'mongoose'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// ---------------------------------------------------------------------------
// Security & Logging Middleware
// ---------------------------------------------------------------------------
app.use(
  helmet({
    // Allow inline scripts/styles for development — tighten for production
    contentSecurityPolicy: false,
  })
)
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))

// ---------------------------------------------------------------------------
// CORS — restricted to CLIENT_URL
// ---------------------------------------------------------------------------")
console.log("Node ENV : ",process.env.NODE_ENV);
console.log("client url : ",process.env.CLIENT_URL);

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      process.env.CLIENT_URL,
    ].filter(Boolean),
    credentials: true,
  })
)

// ---------------------------------------------------------------------------
// Rate Limiters
// ---------------------------------------------------------------------------
const authLimiter = rateLimit({
  windowMs: RATE_LIMIT.AUTH_WINDOW_MS,
  max: RATE_LIMIT.AUTH_MAX_REQUESTS,
  message: { success: false, message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
})

const webhookLimiter = rateLimit({
  windowMs: RATE_LIMIT.WEBHOOK_WINDOW_MS,
  max: RATE_LIMIT.WEBHOOK_MAX_REQUESTS,
  message: { success: false, message: 'Too many webhook requests.' },
  standardHeaders: true,
  legacyHeaders: false,
})

// ---------------------------------------------------------------------------
// Webhook Routes (BEFORE express.json — Stripe needs raw body)
// ---------------------------------------------------------------------------
// Stripe webhook — needs raw body for signature verification
app.post(
  '/stripe',
  webhookLimiter,
  (req, res, next) => {
    if (req.method === 'POST') {
      let rawBody = Buffer.alloc(0)
      req.on('data', (chunk) => {
        rawBody = Buffer.concat([rawBody, chunk])
      })
      req.on('end', () => {
        req.body = rawBody
        next()
      })
      req.on('error', (err) => {
        res.status(400).send('Error reading request body')
      })
    } else {
      next()
    }
  },
  stripeWebhooks
)
app.get('/stripe', (req, res) =>
  res.send('Stripe webhook endpoint is ready')
)

// ---------------------------------------------------------------------------
// Body Parsing & Auth Middleware
// ---------------------------------------------------------------------------
app.use(express.json())
app.use(clerkMiddleware())

// ---------------------------------------------------------------------------
// Health Check
// ---------------------------------------------------------------------------
app.get('/', (req, res) => {
  res.send('LMS API is working')
})

app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    uptime: process.uptime(),
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  })
})

// ---------------------------------------------------------------------------
// Clerk Webhook (needs JSON body, so placed after express.json)
// ---------------------------------------------------------------------------
app.post('/clerk', webhookLimiter, clerkWebhooks)

// ---------------------------------------------------------------------------
// API Routes
// ---------------------------------------------------------------------------
// Public course routes
app.use('/api/course', courseRouter)

// Authenticated user routes
app.use('/api/user', authLimiter, requireAuth, userRouter)

// Educator routes (auth handled at route level via protectEducator)
app.use('/api/educator', authLimiter, educatorRouter)

// Admin routes (auth handled at route level via protectAdmin)
app.use('/api/admin', authLimiter, adminRoutes)

// ---------------------------------------------------------------------------
// Serve Frontend Build (for production deployment)
// ---------------------------------------------------------------------------
const clientDistPath = path.join(__dirname, '../client/dist')
app.use(express.static(clientDistPath))

app.use((req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'))
})

// ---------------------------------------------------------------------------
// Global Error Handler (MUST be last)
// ---------------------------------------------------------------------------
app.use(errorHandler)

export default app
