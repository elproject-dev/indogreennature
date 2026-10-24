const fs = require('fs');
const file = 'app/(dashboard)/member/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Interface
content = content.replace(
  /interface MemberData {[\s\S]*?}/,
  `interface MemberData {
  name: string
  email: string
  phone: string
  points: number
  isMember: boolean
}`
);

// 2. handleRegisterMember
content = content.replace(
  /const handleRegisterMember = async \([\s\S]*?toast.add\(\{ title: "Berhasil"/,
  `const handleRegisterMember = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) throw new Error("Anda harus login")
      const userEmail = session.user.email || ""
      const userName = session.user.user_metadata?.full_name || session.user.user_metadata?.name || userEmail.split('@')[0]

      const { data: existing } = await supabase.from('pelanggan').select('id').eq('email', userEmail).limit(1)

      const payload = {
        name: userName,
        email: userEmail,
        phone: regPhone,
        is_active: true
      }

      if (existing && existing.length > 0) {
        const { error } = await supabase.from('pelanggan').update(payload).eq('email', userEmail)
        if (error) throw error
      } else {
        const { error } = await supabase.from('pelanggan').insert([payload])
        if (error) throw error
      }

      toast.add({ title: "Berhasil"`
);

// 3. fetchMemberData
content = content.replace(
  /let userAlamat = "-"[\s\S]*?membercard: memberCardId\n        }\)/,
  `if (userEmail) {
          const { data: pelangganData } = await supabase
            .from('pelanggan')
            .select('name, phone')
            .eq('email', userEmail)
            .limit(1)

          if (pelangganData && pelangganData.length > 0) {
            const p = pelangganData[0]
            if (!userPhone && p.phone) userPhone = p.phone
            if (p.name) userName = p.name
          }
        }

        // 3. Cocokkan dengan data pada tabel poin_transactions
        if (userPhone && userPhone !== "-") {
          const { data: poinData } = await supabase
            .from('poin_transactions')
            .select('poin, tipe')
            .eq('notelp', userPhone)

          if (poinData && poinData.length > 0) {
            userIsMember = true // Terdeteksi sebagai member karena ada data poin

            // Hitung total poin
            userPoints = poinData.reduce((total: number, trx: any) => {
              const p = Number(trx.poin) || 0
              return trx.tipe === 'plus' ? total + p : total - p
            }, 0)
          }
        }

        if (!userPhone) userPhone = "-"

        setMemberData({
          name: userName,
          email: userEmail,
          phone: userPhone,
          points: userPoints,
          isMember: userIsMember
        })`
);

// 4. UI ID Member
content = content.replace(
  /<div className="text-right">\s*<span className="text-\[8px\].*?>ID Member<\/span>\s*<span className=".*?>{memberData.membercard}<\/span>\s*<\/div>/,
  ''
);

fs.writeFileSync(file, content);
console.log('Done replacing DB errors!');
