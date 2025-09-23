import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL) {
  throw new Error('SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) is not set')
}
if (!SERVICE_ROLE_KEY) {
  console.warn('[supabaseAdmin] SUPABASE_SERVICE_ROLE_KEY is not set. Server auth routes will fail until you add it in Vercel env.')
}

export const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)
