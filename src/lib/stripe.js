// Server-only Stripe configuration
// IMPORTANT: Do not import this file from Client Components.
// Usage (Server Actions / Route Handlers / Server Components only):
//   import { getStripe, isStripeConfigured } from '@/lib/stripe'
//   const stripe = getStripe()

import Stripe from 'stripe'

// Read environment variables lazily to avoid crashing non-server contexts
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || ''
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || ''

let stripeSingleton = null

export function isStripeConfigured() {
  return Boolean(STRIPE_SECRET_KEY)
}

export function getStripe() {
  if (!STRIPE_SECRET_KEY) {
    throw new Error('[stripe] Missing STRIPE_SECRET_KEY. Please set it in your environment (Vercel Project Settings → Environment Variables).')
  }
  if (!stripeSingleton) {
    stripeSingleton = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: '2024-06-20',
      appInfo: {
        name: 'tavern-ai.xyz',
      },
    })
  }
  return stripeSingleton
}

export function getStripeWebhookSecret() {
  return STRIPE_WEBHOOK_SECRET
}

// Example helpers (to be used in server code only):
// export async function createCheckoutSession(params) {
//   const stripe = getStripe()
//   return await stripe.checkout.sessions.create(params)
// }

// For client-side Elements usage, create a separate file like src/lib/stripeClient.js:
//   'use client'
//   import { loadStripe } from '@stripe/stripe-js'
//   const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
//   export const stripePromise = pk ? loadStripe(pk) : Promise.resolve(null)
