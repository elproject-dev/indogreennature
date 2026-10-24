import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function test() {
  const { data: profiles, error: err3 } = await supabase.from('profiles').select('*')
  console.log("Profiles:", profiles, err3)
}

test()
