const fs = require('fs');
const file = 'app/(dashboard)/member/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove state and effects (Lines 41-114 roughly)
content = content.replace(
  /const \[regAlamat[\s\S]*?const \[regThn, setRegThn\] = useState\(""\)/,
  ''
);

// 2. Simplify payload
content = content.replace(
  /const toTitleCase = \([\s\S]*?points: 0\n      }/,
  `const payload = {
        name: userName,
        email: userEmail,
        phone: regPhone,
        alamat: "-",
        provinsi: "-",
        kecamatan: "-",
        kabupaten: "-",
        tanggal_lahir: null,
        membercard: newId,
        is_active: true,
        points: 0
      }`
);

// 3. Replace form fields with just Email and keep Phone
content = content.replace(
  /<form onSubmit={handleRegisterMember} className="space-y-4 py-4">[\s\S]*?<DialogFooter className="pt-4">/,
  `<form onSubmit={handleRegisterMember} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="regEmail">Email Terdaftar</Label>
              <Input id="regEmail" type="email" readOnly disabled value={memberData?.email || ""} className="bg-muted dark:bg-zinc-800 cursor-not-allowed" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="regPhone">No. WhatsApp / Telp Aktif</Label>
              <Input id="regPhone" type="tel" required placeholder="Masukkan No.Telp" value={regPhone} onChange={e => setRegPhone(e.target.value)} />
            </div>
            <DialogFooter className="pt-4">`
);

fs.writeFileSync(file, content);
console.log('Done replacing!');
