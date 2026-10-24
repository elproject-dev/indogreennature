const fs = require('fs');
const file = 'app/(dashboard)/member/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Fix newId error
content = content.replace(
  /\`Member berhasil didaftarkan dengan ID: \$\{newId\}\`/,
  `"Member berhasil didaftarkan"`
);

// Fix Tanggal Lahir section UI
// Look for the block containing Tanggal Lahir
content = content.replace(
  /<div className="flex items-center gap-3">\s*<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary\/10">\s*<Calendar className="h-5 w-5 text-primary" \/>\s*<\/div>\s*<div className="flex flex-col overflow-hidden">\s*<span className="text-\[11px\] text-muted-foreground uppercase tracking-wider font-semibold">Tanggal Lahir<\/span>\s*<p className="font-medium text-foreground text-sm truncate">{memberData.tanggalLahir}<\/p>\s*<\/div>\s*<\/div>/g,
  ''
);

// Fix Alamat section UI
// Look for the block containing Alamat
content = content.replace(
  /<div className="flex items-start gap-3 mt-4 sm:mt-6">\s*<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary\/10">\s*<MapPin className="h-5 w-5 text-primary" \/>\s*<\/div>\s*<div className="flex flex-col">\s*<span className="text-\[11px\] text-muted-foreground uppercase tracking-wider font-semibold">Alamat Lengkap<\/span>\s*\{memberData\.alamat !== "-" \? \(\s*<>\s*<p className="font-medium text-foreground text-sm leading-relaxed">\{memberData\.alamat\}<\/p>\s*<p className="font-medium text-foreground text-xs text-muted-foreground leading-relaxed">Kec\. \{memberData\.kecamatan\}, Kab\. \{memberData\.kabupaten\}<\/p>\s*<\/>\s*\) : \(\s*<span className="text-muted-foreground text-sm italic mt-1">Belum diisi<\/span>\s*\)\}\s*<\/div>\s*<\/div>/g,
  ''
);

fs.writeFileSync(file, content);
console.log('Done replacing UI errors!');
