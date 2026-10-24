import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function test() {
  const { data, error } = await supabase.from('users').select('*').limit(1)
  console.log("users:", data, error)
  // try the actual auth schema if possible, though supabase-js normally points to public
  // we can use a raw fetch
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/users?select=*`
  const res = await fetch(url, {
    headers: {
      'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
    }
  })
  const text = await res.text()
  console.log("auth.users rest:", text)
}

test()
