# LENTERA QA SUITE — MASTER AGENT DIRECTIVE
> **Branch:** `qa/ppl-audit`  
> **Mata Kuliah:** Pengujian Perangkat Lunak (KB260004 &middot; 2 SKS)  
> **Program Studi:** Teknologi Rekayasa Multimedia (TRM3A1) &middot; Universitas Boash  
> **Target Sistem:** Lentera Self-Service Lab Asset Kiosk (`lentera-frontend/` & Supabase)  
> **Auditor:** Kelompok 1 (Mu'adz Hudzaifah, Zahraan Dzakii Ts., Syifa Amelia)  
> **Status:** SUPREME REPOSITORY DIRECTIVE — ACUAN SELURUH AI AGENT DI REPOSITORI INI

---

## 1. MISI & TUJUAN AUDIT
Repositori pada branch `qa/ppl-audit` ini difungsikan sebagai **lingkungan audit mutu dan pengujian perangkat lunak independen** mengacu pada standar ISO/IEC/IEEE 29119 dan IEEE 829. 

Seluruh AI Agent (Antigravity, OpenCode, Claude Code, Agy, dll.) yang beroperasi di repositori ini WAJIB mematuhi pembagian kavling kerja terisolasi agar kolaborasi tim berjalan deterministik tanpa konflik git (*zero merge conflicts*).

---

## 2. KAVLING KERJA & BATAS WILAYAH (TERRITORIAL BOUNDARIES)

```text
lentera/ (qa/ppl-audit)
├── audit/           --> Domain Analisis & Pemodelan (Zahraan Dzakii Ts.)
├── tests/           --> Domain Automasi & Pengujian Mesin (Mu'adz Hudzaifah)
├── reports/         --> Domain Integrasi Laporan & Slide Mingguan (Tim Kelompok 1)
├── lentera-backend/ --> [PROTECTED] Laravel Prototype (Arsip acuan)
└── lentera-frontend/--> [PROTECTED] Next.js 16 Web App (Target Sistem Uji)
```

### Aturan Ketat untuk Seluruh Agen:
1. **Dilarang Mencemari Kode Aplikasi Asli:**  
   Agen DILARANG menaruh artefak pengujian atau dokumen analisis di dalam folder `lentera-frontend/` atau `lentera-backend/`. Seluruh pekerjaan audit bertempat di `@audit/`, `@tests/`, atau `@reports/`.
2. **Kedaulatan Pemilik Folder:**
   - Agen yang bekerja untuk **Mu'adz** beroperasi di `@tests/`.
   - Agen yang bekerja untuk **Zahraan** beroperasi di `@audit/`.
   - Agen integrator laporan beroperasi di `@reports/`.
3. **Format Diagram Wajib Mermaid:**  
   Seluruh diagram (Sequence, Flowchart, State, ERD) wajib ditulis dalam sintaks Mermaid murni (`.mmd` / Markdown) agar *git-diffable* dan dirender native oleh GitHub.
4. **Target Sistem Nyata:**  
   Aplikasi aktif yang diuji adalah `lentera-frontend/` (Next.js 16, React 19, TypeScript, Serverless Route Handlers di `app/api/`) dan database Supabase PostgreSQL.

---

## 3. PETA HUBUNGAN ANTAR-DIREKTORI (CROSS-REFERENCES)

* **`@audit/specs` → Sumber Kebenaran Logika:**  
  Setiap skrip pengujian di `@tests/` WAJIB mengacu pada spesifikasi batas nilai dan aturan bisnis yang dimodelkan di `@audit/specs`.
* **`@tests/` → Sumber Bukti Eksekusi:**  
  Laporan mingguan di `@reports/` mengambil log terminal nyata dan metrik status dari hasil eksekusi skrip di `@tests/`.
* **GitHub Issues → Sumber Cacat Fungsional:**  
  Temuan cacat dari pengujian manual Syifa Amelia dicatat melalui GitHub Issues Web UI dan ditautkan ke commit perbaikan menggunakan sintaks `closes #N` atau `ref #N`.

---

## 4. PEDOMAN COMMIT & TRACEABILITY
Gunakan konvensi commit semantik:
- `test(scope): ... (ref #N)` : Menambahkan skenario uji terkait Issue #N.
- `fix(scope): ... (closes #N)` : Memperbaiki cacat kode pada form/API dan menutup Issue #N.
- `docs(audit): ...` : Memperbarui diagram Mermaid atau spesifikasi aturan bisnis di `@audit`.
- `docs(reports): ...` : Memperbarui matriks uji atau slide presentasi mingguan di `@reports`.
