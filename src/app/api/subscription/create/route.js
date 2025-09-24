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
    let { data: user, error: userError } = await supabase
      .from('user_profiles')
      .select('stripe_customer_id')
      .eq('id', userId)
      .single()
    
    if (userError) {
      console.error('获取用户信息失败:', userError)
      if (userError.code === 'PGRST116') {
        // 用户配置不存在，这种情况下 stripe_customer_id 为 null
        console.log('用户配置不存在，将在后续创建 Stripe 客户')
        user = { stripe_customer_id: null }
      } else {
        console.error('数据库查询错误:', userError)
        return NextResponse.json({ 
          error: 'Database error. Please try again later.' 
        }, { status: 500 })
      }
    }
    
    let customerId = user.stripe_customer_id
    
    // 如果用户没有 Stripe 客户 ID，创建一个
    if (!customerId) {
      const customer = await stripe.customers.create({
        metadata: { userId }
      })
      customerId = customer.id
      
      // 更新或创建用户的 Stripe 客户 ID
      const { error: updateError } = await supabase
        .from('user_profiles')
        .upsert({ 
          id: userId,
          stripe_customer_id: customerId,
          subscription_tier: 'free',
          subscription_status: 'inactive',
          updated_at: new Date().toISOString()
        })
      
      if (updateError) {
        console.error('更新用户 Stripe 客户 ID 失败:', updateError)
        // 不阻塞流程，继续创建订阅会话
      }
    }
    
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || getBaseUrl(req)
    
    // 根据计划类型选择价格 ID（需要在 Stripe Dashboard 中创建）
    const priceIds = {
      monthly: process.env.STRIPE_MONTHLY_PRICE_ID,
      yearly: process.env.STRIPE_YEARLY_PRICE_ID
    }
    
    const priceId = priceIds[planType]
    
    // 检查价格 ID 是否配置
    if (!priceId) {
      console.error(`Missing Stripe price ID for plan: ${planType}`)
      console.error('Available environment variables:', {
        STRIPE_MONTHLY_PRICE_ID: process.env.STRIPE_MONTHLY_PRICE_ID ? 'SET' : 'NOT_SET',
        STRIPE_YEARLY_PRICE_ID: process.env.STRIPE_YEARLY_PRICE_ID ? 'SET' : 'NOT_SET'
      })
      return NextResponse.json({ 
        error: `Stripe price ID not configured for ${planType} plan. Please contact support.` 
      }, { status: 500 })
    }
    
    console.log(`Creating subscription session for user ${userId}, plan: ${planType}, priceId: ${priceId}`)
    
    // 验证价格 ID 格式
    if (priceId && !priceId.startsWith('price_')) {
      console.error(`Invalid price ID format: ${priceId}. Price IDs should start with 'price_', not 'prod_'`)
      return NextResponse.json({ 
        error: `Invalid price ID format. Please check your Stripe configuration. Expected format: price_xxxxx, got: ${priceId}` 
      }, { status: 500 })
    }
    
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [{
        price: priceId,
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
