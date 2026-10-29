# CV. Indo Green Nature - Web Application

Aplikasi web profil perusahaan, katalog produk, dan dashboard admin untuk **CV. Indo Green Nature**. Dibangun dengan **Next.js 16 (App Router)** dan backend **Supabase Self-Hosted di VPS**.

---

## 🚀 Panduan Lengkap Infrastruktur & VPS

Seluruh panduan teknis mengenai server VPS Helipod, kredensial, konfigurasi Nginx/SSL, auto-start, penghematan RAM, serta sistem **Backup & Restore otomatis ke Google Drive** telah didokumentasikan secara rinci di:

👉 **[Buka Panduan Lengkap: VPS_GUIDE.md](./VPS_GUIDE.md)**

---

## 🛠️ Stack Teknologi

- **Frontend:** Next.js 16 (React 19, TypeScript, Tailwind CSS, Lucide Icons)
- **Deployment Frontend:** [Vercel](https://www.indogreennature.com)
- **Backend / Database:** Supabase Self-Hosted Docker (PostgreSQL 17, PostgREST, GoTrue Auth, Storage API, ImgProxy)
- **API Domain:** `https://api.indogreennature.com`
- **VPS Server:** Helipod Cloud (Debian 12, Nginx Reverse Proxy, Certbot Let's Encrypt SSL)
- **Cloud Backup:** Rclone terintegrasi dengan Google Drive (`indogreennature.web@gmail.com`)

---

## 💻 Menjalankan Project di Komputer Lokal

### 1. Install Dependensi
```bash
pnpm install
```

### 2. Konfigurasi Environment Variable
Pastikan file `.env.local` sudah mengarah ke backend Supabase VPS:
```env
NEXT_PUBLIC_SUPABASE_URL=https://api.indogreennature.com
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi... (key anon VPS)
```

### 3. Jalankan Development Server
```bash
pnpm dev
```
Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

### 4. Build Production
```bash
pnpm build
pnpm start
```

---

## 📦 Perintah Cepat Backup & Restore VPS

Jika Anda sedang terhubung via SSH ke VPS (`ssh root@43.173.39.6`):

- **Cek Status Container:** `dps`
- **Cek Backup di Google Drive:** `rclone ls indogreen-backup:Supabase-Backup`
- **Backup Manual Sekarang:** `/root/backup-supabase.sh`
- **Restore Database:** `/root/restore-supabase.sh [NAMA_FILE_BACKUP]`
- **Matikan Studio (Hemat RAM):** `docker stop supabase-studio`
- **Nyalakan Studio (Buka Web UI):** `docker start supabase-studio`

