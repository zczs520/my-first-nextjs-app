// lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // 构建和运行时如果未配置，不抛错以免页面崩溃，输出警告即可
  // 在 /env-check 页面可以更直观地查看配置状态
  console.warn('[Supabase] 缺少 NEXT_PUBLIC_SUPABASE_URL 或 NEXT_PUBLIC_SUPABASE_ANON_KEY 环境变量')
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')

// 同时提供默认导出，兼容 default 导入写法
export default supabase
