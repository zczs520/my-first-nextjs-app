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
    
    const { userId } = body
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }
    
    // 获取用户的 Stripe 客户 ID
    const { data: user, error: userError } = await supabase
      .from('user_profiles')
      .select('stripe_customer_id')
      .eq('id', userId)
      .single()
    
    if (userError || !user?.stripe_customer_id) {
      return NextResponse.json({ 
        error: 'No subscription found. Please subscribe first.' 
      }, { status: 404 })
    }
    
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || getBaseUrl(req)
    
    // 创建 Stripe 客户门户会话
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripe_customer_id,
      return_url: `${baseUrl}/dashboard/subscription`,
    })
    
    return NextResponse.json({ 
      url: portalSession.url 
    })
  } catch (err) {
    console.error('创建客户门户会话失败:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
