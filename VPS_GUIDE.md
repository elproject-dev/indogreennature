# Dokumentasi Infrastruktur & Operasional VPS (CV. Indo Green Nature)

Dokumentasi lengkap mengenai arsitektur server, Supabase Self-Hosted, SSL/Domain, manajemen memori, serta prosedur Backup & Restore otomatis ke Google Drive.

---

## 1. Arsitektur & Spesifikasi Sistem

| Komponen | Layanan / Provider | Alamat / Endpoint | Keterangan |
| :--- | :--- | :--- | :--- |
| **Frontend Web** | Vercel (Next.js 16) | `https://www.indogreennature.com` | Production Web |
| **Backend VPS** | Helipod Cloud (Debian 12) | `43.173.39.6` | Root server |
| **Supabase API** | Self-Hosted Docker | `https://api.indogreennature.com` | REST, Auth, Storage, DB |
| **Web Server / SSL** | Nginx + Certbot | Port 80 & 443 (HTTPS) | Reverse Proxy ke Port 8000 |
| **Cloud Backup** | Rclone + Google Drive | `indogreen-backup:Supabase-Backup` | Akun: `indogreennature.web@gmail.com` |

---

## 2. Akses & Kredensial VPS

* **Koneksi SSH:**
  ```bash
  ssh root@43.173.39.6
  ```
* **Direktori Supabase Docker:**
  ```bash
  cd /root/supabase-docker/supabase/docker
  ```
* **Dashboard Supabase Studio (Web UI):**
  - URL: `http://43.173.39.6:8000` *(nyalakan container studio terlebih dahulu jika sedang dimatikan)*
  - Default Username: `supabase`
  - Default Password: Diatur pada `DASHBOARD_PASSWORD` di file `/root/supabase-docker/supabase/docker/.env`
* **Koneksi Langsung Database PostgreSQL:**
  - Host: `43.173.39.6` atau `api.indogreennature.com`
  - Port: `5432` *(Langsung)* atau `6543` *(Supavisor Pooler)*
  - Database: `postgres`
  - User: `postgres`
  - Password: Cek `POSTGRES_PASSWORD` di `.env`

---

## 3. Perintah Operasional Harian (Cheatsheet)

### A. Melihat Status Container Docker
Gunakan alias tabel rapi yang sudah terpasang:
```bash
dps
```
*(Menampilkan tabel status seluruh container dengan tanda centang hijau `✓` jika healthy).*

### B. Cek Pemakaian Memori & Swap
```bash
free -h
docker stats --no-stream
```

### C. Menghemat RAM: Mengontrol Supabase Studio
Supabase Studio memakan ~300 MB RAM. Matikan saat tidak dipakai dan nyalakan hanya saat ingin melihat database lewat browser:
```bash
# Mematikan Studio (Hemat RAM):
docker stop supabase-studio

# Menyalakan kembali Studio saat butuh Web UI:
docker start supabase-studio
```

### D. Restart Seluruh Stack Supabase
```bash
cd /root/supabase-docker/supabase/docker
docker compose down
docker compose up -d
```

### E. Cek & Reload Nginx Web Server
```bash
nginx -t && systemctl reload nginx
```

---

## 4. Sistem Backup Otomatis ke Google Drive

Backup berjalan otomatis setiap hari pukul **02:00 Pagi** melalui cron job.

* **Lokasi Script Backup:** `/root/backup-supabase.sh`
* **Log Aktivitas Backup:** `/var/log/backup.log`
* **Akun Tujuan:** `indogreennature.web@gmail.com`
* **Folder Tujuan di Google Drive:** `Supabase-Backup`

### Perintah Cek & Manual Backup:
```bash
# 1. Menjalankan backup secara manual kapan saja:
/root/backup-supabase.sh

# 2. Melihat daftar file backup yang ada di Google Drive:
rclone ls indogreen-backup:Supabase-Backup

# 3. Melihat jadwal Cron yang aktif:
crontab -l
```

---

## 5. Prosedur Restore Database dari Google Drive

Jika suatu saat database bermasalah atau Anda ingin kembali ke titik backup tertentu:

### Cara Praktis (Menggunakan Script Restore):
VPS sudah dilengkapi skrip restore otomatis di `/root/restore-supabase.sh`:

1. Cek nama file backup yang tersedia di Google Drive:
   ```bash
   rclone ls indogreen-backup:Supabase-Backup
   ```
2. Jalankan perintah restore dengan menyertakan nama filenya:
   ```bash
   /root/restore-supabase.sh supabase_backup_2026-10-29_17-59-25.sql.gz
   ```
   *(Skrip akan otomatis mengunduh dari Google Drive, mengekstrak, mengimpor ke PostgreSQL, dan membersihkan file sementara).*

### Cara Manual:
```bash
# 1. Download file backup dari Google Drive ke VPS:
rclone copy indogreen-backup:Supabase-Backup/NAMA_FILE.sql.gz /root/

# 2. Ekstrak dan restore ke Postgres container:
gunzip -c /root/NAMA_FILE.sql.gz | docker exec -i supabase-db psql -U postgres -d postgres
```

---

## 6. Catatan Keamanan & Troubleshooting Penting

1. **Firewall Helipod (Security Group):**
   Pastikan port berikut selalu berstatus `ALLOW / INBOUND` di panel web Helipod:
   - Port `22` (SSH)
   - Port `80` (HTTP / Verifikasi Certbot SSL)
   - Port `443` (HTTPS API resmi `api.indogreennature.com`)
   - Port `8000` (Supabase Kong Gateway & Studio)

2. **Google OAuth (Login):**
   - Redirect URI resmi di Google Cloud Console: `https://api.indogreennature.com/auth/v1/callback`
   - Client ID & Secret tersimpan di `.env` VPS pada `GOOGLE_CLIENT_ID` dan `GOOGLE_SECRET`.

3. **Buffer Nginx:**
   Konfigurasi Nginx di `/etc/nginx/sites-available/supabase` wajib menyertakan `proxy_buffer_size 128k;` untuk mencegah error 502 Bad Gateway saat Next.js memuat query `app_config` yang sangat panjang.
