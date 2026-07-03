import { Webhook } from 'svix'
import User from '../models/User.js'
import asyncHandler from '../middleware/asyncHandler.js'
import * as purchaseService from '../services/purchaseService.js'
import Stripe from 'stripe'

// Singleton Stripe instance (fixes PERF-5)
const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)

/**
 * Clerk webhook handler — manages user sync with database.
 */
export const clerkWebhooks = asyncHandler(async (req, res) => {
  const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)
  await whook.verify(JSON.stringify(req.body), {
    'svix-id': req.headers['svix-id'],
    'svix-timestamp': req.headers['svix-timestamp'],
    'svix-signature': req.headers['svix-signature'],
  })

  const { data, type } = req.body

  switch (type) {
    case 'user.created': {
      const userData = {
        _id: data.id || data._id,
        email: data.email_addresses?.[0]?.email_address || '',
        name: ((data.first_name || '') + ' ' + (data.last_name || '')).trim(),
        imageUrl: data.image_url || '',
      }
      await User.create(userData)
      res.json({ success: true })
      break
    }

    case 'user.updated': {
      const userData = {
        email: data.email_addresses?.[0]?.email_address || '',
        name: ((data.first_name || '') + ' ' + (data.last_name || '')).trim(),
        imageUrl: data.image_url || '',
      }
      await User.findByIdAndUpdate(data.id || data._id, userData)
      res.json({ success: true })
      break
    }

    case 'user.deleted': {
      await User.findByIdAndDelete(data.id || data._id)
      res.json({ success: true })
      break
    }

    default:
      console.log('Unhandled webhook type:', type)
      res.json({ success: true })
      break
  }
})

/**
 * Stripe webhook handler — handles payment events.
 *
 * Key improvements from original:
 * 1. Uses purchaseService with MongoDB transactions (fixes FLOW-4)
 * 2. Only handles checkout.session.completed (fixes PERF-9 — no extra API call)
 * 3. Proper return after signature failure (fixes FLOW-1)
 * 4. Removed excessive debug logging
 */
export const stripeWebhooks = async (req, res) => {
  const sig = req.headers['stripe-signature']
  const body = req.body

  // No signature = test/misconfigured request
  if (!sig) {
    return res.json({ message: 'Webhook endpoint is working' })
  }

  if (!body) {
    return res.status(400).send('No request body')
  }

  let event

  try {
    event = stripeInstance.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Stripe signature verification failed:', err.message)
    return res.status(400).json({ error: 'Invalid signature' }) // ← HAS return (fixes FLOW-1)
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const { purchaseId } = session.metadata || {}

        if (purchaseId) {
          await purchaseService.handleSuccessfulPayment(purchaseId)
        }
        break
      }

      case 'checkout.session.expired': {
        const session = event.data.object
        const { purchaseId } = session.metadata || {}

        if (purchaseId) {
          await purchaseService.handleFailedPayment(purchaseId)
        }
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object
        console.log(`Payment failed: ${paymentIntent.id}`)
        // If we need to handle this, the checkout.session.expired should cover it
        break
      }

      default:
        console.log(`Unhandled Stripe event: ${event.type}`)
    }

    res.status(200).json({ received: true })
  } catch (error) {
    console.error('Error processing Stripe webhook:', error.message)
    res.status(500).json({ error: 'Webhook processing failed' })
  }
}