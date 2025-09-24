import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const config = {
      // Supabase 配置
      supabase: {
        hasUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
        hasAnonKey: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
        url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 
          process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 20) + '...' : 
          'NOT_SET'
      },
      
      // Stripe 配置
      stripe: {
        hasSecretKey: Boolean(process.env.STRIPE_SECRET_KEY),
        hasWebhookSecret: Boolean(process.env.STRIPE_WEBHOOK_SECRET),
        hasMonthlyPriceId: Boolean(process.env.STRIPE_MONTHLY_PRICE_ID),
        hasYearlyPriceId: Boolean(process.env.STRIPE_YEARLY_PRICE_ID),
        hasPublishableKey: Boolean(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY),
        monthlyPriceId: process.env.STRIPE_MONTHLY_PRICE_ID ? 
          process.env.STRIPE_MONTHLY_PRICE_ID.substring(0, 15) + '...' : 
          'NOT_SET',
        yearlyPriceId: process.env.STRIPE_YEARLY_PRICE_ID ? 
          process.env.STRIPE_YEARLY_PRICE_ID.substring(0, 15) + '...' : 
          'NOT_SET'
      },
      
      // 其他配置
      general: {
        nodeEnv: process.env.NODE_ENV,
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'NOT_SET',
        timestamp: new Date().toISOString()
      }
    }
    
    return NextResponse.json(config)
  } catch (error) {
    return NextResponse.json({ 
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
