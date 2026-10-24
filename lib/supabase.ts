import { createClient } from '@supabase/supabase-js'

function extractValidKey(raw: string): string {
  if (!raw) return ''
  // 1. Cek apakah ada format Supabase publishable key baru (sb_publishable_...)
  const publishableMatch = raw.match(/sb_publishable_[A-Za-z0-9_-]+/)
  if (publishableMatch) return publishableMatch[0]

  // 2. Cek format JWT standar Supabase (header.payload.signature)
  const jwtMatch = raw.match(/eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/)
  if (jwtMatch) return jwtMatch[0]

  return raw.trim().replace(/[\r\n"']/g, '')
}

function extractValidUrl(raw: string): string {
  if (!raw) return ''
  const match = raw.match(/https?:\/\/[a-zA-Z0-9.-]+\.supabase\.co/)
  if (match) return match[0]
  return raw.trim().replace(/[\r\n"']/g, '').replace(/\/+$/, '')
}

const rawSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || ''
const rawSupabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || ''

// Ekstrak URL dan Key yang benar bahkan jika di env terduplikasi atau tertempel teks lain
const supabaseUrl = extractValidUrl(rawSupabaseUrl)
const supabaseAnonKey = extractValidKey(rawSupabaseAnonKey)

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



