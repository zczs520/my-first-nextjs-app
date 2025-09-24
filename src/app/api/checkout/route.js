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
    // 优先使用前端传来的支付方式，fallback 到环境变量
    const pm = (body.paymentMethod || process.env.STRIPE_PM || 'card').toLowerCase()

    // 支付方式配置
    const paymentConfig = {
      card: { method: 'card', currency: 'usd', name: 'Test Order (Card)', locale: undefined },
      alipay: { method: 'alipay', currency: 'cny', name: '测试订单（支付宝）', locale: 'zh' },
      wechat_pay: { method: 'wechat_pay', currency: 'cny', name: '测试订单（微信支付）', locale: 'zh' }
    }

    const config = paymentConfig[pm] || paymentConfig.card

    // 构建 Checkout Session 配置
    const sessionConfig = {
      mode: 'payment',
      payment_method_types: [config.method],
      line_items: [
        {
          price_data: {
            currency: config.currency,
            product_data: { name: config.name },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/pay/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pay/cancel`,
      locale: config.locale,
    }

    // 微信支付需要特殊配置
    if (pm === 'wechat_pay') {
      sessionConfig.payment_method_options = {
        wechat_pay: {
          client: 'web'
        }
      }
    }

    const session = await stripe.checkout.sessions.create(sessionConfig)

    return NextResponse.json({ id: session.id, url: session.url, pm })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
