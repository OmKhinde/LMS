import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js'
import { clerkWebhooks, stripeWebhooks } from './controllers/webhooks.js'
import educatorRouter from './routes/educatorRoutes.js'
import { clerkMiddleware } from '@clerk/express'
import connectCloudinary from './configs/cloudinary.js'
import courseRouter from './routes/courseRouter.js'
import userRouter from './routes/userRouter.js'
import adminRoutes from './routes/adminRoutes.js'
import errorHandler from './middlewares/errorMiddleware.js'

//initialize express
const app = express()

await connectDB();
connectCloudinary();

// Enable CORS
app.use(cors())

// Special handling for Stripe webhook - capture raw body
app.use('/stripe', (req, res, next) => {
    if (req.method === 'POST') {
        let rawBody = Buffer.alloc(0);

        req.on('data', (chunk) => {
            rawBody = Buffer.concat([rawBody, chunk]);
        });

        req.on('end', () => {
            console.log('🔧 Raw body capture complete, final length:', rawBody.length);
            req.body = rawBody;
            next();
        });

        req.on('error', (err) => {
            console.error('Error reading request body:', err);
            res.status(400).send('Error reading request body');
        });
    } else {
        next();
    }
});

// Home route
app.get('/', (req, res) => {
    res.send("LMS API is working")
});

// Stripe webhook route
app.post('/stripe', stripeWebhooks);

// Test endpoint
app.get('/stripe', (req, res) => {
    res.send('Stripe webhook endpoint is ready');
});

// Apply JSON middleware and other middlewares AFTER stripe webhook
app.use(express.json());
app.use(clerkMiddleware());

// All other routes
app.post('/clerk', clerkWebhooks);
app.use('/api/educator', educatorRouter);
app.use('/api/course', courseRouter);
app.use('/api/user', userRouter);
app.use('/api/admin', adminRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 Stripe webhook endpoint: http://localhost:${PORT}/stripe`);
});

import path from "path";
const __dirname = path.resolve();

// Serve frontend build
app.use(express.static(path.join(__dirname, "../client/dist")));

// Catch-all route (Express 5 compatible)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});
