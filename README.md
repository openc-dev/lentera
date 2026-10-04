# Lentera — Quality Audit Suite
> **Branch Audit:** `qa/ppl-audit`  
> **Mata Kuliah:** Pengujian Perangkat Lunak (KB260004 &middot; 2 SKS)  
> **Program Studi:** Teknologi Rekayasa Multimedia (TRM3A1) &middot; TA 2026/2027  
> **Dosen Pengampu:** Charmiyanti Nurkentjana Aju, S.Kom., M.Kom.  
> **Tim Penguji (Kelompok 1):**  
> &bull; **Mu'adz Hudzaifah (24903460014)** — Perancang Arsitektur Pengujian & Automasi (`@tests/`)  
> &bull; **Zahraan Dzakii Ts. (24903460011)** — Analis Alur Sistem & White-Box (`@audit/`)  
> &bull; **Syifa Amelia (24903460001)** — Analis Pengujian Fungsional & Advokat Pengguna (`@reports/`)  

---

## 1. PETA NAVIGASI AUDIT REPOSITORI

Repositori pada branch ini dikonfigurasi sebagai **lingkungan audit mutu independen** terisolasi mengacu pada standar ISO/IEC/IEEE 29119:

```text
lentera/ (Branch: qa/ppl-audit)
├── README.md               # Halaman utama profil audit sistem
├── TEST_PLAN.md            # Master Test Plan resmi (IEEE 829 / ISO 29119)
├── AGENTS.md               # Master Agent Directive (Aturan agen AI)
│
├── audit/                  # [KAVLING ZAHRAAN] Pemodelan Sistem & Analisis Logika
│   ├── AGENTS.md           # Panduan kerja agen analis
│   ├── diagrams/           # Diagram Sequence, Activity, State (Mermaid murni)
│   └── specs/              # Spesifikasi batas nilai input (BVA/EP) & aturan bisnis
│
├── tests/                  # [KAVLING MU'ADZ] Executable Tests & Automasi
│   ├── AGENTS.md           # Panduan kerja agen arsitek automasi
│   ├── unit/               # Pengujian unit fungsi validator & token
│   ├── api/                # Pengujian integrasi endpoint API HTTP
│   ├── concurrency/        # Simulasi race condition transaksi aset simultan
│   └── fixtures/           # Script seed data inventaris laboratorium dummy
│
├── reports/                # [ETALASE BERSAMA] Arsip Laporan & Slide Mingguan
│   ├── AGENTS.md           # Panduan pengarsipan hasil pengujian
│   ├── pertemuan-03/       # Pemaparan Sistem Lentera (Laporan & Slide)
│   └── ...                 # Terus diperbarui hingga pertemuan-13 (UAS)
│
└── lentera-frontend/       # [TARGET SISTEM] Aplikasi Web Next.js 16 + Supabase
```

---

## 2. DOKUMENTASI & PANDUAN PENGUJIAN UTAMA

- **[TEST_PLAN.md](./TEST_PLAN.md)**: Rencana pengujian lengkap 13 pertemuan, profil sistem, 4 bisnis proses, dan strategi pengujian.
- **[Laporan Pertemuan 3](./reports/pertemuan-03/LAPORAN_P3.md)**: Ringkasan eksekutif penetapan platform Lentera.
- **[Slide Presentasi Pertemuan 3](./reports/pertemuan-03/SLIDES_P3.md)**: Berkas slide 11 halaman untuk pemaparan di hadapan dosen pengampu.
- **[Form Lapor Cacat (GitHub Issue Form)](https://github.com/openc-dev/lentera/issues/new?template=bug_report.yml)**: Formulir interaktif resmi pelaporan temuan bug bagi penguji fungsional.

---

## 3. LINGKUNGAN PENGUJIAN STAGING (VERCEL & SUPABASE)

Pengujian fungsional pengguna manual dilakukan pada lingkungan pratinjau (*preview deployment*) terisolasi:
- **Tautan Pratinjau Staging:** [https://lentera-git-qa-ppl-audit-mu-adz-hudzaifah-s-projects.vercel.app](https://lentera-git-qa-ppl-audit-mu-adz-hudzaifah-s-projects.vercel.app)
- **Aplikasi Web Sasaran:** Next.js 16 (React 19, TypeScript, Tailwind CSS v4)
- **Basis Data:** Supabase PostgreSQL (Row Level Security & Atomic RPC)
- **Pencatatan Masalah:** GitHub Issues Tracker (`https://github.com/openc-dev/lentera/issues`)

---

## 4. ALUR SISTEM LENTERA SECARA UMUM

1. **Admin / Laboran** mengelola master aset dan memantau sirkulasi alat via `/admin/dashboard`.
2. **Monitor Kiosk Lab** (`/display`) memutar kode QR dinamis berisi gateway token dengan masa aktif terbatas (TTL).
3. **Mahasiswa** memindai QR lewat ponsel → diarahkan ke `/scan` → memilih menu **Pinjam** atau **Kembalikan**.
4. **Form Pinjam** (`/form/borrow`): Mahasiswa mengisi identitas (NPM, Nama, Matkul, Dosen) dan memilih alat yang tersedia → status aset berubah jadi `borrowed`.
5. **Form Kembali** (`/form/return`): Mahasiswa memilih alat yang dibawa dan memvalidasi NPM peminjam → status aset kembali ke `available`.
