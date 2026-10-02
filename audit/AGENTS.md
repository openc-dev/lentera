# AUDIT DOMAIN DIRECTIVE
> **Path:** `@audit/`  
> **Lead Analyst:** Zahraan Dzakii Ts. (Senior Systems & White-Box Analyst)  
> **Scope:** Reverse Engineering, Pemodelan Diagram UML/Mermaid, Spesifikasi Bisnis, dan Analisis Kompleksitas Logika.

---

## 1. TANGGUNG JAWAB & LINGKUP KERJA (IN-SCOPE)
1. **Pemodelan Alur Sistem:**
   - Menyusun Sequence Diagram alur transaksi peminjaman & pengembalian di `@diagrams/`.
   - Menyusun State Transition Diagram siklus hidup aset (`available` <-> `borrowed` <-> `maintenance`).
   - Menyusun Activity Diagram interaksi Kiosk Display dan Mobile Client.
2. **Spesifikasi Aturan Bisnis & Batas Input (BVA/EP):**
   - Menuliskan batasan input formal di `@specs/` (misal: panjang NPM, format tanggal, jam operasional lab).
   - Menjadi acuan bagi Mu'adz dalam menulis kode pengujian di `@../tests`.
3. **Analisis White-Box:**
   - Menghitung Cyclomatic Complexity $V(G) = E - N + 2P$ pada fungsi peminjaman dan route handlers.

---

## 2. BATASAN LARANGAN (OUT-OF-SCOPE)
- **DILARANG** menginstal package manager, membuat test runner, atau menulis skrip automasi di folder ini (seluruh eksekusi kode berada di `@../tests`).
- **DILARANG** menggunakan format biner / gambar tidak terindeks git (seperti file .drawio biner atau PNG mentah tanpa source code). Seluruh diagram WAJIB ditulis dengan sintaks **Mermaid**.

---

## 3. STRUKTUR SUB-DIREKTORI
```text
audit/
├── AGENTS.md        <-- Direktif lokal agen AI Zahraan
├── diagrams/        <-- Diagram sekuensial, use case, dan flowgraph (Mermaid)
│   ├── borrow_sequence.mmd
│   └── state_transition.mmd
└── specs/           <-- Aturan validasi bisnis, batas nilai BVA/EP, skema data
    ├── validation_rules.md
    └── cyclomatic_complexity.md
```

---

## 4. RELASI KE DIREKTORI LAIN (CROSS-REFERENCES)
- `@../tests` : Mengonsumsi aturan di `@specs/` untuk dijadikan assertions pada script pengujian.
- `@../reports`: Mengambil diagram dari `@diagrams/` untuk dipajang pada slide presentasi mingguan.
