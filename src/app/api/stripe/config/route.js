import { NextResponse } from 'next/server'
import { isStripeConfigured } from '@/lib/stripe'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const config = {
      stripeConfigured: isStripeConfigured(),
      hasSecretKey: Boolean(process.env.STRIPE_SECRET_KEY),
      hasWebhookSecret: Boolean(process.env.STRIPE_WEBHOOK_SECRET),
      hasMonthlyPriceId: Boolean(process.env.STRIPE_MONTHLY_PRICE_ID),
      hasYearlyPriceId: Boolean(process.env.STRIPE_YEARLY_PRICE_ID),
      hasPublishableKey: Boolean(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY),
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'NOT_SET',
      environment: process.env.NODE_ENV
    }
    
    return NextResponse.json(config)
  } catch (error) {
    return NextResponse.json({ 
      error: error.message,
      stripeConfigured: false 
    }, { status: 500 })
  }
}
