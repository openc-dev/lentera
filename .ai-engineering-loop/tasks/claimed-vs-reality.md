# Claimed vs Reality

| ID | Acceptance Criteria | Claimed | Reality |
|---|---|---|---|
| AC-1 | Supabase RLS & Indexes Migration | Mengaktifkan Row Level Security (RLS) di 5 tabel dan membuat unique partial index pada transaksi aktif | Terimplementasi penuh di lentera-frontend/supabase/migrations/20260729000003_enable_rls_and_indexes.sql dan lolos verifikasi |
| AC-2 | Atomic Concurrency Guard on Borrow | Menolak peminjaman ganda dengan atomic UPDATE status = 'available' dan return status 409 jika alat tidak tersedia | Terimplementasi penuh di lentera-frontend/app/api/borrow/route.ts dan lolos verifikasi |
| AC-3 | Stateless Kiosk Gateway Token | Menggantikan singleton token settings dengan token HMAC-SHA256 bertanda tangan digital dan menghapus token wipe destruktif | Terimplementasi penuh di lentera-frontend/lib/gateway-token.ts, generate/route.ts, validate/route.ts, borrow/route.ts, return/route.ts |
| AC-4 | Server-Side Auth & Admin Guards | Melindungi seluruh route handler administratif (POST/PUT/DELETE) dengan verifikasi token Bearer dan Next.js middleware | Terimplementasi penuh di lentera-frontend/lib/auth-server.ts, middleware.ts, login/route.ts, assets/route.ts, categories/route.ts, settings/route.ts |
| AC-5 | Sanitize Public PII Leakage | Menyaring dan menyamarkan data pribadi mahasiswa (NPM, prodi, kelas) pada response katalog publik | Terimplementasi penuh di lentera-frontend/app/api/assets/route.ts dan assets/scan/[code]/route.ts |
