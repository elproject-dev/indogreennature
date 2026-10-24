import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

async function test() {
  const { data, error } = await supabase.auth.admin.listUsers()
  if (error) {
    console.error("Error:", error)
    return
  }
  const googleUsers = data.users.filter(u => 
    u.app_metadata?.providers?.includes('google') ||
    u.identities?.some(id => id.provider === 'google')
  )
  console.log("Total users:", data.users.length)
  console.log("Google users:", googleUsers.length)
}

test()
