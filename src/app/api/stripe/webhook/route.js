import { NextResponse } from 'next/server'
import { getStripe, getStripeWebhookSecret } from '@/lib/stripe'
import supabase from '@/lib/supabase'

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

  // 处理订阅相关事件
  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutCompleted(event.data.object)
      break
    case 'customer.subscription.created':
      await handleSubscriptionCreated(event.data.object)
      break
    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event.data.object)
      break
    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event.data.object)
      break
    case 'invoice.payment_succeeded':
      await handlePaymentSucceeded(event.data.object)
      break
    case 'invoice.payment_failed':
      await handlePaymentFailed(event.data.object)
      break
    default:
      console.log(`未处理的事件类型: ${event.type}`)
      break
  }

  return NextResponse.json({ received: true })
}

// Webhook 事件处理函数
async function handleCheckoutCompleted(session) {
  try {
    if (session.mode === 'subscription') {
      console.log('订阅 Checkout 完成:', session.id)
      // 订阅会在 customer.subscription.created 事件中处理
    }
  } catch (err) {
    console.error('处理 checkout.session.completed 失败:', err)
  }
}

async function handleSubscriptionCreated(subscription) {
  try {
    console.log('新订阅创建:', subscription.id)
    
    // 获取客户信息
    const customer = await getStripe().customers.retrieve(subscription.customer)
    const userId = customer.metadata?.userId
    
    if (!userId) {
      console.error('订阅缺少用户ID:', subscription.id)
      return
    }
    
    // 确定计划类型
    const interval = subscription.items.data[0]?.price?.recurring?.interval
    const planType = interval === 'year' ? 'yearly' : 'monthly'
    
    // 更新用户订阅状态
    await supabase
      .from('user_profiles')
      .update({
        subscription_tier: 'premium',
        subscription_status: subscription.status,
        subscription_start_date: new Date(subscription.current_period_start * 1000).toISOString(),
        subscription_end_date: new Date(subscription.current_period_end * 1000).toISOString(),
        stripe_subscription_id: subscription.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
    
    // 记录订阅历史
    await supabase
      .from('subscriptions')
      .insert({
        user_id: userId,
        stripe_subscription_id: subscription.id,
        stripe_customer_id: subscription.customer,
        plan_type: planType,
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString()
      })
    
    console.log(`用户 ${userId} 订阅创建成功`)
  } catch (err) {
    console.error('处理 customer.subscription.created 失败:', err)
  }
}

async function handleSubscriptionUpdated(subscription) {
  try {
    console.log('订阅更新:', subscription.id)
    
    // 更新用户订阅状态
    await supabase
      .from('user_profiles')
      .update({
        subscription_status: subscription.status,
        subscription_end_date: new Date(subscription.current_period_end * 1000).toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('stripe_subscription_id', subscription.id)
    
    // 更新订阅记录
    await supabase
      .from('subscriptions')
      .update({
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
        updated_at: new Date().toISOString()
      })
      .eq('stripe_subscription_id', subscription.id)
    
    console.log(`订阅 ${subscription.id} 状态更新为 ${subscription.status}`)
  } catch (err) {
    console.error('处理 customer.subscription.updated 失败:', err)
  }
}

async function handleSubscriptionDeleted(subscription) {
  try {
    console.log('订阅取消:', subscription.id)
    
    // 降级用户为免费版
    await supabase
      .from('user_profiles')
      .update({
        subscription_tier: 'free',
        subscription_status: 'canceled',
        updated_at: new Date().toISOString()
      })
      .eq('stripe_subscription_id', subscription.id)
    
    // 更新订阅记录
    await supabase
      .from('subscriptions')
      .update({
        status: 'canceled',
        canceled_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('stripe_subscription_id', subscription.id)
    
    console.log(`订阅 ${subscription.id} 已取消，用户降级为免费版`)
  } catch (err) {
    console.error('处理 customer.subscription.deleted 失败:', err)
  }
}

async function handlePaymentSucceeded(invoice) {
  try {
    if (invoice.subscription) {
      console.log('订阅支付成功:', invoice.subscription)
      // 支付成功，确保用户状态为 active
      await supabase
        .from('user_profiles')
        .update({
          subscription_status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('stripe_subscription_id', invoice.subscription)
    }
  } catch (err) {
    console.error('处理 invoice.payment_succeeded 失败:', err)
  }
}

async function handlePaymentFailed(invoice) {
  try {
    if (invoice.subscription) {
      console.log('订阅支付失败:', invoice.subscription)
      // 支付失败，更新状态但不立即降级
      await supabase
        .from('user_profiles')
        .update({
          subscription_status: 'past_due',
          updated_at: new Date().toISOString()
        })
        .eq('stripe_subscription_id', invoice.subscription)
    }
  } catch (err) {
    console.error('处理 invoice.payment_failed 失败:', err)
  }
}

// Note: Next.js App Router 不再使用旧的 api config；若使用自定义 body 处理，请将该文件放入 pages/api。
