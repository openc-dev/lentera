---
marp: true
theme: default
paginate: true
size: 16:9
header: 'PENGUJIAN PERANGKAT LUNAK &middot; TEKNOLOGI REKAYASA MULTIMEDIA'
footer: 'SISTEM SASARAN PENGUJIAN: LENTERA &middot; KELOMPOK 1 &middot; 2026'
style: |
  section {
    background-color: #ffffff;
    color: #0f172a;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: 19px;
    line-height: 1.45;
    padding: 36px 52px;
  }
  header {
    font-family: "JetBrains Mono", monospace;
    font-size: 11px;
    color: #64748b;
    letter-spacing: 1px;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 4px;
  }
  footer {
    font-family: "JetBrains Mono", monospace;
    font-size: 11px;
    color: #64748b;
    border-top: 1px solid #e2e8f0;
    padding-top: 4px;
  }
  h1 {
    font-family: "JetBrains Mono", monospace;
    font-size: 28px;
    color: #000000;
    margin: 6px 0 10px 0;
    font-weight: 800;
    letter-spacing: -0.5px;
  }
  h2 {
    font-family: "JetBrains Mono", monospace;
    font-size: 20px;
    color: #0f172a;
    margin: 4px 0 8px 0;
    font-weight: 700;
  }
  h3 {
    font-size: 15px;
    color: #64748b;
    margin: 0 0 12px 0;
    font-weight: 500;
  }
  .badge {
    display: inline-block;
    font-family: "JetBrains Mono", monospace;
    font-size: 11px;
    font-weight: 700;
    padding: 3px 9px;
    border-radius: 4px;
    background-color: #f1f5f9;
    color: #000000;
    border: 1px solid #cbd5e1;
    margin-bottom: 6px;
    letter-spacing: 0.5px;
  }
  .badge-black {
    background-color: #000000;
    color: #ffffff;
    border: 1px solid #000000;
  }
  .grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-top: 10px;
  }
  .grid-3 {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 14px;
    margin-top: 10px;
  }
  .grid-4 {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 12px;
    margin-top: 10px;
  }
  .card {
    background-color: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 12px 14px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.02);
  }
  .card-highlight {
    border-left: 4px solid #000000;
  }
  .card-subtle {
    background-color: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 12px 14px;
  }
  .stat-num {
    font-family: "JetBrains Mono", monospace;
    font-size: 28px;
    font-weight: 800;
    color: #000000;
    line-height: 1;
    margin-bottom: 4px;
  }
  .stat-label {
    font-size: 12px;
    color: #64748b;
    font-weight: 500;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13.5px;
    margin-top: 8px;
  }
  th {
    background-color: #f1f5f9;
    color: #000000;
    font-family: "JetBrains Mono", monospace;
    font-weight: 700;
    padding: 8px 10px;
    border: 1px solid #cbd5e1;
    text-align: left;
  }
  td {
    padding: 7px 10px;
    border: 1px solid #e2e8f0;
    color: #1e293b;
  }
  ul {
    margin: 4px 0;
    padding-left: 18px;
  }
  li {
    margin-bottom: 3px;
  }
  code {
    font-family: "JetBrains Mono", monospace;
    background-color: #f1f5f9;
    padding: 2px 5px;
    border-radius: 3px;
    font-size: 0.88em;
    color: #000000;
    border: 1px solid #e2e8f0;
  }
---

<!-- SLIDE 1: COVER & IDENTITAS -->
<span class="badge badge-black">[PROFIL PLATFORM SASARAN]</span>

# SISTEM LENTERA (LAB ASSET TRACKING)
### Pemaparan Platform Sasaran Pengujian Mutu Perangkat Lunak dari Perspektif Pengguna

<div class="grid-2" style="margin-top: 14px;">
  <div class="card card-highlight">
    <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #000000; font-weight: 700; margin-bottom: 4px;">TIM PENGUJI (KELOMPOK 1)</div>
    <div style="font-size: 14px; font-weight: 700; color: #000000;">Teknologi Rekayasa Multimedia &middot; Kelas TRM3A1</div>
    <div style="font-size: 12.5px; color: #475569; margin-top: 6px; line-height: 1.5;">
      &bull; <strong>Mu'adz Hudzaifah (24903460014)</strong>: Perancang Arsitektur Pengujian & Automasi<br>
      &bull; <strong>Zahraan Dzakii Ts. (24903460011)</strong>: Analis Alur Sistem & White-Box<br>
      &bull; <strong>Syifa Amelia (24903460001)</strong>: Analis Pengujian Fungsional & Advokat Pengguna
    </div>
  </div>
  <div class="card">
    <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #000000; font-weight: 700; margin-bottom: 4px;">PARAMETER PERKULIAHAN</div>
    <div style="font-size: 12.5px; line-height: 1.55; color: #334155;">
      &bull; <strong>Mata Kuliah:</strong> Pengujian Perangkat Lunak (KB260004 &middot; 2 SKS)<br>
      &bull; <strong>Dosen Pengampu:</strong> Charmiyanti Nurkentjana Aju, S.Kom., M.Kom.<br>
      &bull; <strong>Target Repositori:</strong> <code>github.com/openc-dev/lentera</code><br>
      &bull; <strong>Branch Audit Terisolasi:</strong> <code>qa/ppl-audit</code>
    </div>
  </div>
</div>

<div style="margin-top: 16px; font-size: 11.5px; font-family: 'JetBrains Mono', monospace; color: #64748b;">
  Universitas Boash &middot; Semester Ganjil 2026/2027
</div>

---

<!-- SLIDE 2: LATAR BELAKANG & DEFINISI SISTEM -->
<span class="badge">[01] PENDAHULUAN SISTEM</span>

# APA ITU PLATFORM LENTERA?
### Transformasi Otomasi Sirkulasi Alat Laboratorium Berbasis Anjungan Mandiri (Self-Service)

<div class="grid-2">
  <div class="card card-subtle">
    <div style="font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: #000000; margin-bottom: 6px;">[MASALAH] LOGBOOK MANUAL DI LAB</div>
    <ul style="font-size: 13px; color: #334155; line-height: 1.45;">
      <li>Pencatatan peminjaman masih memakai buku fisik atau form tercecer.</li>
      <li>Status ketersediaan alat tidak bisa dipantau secara real-time.</li>
      <li>Rentan manipulasi identitas (NPM fiktif atau salah catat).</li>
      <li>Laboran kesulitan melacak riwayat keterlambatan pengembalian.</li>
    </ul>
  </div>

  <div class="card card-highlight">
    <div style="font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: #000000; margin-bottom: 6px;">[SOLUSI] EKOSISTEM DIGITAL LENTERA</div>
    <ul style="font-size: 13px; color: #334155; line-height: 1.45;">
      <li><strong>Anjungan Kiosk Lab:</strong> Monitor menampilkan QR token dinamis dengan masa aktif terbatas (TTL).</li>
      <li><strong>Mobile Client Tanpa Instalasi:</strong> Mahasiswa memindai QR lewat kamera HP langsung membuka form transaksi.</li>
      <li><strong>Atomic State Machine:</strong> Status barang berubah secara deterministik (<code>available</code> &harr; <code>borrowed</code>).</li>
    </ul>
  </div>
</div>

<div class="card" style="margin-top: 14px; padding: 10px 14px;">
  <div style="font-size: 12.5px; color: #334155;">
    <strong>Tech Stack Teruji:</strong> Next.js 16 (React 19, TypeScript), Tailwind CSS v4, Supabase (PostgreSQL, Row Level Security), dan Next.js Serverless Route Handlers di Vercel Network.
  </div>
</div>

---

<!-- SLIDE 3: EKOSISTEM PENGGUNA (DUAL-ACTOR MODEL) -->
<span class="badge">[02] AKTOR PENGGUNA</span>

# DUA AKTOR UTAMA SISTEM
### Pemisahan Peran, Tanggung Jawab, dan Batas Akses dalam Operasional Harian

<div class="grid-2">
  <div class="card card-highlight">
    <div style="font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 700; color: #000000;">1. MAHASISWA / PEMINJAM (END-USER)</div>
    <div style="font-size: 12px; color: #64748b; margin-bottom: 8px;">Akses Perangkat: Smartphone via Web Browser</div>
    <ul style="font-size: 13px; line-height: 1.5; color: #1e293b;">
      <li>Memindai QR gateway aktif di layar anjungan fisik lab.</li>
      <li>Memilih tindakan transaksi: <strong>Pinjam Alat</strong> atau <strong>Kembalikan Alat</strong>.</li>
      <li>Mengisi data validitas perkuliahan (Mata Kuliah, Dosen, Estimasi Jam Selesai).</li>
      <li>Memeriksa katalog status ketersediaan alat publik sebelum ke lab.</li>
    </ul>
  </div>

  <div class="card">
    <div style="font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 700; color: #000000;">2. LABORAN / ADMIN SISTEM (OPERATOR)</div>
    <div style="font-size: 12px; color: #64748b; margin-bottom: 8px;">Akses Perangkat: Komputer Lab / Desktop Browser</div>
    <ul style="font-size: 13px; line-height: 1.5; color: #1e293b;">
      <li>Menjalankan layar kiosk daemon (<code>/display</code>) sebagai gerbang otentikasi fisik.</li>
      <li>Memantau papan monitor inventaris (alat aktif dipinjam, rusak, atau tersedia).</li>
      <li>Mengelola master data inventaris (tambah, edit kategori, cetak label barcode).</li>
      <li>Melakukan audit log riwayat transaksi jika terjadi selisih alat.</li>
    </ul>
  </div>
</div>

---

<!-- SLIDE 4: ANATOMI ANTARMUKA PENGGUNA -->
<span class="badge">[03] MODUL ANTARMUKA</span>

# ADA APA SAJA DI DALAM SISTEM?
### Empat Modul Antarmuka Utama yang Berinteraksi Langsung dengan Pengguna

<div class="grid-4">
  <div class="card">
    <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: #000000;">[MODUL 1]</div>
    <div style="font-size: 13.5px; font-weight: 700; margin: 4px 0;">Kiosk Display</div>
    <div style="font-size: 11px; color: #64748b; font-family: monospace;">Route: /display</div>
    <div style="font-size: 12px; color: #334155; margin-top: 6px; line-height: 1.4;">
      Layar publik monitor lab menampilkan QR token dinamis berotasi otomatis setiap 60 detik.
    </div>
  </div>

  <div class="card">
    <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: #000000;">[MODUL 2]</div>
    <div style="font-size: 13.5px; font-weight: 700; margin: 4px 0;">Mobile Gateway</div>
    <div style="font-size: 11px; color: #64748b; font-family: monospace;">Route: /scan</div>
    <div style="font-size: 12px; color: #334155; margin-top: 6px; line-height: 1.4;">
      Landing page paska pemindaian. Memvalidasi token sesi dan menyajikan 2 tombol opsi utama.
    </div>
  </div>

  <div class="card">
    <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: #000000;">[MODUL 3]</div>
    <div style="font-size: 13.5px; font-weight: 700; margin: 4px 0;">Formulir Interaktif</div>
    <div style="font-size: 11px; color: #64748b; font-family: monospace;">/form/borrow & return</div>
    <div style="font-size: 12px; color: #334155; margin-top: 6px; line-height: 1.4;">
      Input form data peminjam, pemilihan aset berkategori, dan verifikasi pencocokan NPM.
    </div>
  </div>

  <div class="card">
    <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: #000000;">[MODUL 4]</div>
    <div style="font-size: 13.5px; font-weight: 700; margin: 4px 0;">Katalog & Admin</div>
    <div style="font-size: 11px; color: #64748b; font-family: monospace;">/cek-alat & /admin</div>
    <div style="font-size: 12px; color: #334155; margin-top: 6px; line-height: 1.4;">
      Pencarian stok alat real-time untuk mahasiswa dan dashboard analitik lengkap untuk laboran.
    </div>
  </div>
</div>

<div class="card card-highlight" style="margin-top: 14px; padding: 10px 14px;">
  <div style="font-size: 12px; color: #1e293b;">
    <strong>Catatan Teknis:</strong> Desain antarmuka dibuat responsif dan ringan (tanpa dependensi framework berat) agar mahasiswa dengan sinyal lab minim tetap dapat memuat form dalam waktu &lt; 1.5 detik.
  </div>
</div>

---

<!-- SLIDE 5: USER JOURNEY 1 (ALUR PEMINJAMAN) -->
<span class="badge">[04] USER JOURNEY</span>

# GIMANA CARA PINJAM ALAT? (BORROW FLOW)
### Alur 4 Langkah Pengguna Mahasiswa dari Layar Fisik Lab hingga Sukses Meminjam

<div class="grid-2">
  <div>
    <div class="card card-highlight" style="margin-bottom: 10px;">
      <div style="font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700;">LANGKAH 1: PINDAI QR KIOSK LAB</div>
      <div style="font-size: 12.5px; color: #334155; margin-top: 2px;">
        Mahasiswa membuka kamera smartphone dan memindai QR code di monitor anjungan <code>/display</code>. Kamera mengarahkan browser ke <code>/scan?token=...</code>.
      </div>
    </div>
    <div class="card" style="margin-bottom: 10px;">
      <div style="font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700;">LANGKAH 2: PILIH OPSI PINJAM ALAT</div>
      <div style="font-size: 12.5px; color: #334155; margin-top: 2px;">
        Sistem memverifikasi validitas token sesi. Mahasiswa mengetuk tombol hitam kontras bertuliskan <strong>"Pinjam Alat Laboratorium"</strong>.
      </div>
    </div>
  </div>

  <div>
    <div class="card" style="margin-bottom: 10px;">
      <div style="font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700;">LANGKAH 3: ISI FORM & PILIH BARANG</div>
      <div style="font-size: 12.5px; color: #334155; margin-top: 2px;">
        Mengisi NPM (11 digit), Nama, Prodi, Mata Kuliah, Dosen, estimasi jam selesai, dan memilih aset yang berstatus <code>available</code>.
      </div>
    </div>
    <div class="card card-subtle" style="margin-bottom: 10px;">
      <div style="font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700;">LANGKAH 4: KONFIRMASI & STATUS AKTIF</div>
      <div style="font-size: 12.5px; color: #334155; margin-top: 2px;">
        Klik submit &rarr; API mengunci aset &rarr; Muncul notifikasi sukses dengan stempel waktu &rarr; Status aset di sistem langsung berubah menjadi <code>borrowed</code>.
      </div>
    </div>
  </div>
</div>

---

<!-- SLIDE 6: USER JOURNEY 2 (ALUR PENGEMBALIAN) -->
<span class="badge">[05] USER JOURNEY</span>

# GIMANA CARA KEMBALIKAN ALAT? (RETURN FLOW)
### Mekanisme Validasi Mandiri untuk Menghindari Kesalahan Identitas Pengembali

<div class="grid-2">
  <div>
    <div class="card card-highlight" style="margin-bottom: 10px;">
      <div style="font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700;">LANGKAH 1: PINDAI ULANG DI LAB</div>
      <div style="font-size: 12.5px; color: #334155; margin-top: 2px;">
        Saat praktikum selesai, mahasiswa memindai kembali monitor lab untuk membuktikan kehadiran fisik di laboratorium yang bersangkutan.
      </div>
    </div>
    <div class="card" style="margin-bottom: 10px;">
      <div style="font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700;">LANGKAH 2: PILIH OPSI PENGEMBALIAN</div>
      <div style="font-size: 12.5px; color: #334155; margin-top: 2px;">
        Mengetuk tombol <strong>"Kembalikan Alat"</strong> &rarr; Muncul daftar alat-alat yang saat itu berstatus sedang dipinjam (<code>borrowed</code>).
      </div>
    </div>
  </div>

  <div>
    <div class="card" style="margin-bottom: 10px;">
      <div style="font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700;">LANGKAH 3: INPUT VERIFIKASI NPM</div>
      <div style="font-size: 12.5px; color: #334155; margin-top: 2px;">
        Pilih alat yang dibawa &rarr; Mahasiswa wajib mengetikkan NPM peminjam asli. Sistem memvalidasi apakah NPM cocok dengan transaksi awal.
      </div>
    </div>
    <div class="card card-subtle" style="margin-bottom: 10px;">
      <div style="font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700;">LANGKAH 4: CLOSE TRANSACTION</div>
      <div style="font-size: 12.5px; color: #334155; margin-top: 2px;">
        Konfirmasi diterima &rarr; Transaksi ditutup &rarr; Aset otomatis kembali berstatus <code>available</code> dan dapat dipinjam oleh mahasiswa lain.
      </div>
    </div>
  </div>
</div>

---

<!-- SLIDE 7: PENGALAMAN PENGGUNA LABORAN -->
<span class="badge">[06] USER EXPERIENCE</span>

# DARI SUDUT PANDANG LABORAN
### Kemudahan Pengawasan, Audit Log, dan Manajemen Inventaris Secara Terpusat

<div class="grid-3">
  <div class="card">
    <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: #000000;">[FITUR 1]</div>
    <div style="font-size: 14px; font-weight: 700; margin: 4px 0;">Monitoring Real-Time</div>
    <div style="font-size: 12px; color: #475569; line-height: 1.45;">
      Laboran melihat tabel inventaris dengan badge status instan: berapa aset yang ada di rak, siapa yang membawa, dan sisa waktu peminjaman.
    </div>
  </div>

  <div class="card">
    <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: #000000;">[FITUR 2]</div>
    <div style="font-size: 14px; font-weight: 700; margin: 4px 0;">Audit Log Sirkulasi</div>
    <div style="font-size: 12px; color: #475569; line-height: 1.45;">
      Seluruh riwayat peminjaman tercatat abadi di PostgreSQL Supabase, lengkap dengan stempel waktu detik, nama peminjam, dosen, dan kondisi alat.
    </div>
  </div>

  <div class="card">
    <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: #000000;">[FITUR 3]</div>
    <div style="font-size: 14px; font-weight: 700; margin: 4px 0;">Label Barcode Generator</div>
    <div style="font-size: 12px; color: #475569; line-height: 1.45;">
      Modul cetak label fisik otomatis langsung dari dashboard untuk ditempelkan pada wadah atau fisik perangkat keras laboratorium.
    </div>
  </div>
</div>

<div class="card card-subtle" style="margin-top: 14px;">
  <div style="font-size: 12.5px; color: #1e293b;">
    <strong>Proteksi Keamanan:</strong> Rute dashboard dilindungi session token middleware. Akses konfigurasi database dan settingan lab dibatasi dengan protokol <em>Row Level Security (RLS)</em>.
  </div>
</div>

---

<!-- SLIDE 8: KENAPA LENTERA MENARIK DIUJI -->
<span class="badge badge-black">[07] JUSTIFIKASI QA</span>

# KENAPA LENTERA COCOK UNTUK PPL?
### Karakteristik Arsitektur yang Menantang dan Kaya Skenario Uji Kualitas

<table>
  <thead>
    <tr>
      <th style="width: 25%;">Karakteristik Sistem</th>
      <th style="width: 35%;">Alasan Teknis & Risiko Pengguna</th>
      <th style="width: 40%;">Metode Pengujian yang Diterapkan</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>State Machine Kritis</strong></td>
      <td>Alat tidak boleh bisa dipinjam jika statusnya belum <code>available</code>.</td>
      <td><em>State Transition Testing</em> & Boundary Value Analysis.</td>
    </tr>
    <tr>
      <td><strong>Dual-Screen Kiosk Gateway</strong></td>
      <td>QR code dinamis memiliki masa kedaluwarsa (TTL) untuk cegah remote fraud.</td>
      <td><em>Time-Skew Testing</em>, Replay Attack Simulation, Direct URL Guards.</td>
    </tr>
    <tr>
      <td><strong>Integritas Transaksi Bersamaan</strong></td>
      <td>Risiko 2 mahasiswa submit barang yang sama persis pada detik yang sama.</td>
      <td><em>Concurrency & Race Condition Testing</em> (Simultaneous API Calls).</td>
    </tr>
    <tr>
      <td><strong>Validasi Form Mahasiswa</strong></td>
      <td>Format NPM, karakter nama, dan batas waktu pengembalian wajar.</td>
      <td><em>Equivalence Partitioning</em> & BVA pada input fields.</td>
    </tr>
  </tbody>
</table>

---

<!-- SLIDE 9: PEMBAGIAN TUGAS & SPRINT ESTAFET -->
<span class="badge">[08] MANAJEMEN TIM</span>

# SUSUNAN TIM & SPRINT ESTAFET
### Alur Estafet Terstruktur Menjamin Kualitas Pengujian Tanpa Waktu Menganggur (Idle)

<div class="grid-3">
  <div class="card card-highlight">
    <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: #000000;">TAHAP 1: INISIASI (MAKS KAMIS)</div>
    <div style="font-size: 13.5px; font-weight: 700; margin: 4px 0;">Mu'adz Hudzaifah</div>
    <div style="font-size: 11.5px; color: #475569; line-height: 1.45;">
      &bull; Master Test Plan (IEEE 829)<br>
      &bull; Bedah arsitektur modul sasaran<br>
      &bull; Automasi API & skrip konkurensi<br>
      &bull; Setup isolasi branch <code>qa/ppl-audit</code>
    </div>
  </div>

  <div class="card">
    <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: #000000;">TAHAP 2: LOGIKA (MAKS SABTU)</div>
    <div style="font-size: 13.5px; font-weight: 700; margin: 4px 0;">Zahraan Dzakii Ts.</div>
    <div style="font-size: 11.5px; color: #475569; line-height: 1.45;">
      &bull; Sequence & Activity Diagram<br>
      &bull; White Box Basis Path Testing<br>
      &bull; Analisis Cyclomatic Complexity V(G)<br>
      &bull; Skema mock data & integritas DB
    </div>
  </div>

  <div class="card">
    <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: #000000;">TAHAP 3: VALIDASI (MAKS SENIN)</div>
    <div style="font-size: 13.5px; font-weight: 700; margin: 4px 0;">Syifa Amelia</div>
    <div style="font-size: 11.5px; color: #475569; line-height: 1.45;">
      &bull; Matriks Kasus Uji Black Box (BVA)<br>
      &bull; Eksekusi pengujian manual di Lentera<br>
      &bull; Pencatatan bug / defect log<br>
      &bull; User Acceptance Testing (SUS scale)
    </div>
  </div>
</div>

<div class="card" style="margin-top: 12px; padding: 10px 14px;">
  <div style="font-size: 12px; color: #334155;">
    <strong>Sinkronisasi Pra-Kelas:</strong> Setiap Selasa 08.30 WIB tim melakukan dry-run 30 menit sebelum presentasi pukul 09.00 WIB di hadapan dosen pengampu.
  </div>
</div>

---

<!-- SLIDE 10: ROADMAP PENGUJIAN 1 SEMESTER -->
<span class="badge">[09] RENCANA KERJA</span>

# MILESTONE PENGUJIAN 1 SEMESTER
### Pemetaan Materi Perkuliahan Dosen ke Deliverable Nyata Tim Penguji

<table>
  <thead>
    <tr>
      <th style="width: 15%;">Pertemuan</th>
      <th style="width: 35%;">Materi Silabus Perkuliahan</th>
      <th style="width: 50%;">Target & Deliverable Tim Penguji Lentera</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Minggu 2-3</strong></td>
      <td>Dasar Kualitas & Reverse Engineering</td>
      <td>Pemaparan Platform Lentera, Use Case & Sequence Diagram alur data.</td>
    </tr>
    <tr>
      <td><strong>Minggu 4-6</strong></td>
      <td>Testability, Environment & Test Strategy</td>
      <td>Isolasi branch <code>qa/ppl-audit</code>, Master Test Plan (IEEE 829), skenario uji.</td>
    </tr>
    <tr>
      <td><strong>Minggu 7-8</strong></td>
      <td>Bug Exploration & <strong>UTS Unit Testing</strong></td>
      <td>Eksplorasi race condition token kiosk & Unit Test fungsi validasi form.</td>
    </tr>
    <tr>
      <td><strong>Minggu 9-11</strong></td>
      <td>Integration Testing, Dokumentasi & UAT</td>
      <td>API Route Handlers testing, Traceability Matrix, UAT kuesioner SUS.</td>
    </tr>
    <tr>
      <td><strong>Minggu 12-13</strong></td>
      <td>CI Automation & <strong>UAS Audit Report</strong></td>
      <td>Automated Testing GitHub Actions & Laporan Akhir Audit Mutu ISO 29119.</td>
    </tr>
  </tbody>
</table>

---

<!-- SLIDE 11: PENUTUP & QnA -->
<span class="badge badge-black">[10] KESIMPULAN & TANYA JAWAB</span>

# TERIMA KASIH
### Kami Siap Mendiskusikan Rencana Pengujian Platform Lentera

<div class="grid-2" style="margin-top: 20px;">
  <div class="card card-highlight">
    <div style="font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: #000000; margin-bottom: 6px;">KOMITMEN KELOMPOK 1</div>
    <div style="font-size: 13px; line-height: 1.6; color: #334155;">
      Sistem Lentera dipilih karena merepresentasikan sistem riil yang memiliki tantangan konkurensi, keamanan sesi fisik, dan alur deterministik. Seluruh audit pengujian akan didokumentasikan secara ilmiah dan dapat ditelusuri.
    </div>
  </div>

  <div class="card">
    <div style="font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: #000000; margin-bottom: 6px;">ARTEFAK PENGUJIAN</div>
    <div style="font-size: 13px; line-height: 1.6; color: #334155;">
      &bull; <strong>Repositori:</strong> <code>github.com/openc-dev/lentera</code><br>
      &bull; <strong>Branch Audit:</strong> <code>qa/ppl-audit</code><br>
      &bull; <strong>Master Test Plan:</strong> <code>TEST_PLAN.md</code><br>
      &bull; <strong>Slide Presentasi:</strong> Format Marp HTML & PDF
    </div>
  </div>
</div>

<div style="margin-top: 24px; text-align: center; font-family: 'JetBrains Mono', monospace; font-size: 13px; color: #64748b;">
  Sesi Tanya Jawab Dibuka
</div>

