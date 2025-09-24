// lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

let supabase

if (supabaseUrl && supabaseAnonKey) {
  // 正常初始化（仅当必需的环境变量存在时）
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    },
  })
} else {
  // 环境变量缺失时，提供一个安全的 Mock，避免页面在模块加载阶段直接崩溃
  console.warn('[Supabase] 缺少 NEXT_PUBLIC_SUPABASE_URL 或 NEXT_PUBLIC_SUPABASE_ANON_KEY 环境变量，已启用安全 Mock。请在 .env.local 或 Vercel 环境变量中正确配置。')
  const notConfigured = (method = 'operation') => {
    const err = new Error(`[Supabase Mock] 环境变量未配置，无法执行 ${method}`)
    // 兼容 supabase 风格返回
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
  supabase = {
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

// 同时提供默认导出，兼容 default 导入写法
export default supabase
