const fetch = require('node-fetch');
require('dotenv').config({ path: '.env.local' });
const url = 'https://wnozfcqgcmvxvkxbxgfj.supabase.co/rest/v1/poin_transactions?select=membercard&notelp=eq.083867180887&limit=1';
fetch(url, {
  headers: {
    'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  }
}).then(res => res.text()).then(text => console.log("POIN_TRANSACTIONS ERROR:", text));

const url2 = 'https://wnozfcqgcmvxvkxbxgfj.supabase.co/rest/v1/pelanggan?select=membercard&membercard=like.MG-SW%25&order=membercard.desc&limit=1';
fetch(url2, {
  headers: {
    'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  }
}).then(res => res.text()).then(text => console.log("PELANGGAN ERROR:", text));
