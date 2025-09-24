import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import supabase from '@/lib/supabase'

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
    
    const { userId, planType = 'monthly' } = body
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }
    
    // 获取用户信息
    const { data: user, error: userError } = await supabase
      .from('user_profiles')
      .select('stripe_customer_id')
      .eq('id', userId)
      .single()
    
    if (userError) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    let customerId = user.stripe_customer_id
    
    // 如果用户没有 Stripe 客户 ID，创建一个
    if (!customerId) {
      const customer = await stripe.customers.create({
        metadata: { userId }
      })
      customerId = customer.id
      
      // 更新用户的 Stripe 客户 ID
      await supabase
        .from('user_profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', userId)
    }
    
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || getBaseUrl(req)
    
    // 根据计划类型选择价格 ID（需要在 Stripe Dashboard 中创建）
    const priceIds = {
      monthly: process.env.STRIPE_MONTHLY_PRICE_ID || 'price_monthly_default',
      yearly: process.env.STRIPE_YEARLY_PRICE_ID || 'price_yearly_default'
    }
    
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [{
        price: priceIds[planType],
        quantity: 1,
      }],
      success_url: `${baseUrl}/dashboard?subscription=success`,
      cancel_url: `${baseUrl}/pricing?subscription=canceled`,
      metadata: {
        userId,
        planType
      }
    })
    
    return NextResponse.json({ 
      sessionId: session.id, 
      url: session.url 
    })
  } catch (err) {
    console.error('创建订阅会话失败:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
