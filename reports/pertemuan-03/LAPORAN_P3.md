# LAPORAN SPRINT PERTEMUAN 03
## PEMAPARAN PLATFORM SASARAN PENGUJIAN & REVERSE ENGINEERING BISNIS PROSES
> **Mata Kuliah:** Pengujian Perangkat Lunak (KB260004 &middot; 2 SKS)  
> **Kelompok:** 1 (TRM3A1) &middot; TA 2026/2027  
> **Dosen Pengampu:** Charmiyanti Nurkentjana Aju, S.Kom., M.Kom.  
> **Tanggal Sesi:** Selasa, Pertemuan Ke-3  

---

### 1. RINGKASAN EKSEKUTIF
Pada sesi perkuliahan Pertemuan ke-3, Kelompok 1 secara resmi menetapkan dan memaparkan platform sasaran pengujian perangkat lunak bernama **Lentera (Laboratory Asset Lending & Tracking System)**. 

Lentera dipilih karena merepresentasikan sistem hybrid (kiosk anjungan lab + peramban seluler pengguna) yang memiliki tantangan integritas data nyata, siklus state machine tertutup (`available` ↔ `borrowed`), serta potensi kerentanan konkurensi (*race condition*) pada saat transaksi massal praktikum.

---

### 2. ARTEFAK YANG DILAPORKAN
1. **Slide Presentasi Resmi (11 Slide):**
   - Berkas: `SLIDES_P3.md` (tersedia dalam format HTML dan PDF pada direktori ini).
2. **Master Test Plan (Acuan Pengujian 1 Semester):**
   - Berkas acuan: `@../../TEST_PLAN.md` (mengacu pada standar ISO/IEC/IEEE 29119).
3. **Pembagian Peran Teknis & Alur Estafet:**
   - **Mu'adz Hudzaifah (24903460014):** Perancang Arsitektur Pengujian & Automasi (`@../../tests`).
   - **Zahraan Dzakii Ts. (24903460011):** Analis Alur Sistem & White-Box (`@../../audit`).
   - **Syifa Amelia (24903460001):** Analis Pengujian Fungsional & Advokat Pengguna (Web GitHub Issues & `@../../reports`).

---

### 3. DEKONSTRUKSI 4 BISNIS PROSES UTAMA LENTERA
1. **Kiosk Gateway Session & QR Token Rotation:** Monitor fisik lab menghasilkan token QR dinamis dengan masa berlaku terbatas (TTL) untuk memverifikasi kehadiran fisik mahasiswa.
2. **Peminjaman Mandiri Alat (Self-Service Borrowing):** Mahasiswa memindai QR, memvalidasi identitas perkuliahan, memilih aset tersedia, dan sistem mengunci status barang.
3. **Pengembalian Mandiri Alat (Self-Service Return):** Mahasiswa memindai ulang QR di lab, memvalidasi kesesuaian NPM peminjam awal, dan menutup transaksi.
4. **Manajemen Inventaris Laboran:** Laboran memantau dashboard analitik sirkulasi alat dan mencetak label fisik identifikasi barang.

---

### 4. RENCANA KERJA PERTEMUAN BERIKUTNYA (PERTEMUAN 04)
- **Fokus Silabus:** *Isu Seputar Testing & Testability*.
- **Target Deliverable:**
  - Zahraan menyusun Use Case Diagram dan Activity Diagram resmi di `@../../audit/diagrams`.
  - Mu'adz membedah testability arsitektur kiosk vs client di `@../../audit/specs/testability_matrix.md`.
  - Syifa menyusun daftar periksa fitur (*Feature Checklist*) untuk persiapan pengujian fungsional.
