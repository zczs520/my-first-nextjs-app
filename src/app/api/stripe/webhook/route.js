import { NextResponse } from 'next/server'
import { getStripe, getStripeWebhookSecret } from '@/lib/stripe'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req) {
  const stripe = getStripe()
  const sig = req.headers.get('stripe-signature')
  const secret = getStripeWebhookSecret()
  if (!secret) {
    return new NextResponse('Missing STRIPE_WEBHOOK_SECRET', { status: 500 })
  }
  const rawBody = await req.text()

  let event
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, secret)
  } catch (err) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
  }

  // Minimal handling: log and ack
  switch (event.type) {
    case 'checkout.session.completed':
      // const session = event.data.object
      // TODO: 标记订单已支付
      break
    case 'payment_intent.succeeded':
    case 'payment_intent.payment_failed':
    default:
      break
  }

  return NextResponse.json({ received: true })
}

// Note: Next.js App Router 不再使用旧的 api config；若使用自定义 body 处理，请将该文件放入 pages/api。
