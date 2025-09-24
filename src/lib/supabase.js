// lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// 创建安全的 Mock 客户端
const createMockClient = () => {
  console.warn('[Supabase] 缺少 NEXT_PUBLIC_SUPABASE_URL 或 NEXT_PUBLIC_SUPABASE_ANON_KEY 环境变量，已启用安全 Mock。请在 .env.local 或 Vercel 环境变量中正确配置。')
  const notConfigured = (method = 'operation') => {
    const err = new Error(`[Supabase Mock] 环境变量未配置，无法执行 ${method}`)
    return { data: null, error: err }
  }
  const chain = () => ({
    select: async () => notConfigured('select'),
    insert: async () => notConfigured('insert'),
    update: async () => notConfigured('update'),
    delete: async () => notConfigured('delete'),
    eq: () => chain(),
    ilike: () => chain(),
    order: () => chain(),
    single: async () => notConfigured('single'),
  })
  return {
    auth: {
      signInWithPassword: async () => notConfigured('signInWithPassword'),
      signInWithOtp: async () => notConfigured('signInWithOtp'),
      verifyOtp: async () => notConfigured('verifyOtp'),
      signUp: async () => notConfigured('signUp'),
      signOut: async () => ({ error: null }),
      resetPasswordForEmail: async () => notConfigured('resetPasswordForEmail'),
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
    },
    from: () => chain(),
  }
}

// 创建 supabase 客户端
const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      },
      global: {
        headers: {
          'X-Client-Info': 'nextjs-app'
        }
      },
      db: {
        schema: 'public'
      },
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      }
    })
  : createMockClient()

// 添加连接状态检查
if (typeof window !== 'undefined') {
  console.log('[Supabase] 客户端配置状态:', {
    hasUrl: Boolean(supabaseUrl),
    hasKey: Boolean(supabaseAnonKey),
    isMock: !supabaseUrl || !supabaseAnonKey,
    url: supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : 'NOT_SET'
  })
}

export default supabase
