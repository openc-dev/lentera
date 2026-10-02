# TEST AUTOMATION DOMAIN DIRECTIVE
> **Path:** `@tests/`  
> **Lead Architect:** Mu'adz Hudzaifah (Principal Test Architect & Automation Lead)  
> **Scope:** Script Automasi, API Integration Tests, Simulasi Konkurensi (Race Condition), Mock Fixtures, dan Pipeline CI.

---

## 1. TANGGUNG JAWAB & LINGKUP KERJA (IN-SCOPE)
1. **Automasi Pengujian API & Route Handlers:**
   - Menulis skrip pengujian HTTP endpoint (`/api/borrow`, `/api/return`, `/display`) di `@api/`.
   - Menguji kode status HTTP (200, 400, 401, 409 Conflict) dan struktur respons JSON.
2. **Pengujian Unit & Logika Validasi (UTS Milestone):**
   - Menulis test suite di `@unit/` untuk menguji fungsi regex NPM, generator hash token gateway, dan kalkulasi batas waktu peminjaman.
3. **Pengujian Konkurensi & Keamanan Sesi:**
   - Menulis skrip di `@concurrency/` untuk mensimulasikan permintaan simultan (race condition) pada satu aset laboratorium.
4. **Mock Data & Fixtures Database:**
   - Menyediakan script SQL seed di `@fixtures/` untuk mengisi data inventaris tiruan tanpa mencemari basis data utama.

---

## 2. PILIHAN TEKNOLOGI & TOOLING
- **Bahasa Pengujian Bebas:** Agen diizinkan menulis pengujian menggunakan **TypeScript/Vitest**, **Python (httpx/pytest)**, **Go (goroutine concurrency benchmark)**, atau **Bash/cURL** murni sesuai efisiensi skenario uji.
- **Log Eksekusi Terstandarisasi:** Seluruh hasil pengujian terminal wajib diexport atau dipipe agar dapat dilampirkan ke `@../reports`.

---

## 3. STRUKTUR SUB-DIREKTORI
```text
tests/
├── AGENTS.md        <-- Direktif lokal agen AI Mu'adz
├── unit/            <-- Unit tests fungsi logika dan validator
├── api/             <-- API integration tests
├── concurrency/     <-- Simulasi race condition & load testing
└── fixtures/        <-- Mock data SQL seed & clean reset scripts
    └── seed_mock_assets.sql
```

---

## 4. RELASI KE DIREKTORI LAIN (CROSS-REFERENCES)
- `@../audit/specs`     : Seluruh assertion pengujian WAJIB mengacu pada batasan nilai yang dirumuskan di specs.
- `@../reports`         : Tempat menyetorkan log eksekusi terminal (Pass/Fail) untuk laporan mingguan.
- `@../lentera-frontend`: Target kode antarmuka dan route handlers yang diuji.
- `@../lentera-backend` : Target kode server dan endpoint API yang diuji.
