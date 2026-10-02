# REPORTS DOMAIN DIRECTIVE
> **Path:** `@reports/`  
> **Maintainer:** Tim Kelompok 1 (Integrasi: Mu'adz / Zahraan & Konten: Syifa Amelia)  
> **Scope:** Etalase Hasil Audit Mingguan, Matriks Kasus Uji, dan Berkas Presentasi Perkuliahan.

---

## 1. TANGGUNG JAWAB & LINGKUP KERJA (IN-SCOPE)
1. **Penyusunan Berkas Mingguan per Pertemuan:**
   - Menyediakan subfolder terdedikasi untuk setiap pertemuan kuliah: `pertemuan-03/`, `pertemuan-04/`, dst.
   - Menampung file laporan ringkas (`LAPORAN_PXX.md`) dan slide presentasi (`SLIDES_PXX.md` / PDF).
2. **Pengarsipan Matriks Kasus Uji (Black Box):**
   - Mengonversi data pengujian fungsional Syifa Amelia (dari spreadsheet) menjadi tabel Markdown yang rapi dan terverifikasi.
3. **Dokumentasi Hasil UAT (User Acceptance Testing):**
   - Merekapitulasi skor kuisioner System Usability Scale (SUS) pada akhir semester.

---

## 2. STRUKTUR SUB-DIREKTORI
```text
reports/
├── AGENTS.md        <-- Direktif lokal pengarsipan laporan
├── pertemuan-03/    <-- Pemaparan Platform Lentera & Profil Tim
│   ├── LAPORAN_P3.md
│   └── SLIDES_P3.md
├── pertemuan-04/    <-- Testability & Manajemen Mutu
│   ├── LAPORAN_P4.md
│   └── SLIDES_P4.md
└── ...              <-- Berlanjut hingga pertemuan-13 (UAS)
```

---

## 3. RELASI KE DIREKTORI LAIN (CROSS-REFERENCES)
- `@../audit/diagrams` : Mengambil diagram Mermaid Zahraan untuk disematkan pada slide presentasi mingguan.
- `@../tests`          : Mengambil bukti tangkapan log eksekusi terminal Mu'adz untuk dilampirkan ke laporan tertulis.
- GitHub Issues        : Mengambil tautan tiket bug temuan Syifa untuk ditampilkan pada slide evaluasi kualitas.
