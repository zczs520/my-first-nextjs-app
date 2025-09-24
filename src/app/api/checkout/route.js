import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function getBaseUrl(req) {
  const host = req.headers.get('x-forwarded-host') || req.headers.get('host')
  const proto = req.headers.get('x-forwarded-proto') || 'https'
  return `${proto}://${host}`
}

export async function POST(req) {
  try {
    const stripe = getStripe()

    const body = await req.json().catch(() => ({}))
    // 支持以“分”为单位的金额（CNY 或 USD 的最小货币单位）。默认 990（¥9.90 或 $9.90）
    const amount = Number(body.amount ?? 990)
    if (!Number.isFinite(amount) || amount < 100) {
      // minimal ¥1.00
      return NextResponse.json({ error: 'invalid_amount' }, { status: 400 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || getBaseUrl(req)
    const pm = (process.env.STRIPE_PM || 'card').toLowerCase() // 'card' | 'alipay'

    const isAlipay = pm === 'alipay'
    const currency = isAlipay ? 'cny' : 'usd'

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: [isAlipay ? 'alipay' : 'card'],
      line_items: [
        {
          price_data: {
            currency,
            product_data: { name: isAlipay ? '测试订单（支付宝）' : 'Test Order (Card)' },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/pay/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pay/cancel`,
      locale: isAlipay ? 'zh' : undefined,
    })

    return NextResponse.json({ id: session.id, url: session.url, pm })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
