const fs = require('fs');
const file = 'app/(dashboard)/member/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Update Registration Logic to insert into customers table
content = content.replace(
  /if \(error\) throw error\n      }\n\n      toast\.add\(\{ title: "Berhasil"/,
  `if (error) throw error
      }

      // 3. Insert ke customers table agar sinkron dengan POS
      const { data: existingCustomer } = await supabase.from('customers').select('id').eq('phone', regPhone).limit(1)
      if (!existingCustomer || existingCustomer.length === 0) {
        await supabase.from('customers').insert([{
           name: userName,
           phone: regPhone,
           membership_type: "member",
           points: 0,
           total_spent: 0
        }])
      }

      toast.add({ title: "Berhasil"`
);

// 2. Update Fetch Logic to read from customers table
content = content.replace(
  /\/\/ 3\. Cocokkan dengan data pada tabel poin_transactions[\s\S]*?if \(!userPhone\) userPhone = "-"/,
  `// 3. Ambil data poin dari tabel customers (sinkron dengan POS)
        if (userPhone && userPhone !== "-") {
          const { data: customerData } = await supabase
            .from('customers')
            .select('points, membership_type')
            .eq('phone', userPhone)
            .limit(1)

          if (customerData && customerData.length > 0) {
            userIsMember = true // Terdeteksi sebagai member di POS
            userPoints = customerData[0].points || 0
          }
        }

        if (!userPhone) userPhone = "-"`
);

fs.writeFileSync(file, content);
console.log('Done integrating with customers table!');
