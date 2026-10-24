import { createClient } from '@supabase/supabase-js'

const rawSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || ''
const rawSupabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || ''

// Bersihkan dari spasi, baris baru (\n / \r), atau tanda kutip yang tidak sengaja terbawa saat copy-paste env
const supabaseUrl = rawSupabaseUrl.trim().replace(/[\r\n"']/g, '').replace(/\/+$/, '')
const supabaseAnonKey = rawSupabaseAnonKey.trim().replace(/[\r\n"']/g, '')

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== 'your_supabase_project_url' &&
    !supabaseUrl.includes('placeholder.supabase.co')
)

const dummyFetch: typeof fetch = async () => {
  return new Response(JSON.stringify([]), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Content-Range': '0-0/0',
    },
  })
}

export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : 'https://placeholder.supabase.co',
  isSupabaseConfigured ? supabaseAnonKey : 'placeholder',
  isSupabaseConfigured
    ? {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      }
    : { global: { fetch: dummyFetch } }
)



