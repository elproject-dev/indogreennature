import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function test() {
  const { data, error } = await supabase.from('customers').select('*').limit(1)
  console.log("Customers:", data, error)
  
  const { data: users, error: err2 } = await supabase.from('users').select('*').limit(1)
  console.log("Users:", users, err2)
  
  const { data: profiles, error: err3 } = await supabase.from('profiles').select('*').limit(1)
  console.log("Profiles:", profiles, err3)
}

test()
