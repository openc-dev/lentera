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
    font-size: 13px;
    line-height: 1.45;
    padding: 38px 56px;
  }
  header {
    font-family: "JetBrains Mono", monospace;
    font-size: 14.5px;
    color: #64748b;
    letter-spacing: 1px;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 4px;
  }
  footer {
    font-family: "JetBrains Mono", monospace;
    font-size: 14.5px;
    color: #64748b;
    border-top: 1px solid #e2e8f0;
    padding-top: 4px;
  }
  h1 {
    font-family: "JetBrains Mono", monospace;
    font-size: 30px; color: #000000; margin: 6px 0 10px 0; font-weight: 800;
    letter-spacing: -0.5px;
  }
  h2 {
    font-family: "JetBrains Mono", monospace;
    font-size: 14px; color: #0f172a;
    margin: 4px 0 8px 0;
    font-weight: 700;
  }
  h3 {
    font-size: 16px; color: #64748b;
    margin: 0 0 12px 0;
    font-weight: 500;
  }
  .badge {
    display: inline-block;
    font-family: "JetBrains Mono", monospace;
    font-size: 16px;
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
    font-size: 14px;
    color: #64748b;
    font-weight: 500;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 16px;
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
<span class="badge badge-black">PROFIL PLATFORM SASARAN</span>

# LENTERA (Lending & Tracking Application)
### Pemaparan Platform Sasaran Pengujian Mutu Perangkat Lunak dari Perspektif Pengguna

<div class="grid-2" style="margin-top: 14px;">
  <div class="card card-highlight">
    <div style="font-family: 'JetBrains Mono', monospace; font-size: 16px; color: #000000; font-weight: 700; margin-bottom: 4px;"><strong>TIM PENGUJI &middot; KELOMPOK 1</strong></div>
    <div style="font-size: 16px; font-weight: 700; color: #000000;">Teknologi Rekayasa Multimedia &middot; Kelas TRM3A1</div>
    <ul style="font-size: 14px; color: #334155; margin: 6px 0 0 18px; padding: 0; line-height: 1.5;">
      <li><strong>Mu'adz Hudzaifah (24903460014)</strong>: Arsitektur Pengujian & Automasi</li>
      <li><strong>Zahraan Dzakii Ts. (24903460011)</strong>: Analis Alur Sistem & White-Box</li>
      <li><strong>Syifa Amelia (24903460001)</strong>: Pengujian Fungsional & Advokat Pengguna</li>
    </ul>
  </div>
  <div class="card">
    <div style="font-family: 'JetBrains Mono', monospace; font-size: 16px; color: #000000; font-weight: 700; margin-bottom: 4px;"><strong>PARAMETER PERKULIAHAN</strong></div>
    <ul style="font-size: 14px; color: #334155; margin: 6px 0 0 18px; padding: 0; line-height: 1.55;">
      <li><strong>Mata Kuliah:</strong> Pengujian Perangkat Lunak (2 SKS)</li>
      <li><strong>Dosen Pengampu:</strong> Charmiyanti Nurkentjana Aju, S.Kom., M.Kom.</li>
      <li><strong>Repositori Sasaran:</strong> <code>github.com/openc-dev/lentera</code></li>
      <li><strong>Branch Audit:</strong> <code>qa/ppl-audit</code></li>
    </ul>
  </div>
</div>

<div style="margin-top: 16px; font-size: 13.5px; font-family: 'JetBrains Mono', monospace; color: #64748b;">
  Universitas Boash &middot; Semester Ganjil 2026/2027
</div>

---

<!-- SLIDE 2: LATAR BELAKANG & DEFINISI SISTEM -->
<span class="badge">01 &middot; PENDAHULUAN SISTEM</span>

# APA ITU PLATFORM LENTERA?
### Transformasi Otomasi Sirkulasi Alat Laboratorium Berbasis Anjungan Mandiri (Self-Service)

<div class="grid-2">
  <div class="card card-subtle">
    <div style="font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 700; color: #000000; margin-bottom: 6px;"><strong>MASALAH &middot; LOGBOOK MANUAL DI LAB</strong></div>
    <ul style="font-size: 14.5px; color: #334155; line-height: 1.45;">
      <li>Pencatatan peminjaman masih memakai buku fisik atau form tercecer.</li>
      <li>Status ketersediaan alat tidak bisa dipantau secara real-time.</li>
      <li>Rentan manipulasi identitas (NPM fiktif atau salah catat).</li>
      <li>Laboran kesulitan melacak riwayat keterlambatan pengembalian.</li>
    </ul>
  </div>

  <div class="card card-highlight">
    <div style="font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 700; color: #000000; margin-bottom: 6px;"><strong>SOLUSI &middot; EKOSISTEM DIGITAL LENTERA</strong></div>
    <ul style="font-size: 14.5px; color: #334155; line-height: 1.45;">
      <li><strong>Anjungan Kiosk Lab:</strong> Monitor menampilkan QR token dinamis dengan masa aktif terbatas (TTL).</li>
      <li><strong>Mobile Client Tanpa Instalasi:</strong> Mahasiswa memindai QR lewat kamera HP langsung membuka form transaksi.</li>
      <li><strong>Atomic State Machine:</strong> Status barang berubah secara deterministik (<code>available</code> &harr; <code>borrowed</code>).</li>
    </ul>
  </div>
</div>

<div class="card" style="margin-top: 14px; padding: 10px 14px;">
  <div style="font-size: 14.5px; color: #334155;">
    <strong>Tech Stack Teruji:</strong> Next.js 16 (React 19, TypeScript), Tailwind CSS v4, Supabase (PostgreSQL, Row Level Security), dan Next.js Serverless Route Handlers di Vercel Network.
  </div>
</div>

---

<!-- SLIDE 3: EKOSISTEM PENGGUNA (DUAL-ACTOR MODEL) -->
<span class="badge">02 &middot; AKTOR PENGGUNA</span>

# DUA AKTOR UTAMA SISTEM
### Pemisahan Peran, Tanggung Jawab, dan Batas Akses dalam Operasional Harian

<div class="grid-2">
  <div class="card card-highlight">
    <div style="font-family: 'JetBrains Mono', monospace; font-size: 14.5px; font-weight: 700; color: #000000;">1. MAHASISWA / PEMINJAM (END-USER)</div>
    <div style="font-size: 14px; color: #64748b; margin-bottom: 8px;">Akses Perangkat: Smartphone via Web Browser</div>
    <ul style="font-size: 14.5px; line-height: 1.5; color: #1e293b;">
      <li>Memindai QR gateway aktif di layar anjungan fisik lab.</li>
      <li>Memilih tindakan transaksi: <strong>Pinjam Alat</strong> atau <strong>Kembalikan Alat</strong>.</li>
      <li>Mengisi data validitas perkuliahan (Mata Kuliah, Dosen, Estimasi Jam Selesai).</li>
      <li>Memeriksa katalog status ketersediaan alat publik sebelum ke lab.</li>
    </ul>
  </div>

  <div class="card">
    <div style="font-family: 'JetBrains Mono', monospace; font-size: 14.5px; font-weight: 700; color: #000000;">2. LABORAN / ADMIN SISTEM (OPERATOR)</div>
    <div style="font-size: 14px; color: #64748b; margin-bottom: 8px;">Akses Perangkat: Komputer Lab / Desktop Browser</div>
    <ul style="font-size: 14.5px; line-height: 1.5; color: #1e293b;">
      <li>Menjalankan layar kiosk daemon (<code>/display</code>) sebagai gerbang otentikasi fisik.</li>
      <li>Memantau papan monitor inventaris (alat aktif dipinjam, rusak, atau tersedia).</li>
      <li>Mengelola master data inventaris (tambah, edit kategori, cetak label barcode).</li>
      <li>Melakukan audit log riwayat transaksi jika terjadi selisih alat.</li>
    </ul>
  </div>
</div>

---

<!-- SLIDE 4: ANATOMI ANTARMUKA PENGGUNA -->
<span class="badge">03 &middot; MODUL ANTARMUKA</span>

# ADA APA SAJA DI DALAM SISTEM?
### Empat Modul Antarmuka Utama yang Berinteraksi Langsung dengan Pengguna

<div class="grid-4">
  <div class="card" style="padding: 12px 14px;">
    <div style="font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 700; color: #000000;"><strong>MODUL 1</strong></div>
    <div style="font-size: 14.5px; font-weight: 700; margin: 2px 0;">Kiosk Display</div>
    <div style="font-size: 12px; color: #64748b; font-family: monospace; margin-bottom: 6px;">Route: /display</div>
    <ul style="font-size: 12.5px; color: #334155; margin: 0; padding-left: 16px; line-height: 1.35;">
      <li>Layar publik monitor lab.</li>
      <li>Rotasi QR token tiap 60 detik.</li>
    </ul>
  </div>

  <div class="card" style="padding: 12px 14px;">
    <div style="font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 700; color: #000000;"><strong>MODUL 2</strong></div>
    <div style="font-size: 14.5px; font-weight: 700; margin: 2px 0;">Mobile Gateway</div>
    <div style="font-size: 12px; color: #64748b; font-family: monospace; margin-bottom: 6px;">Route: /scan</div>
    <ul style="font-size: 12.5px; color: #334155; margin: 0; padding-left: 16px; line-height: 1.35;">
      <li>Landing page scan ponsel.</li>
      <li>Verifikasi token & 2 menu utama.</li>
    </ul>
  </div>

  <div class="card" style="padding: 12px 14px;">
    <div style="font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 700; color: #000000;"><strong>MODUL 3</strong></div>
    <div style="font-size: 14.5px; font-weight: 700; margin: 2px 0;">Form Interaktif</div>
    <div style="font-size: 12px; color: #64748b; font-family: monospace; margin-bottom: 6px;">/form/borrow & return</div>
    <ul style="font-size: 12.5px; color: #334155; margin: 0; padding-left: 16px; line-height: 1.35;">
      <li>Input formulir peminjam.</li>
      <li>Validasi NPM & kunci aset.</li>
    </ul>
  </div>

  <div class="card" style="padding: 12px 14px;">
    <div style="font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 700; color: #000000;"><strong>MODUL 4</strong></div>
    <div style="font-size: 14.5px; font-weight: 700; margin: 2px 0;">Katalog & Admin</div>
    <div style="font-size: 12px; color: #64748b; font-family: monospace; margin-bottom: 6px;">/cek-alat & /admin</div>
    <ul style="font-size: 12.5px; color: #334155; margin: 0; padding-left: 16px; line-height: 1.35;">
      <li>Pencarian stok alat publik.</li>
      <li>Dashboard analitik laboran.</li>
    </ul>
  </div>
</div>



---

<!-- SLIDE 5: USER JOURNEY 1 (ALUR PEMINJAMAN) -->
<span class="badge">04 &middot; USER JOURNEY</span>

# GIMANA CARA PINJAM ALAT? (BORROW FLOW)
### Alur 4 Langkah Pengguna Mahasiswa dari Layar Fisik Lab hingga Sukses Meminjam

<div class="grid-2">
  <div>
    <div class="card card-highlight" style="margin-bottom: 12px; padding: 12px 16px;">
      <div style="font-family: 'JetBrains Mono', monospace; font-size: 13.5px; font-weight: 700; margin-bottom: 4px;"><strong>LANGKAH 1 &middot; PINDAI QR KIOSK LAB</strong></div>
      <ul style="font-size: 13.5px; color: #334155; margin: 0; padding-left: 20px; line-height: 1.4;">
        <li>Pindai kode QR berotasi pada layar anjungan fisik lab (<code>/display</code>).</li>
        <li>Browser smartphone otomatis diarahkan ke tautan sesi (<code>/scan?token=...</code>).</li>
      </ul>
    </div>
    <div class="card" style="margin-bottom: 12px; padding: 12px 16px;">
      <div style="font-family: 'JetBrains Mono', monospace; font-size: 13.5px; font-weight: 700; margin-bottom: 4px;"><strong>LANGKAH 2 &middot; PILIH OPSI PINJAM ALAT</strong></div>
      <ul style="font-size: 13.5px; color: #334155; margin: 0; padding-left: 20px; line-height: 1.4;">
        <li>Sistem memverifikasi masa aktif token sesi gerbang lab (TTL).</li>
        <li>Mahasiswa mengetuk tombol utama bertuliskan <strong>"Pinjam Alat"</strong>.</li>
      </ul>
    </div>
  </div>

  <div>
    <div class="card" style="margin-bottom: 12px; padding: 12px 16px;">
      <div style="font-family: 'JetBrains Mono', monospace; font-size: 13.5px; font-weight: 700; margin-bottom: 4px;"><strong>LANGKAH 3 &middot; ISI FORM & PILIH BARANG</strong></div>
      <ul style="font-size: 13.5px; color: #334155; margin: 0; padding-left: 20px; line-height: 1.4;">
        <li>Isi identitas: NPM (11 digit), Nama, Prodi, Mata Kuliah, dan Dosen.</li>
        <li>Pilih inventaris alat lab yang berstatus masih tersedia (<code>available</code>).</li>
      </ul>
    </div>
    <div class="card card-subtle" style="margin-bottom: 12px; padding: 12px 16px;">
      <div style="font-family: 'JetBrains Mono', monospace; font-size: 13.5px; font-weight: 700; margin-bottom: 4px;"><strong>LANGKAH 4 &middot; KONFIRMASI & STATUS AKTIF</strong></div>
      <ul style="font-size: 13.5px; color: #334155; margin: 0; padding-left: 20px; line-height: 1.4;">
        <li>Kirim formulir &rarr; API mengunci transaksi dan mencatat stempel waktu.</li>
        <li>Status alat di sistem seketika terkunci dan berubah menjadi <code>borrowed</code>.</li>
      </ul>
    </div>
  </div>
</div>

---

<!-- SLIDE 6: USER JOURNEY 2 (ALUR PENGEMBALIAN) -->
<span class="badge">05 &middot; USER JOURNEY</span>

# GIMANA CARA KEMBALIKAN ALAT? (RETURN FLOW)
### Mekanisme Validasi Mandiri untuk Menghindari Kesalahan Identitas Pengembali

<div class="grid-2">
  <div>
    <div class="card card-highlight" style="margin-bottom: 12px; padding: 12px 16px;">
      <div style="font-family: 'JetBrains Mono', monospace; font-size: 13.5px; font-weight: 700; margin-bottom: 4px;"><strong>LANGKAH 1 &middot; PINDAI ULANG DI LAB</strong></div>
      <ul style="font-size: 13.5px; color: #334155; margin: 0; padding-left: 20px; line-height: 1.4;">
        <li>Mahasiswa memindai kembali monitor lab paska praktikum selesai.</li>
        <li>Membuktikan kehadiran fisik mahasiswa di ruang laboratorium.</li>
      </ul>
    </div>
    <div class="card" style="margin-bottom: 12px; padding: 12px 16px;">
      <div style="font-family: 'JetBrains Mono', monospace; font-size: 13.5px; font-weight: 700; margin-bottom: 4px;"><strong>LANGKAH 2 &middot; PILIH OPSI PENGEMBALIAN</strong></div>
      <ul style="font-size: 13.5px; color: #334155; margin: 0; padding-left: 20px; line-height: 1.4;">
        <li>Mengetuk tombol menu <strong>"Kembalikan Alat"</strong>.</li>
        <li>Sistem menampilkan daftar seluruh alat yang sedang aktif dipinjam.</li>
      </ul>
    </div>
  </div>

  <div>
    <div class="card" style="margin-bottom: 12px; padding: 12px 16px;">
      <div style="font-family: 'JetBrains Mono', monospace; font-size: 13.5px; font-weight: 700; margin-bottom: 4px;"><strong>LANGKAH 3 &middot; INPUT VERIFIKASI NPM</strong></div>
      <ul style="font-size: 13.5px; color: #334155; margin: 0; padding-left: 20px; line-height: 1.4;">
        <li>Pilih aset yang dikembalikan dan ketikkan 11 digit NPM peminjam.</li>
        <li>Sistem mencocokkan identitas dengan data transaksi awal secara ketat.</li>
      </ul>
    </div>
    <div class="card card-subtle" style="margin-bottom: 12px; padding: 12px 16px;">
      <div style="font-family: 'JetBrains Mono', monospace; font-size: 13.5px; font-weight: 700; margin-bottom: 4px;"><strong>LANGKAH 4 &middot; CLOSE TRANSACTION</strong></div>
      <ul style="font-size: 13.5px; color: #334155; margin: 0; padding-left: 20px; line-height: 1.4;">
        <li>Transaksi peminjaman ditutup dan waktu kembali aktual tercatat.</li>
        <li>Status aset otomatis pulih menjadi <code>available</code> untuk sesi berikutnya.</li>
      </ul>
    </div>
  </div>
</div>

---

<!-- SLIDE 7: PENGALAMAN PENGGUNA LABORAN -->
<span class="badge">06 &middot; USER EXPERIENCE</span>

# DARI SUDUT PANDANG LABORAN
### Kemudahan Pengawasan, Audit Log, dan Manajemen Inventaris Secara Terpusat

<div class="grid-3">
  <div class="card">
    <div style="font-family: 'JetBrains Mono', monospace; font-size: 14.5px; font-weight: 700; color: #000000;"><strong>FITUR 1</strong></div>
    <div style="font-size: 15px; font-weight: 700; margin: 2px 0 6px 0;">Monitoring Real-Time</div>
    <ul style="font-size: 13px; color: #475569; margin: 0; padding-left: 18px; line-height: 1.45;">
      <li>Pantau status aset di rak secara langsung (tersedia / dipinjam / rusak).</li>
      <li>Lacak identitas mahasiswa peminjam dan estimasi jam selesai praktikum.</li>
    </ul>
  </div>

  <div class="card">
    <div style="font-family: 'JetBrains Mono', monospace; font-size: 14.5px; font-weight: 700; color: #000000;"><strong>FITUR 2</strong></div>
    <div style="font-size: 15px; font-weight: 700; margin: 2px 0 6px 0;">Audit Log Sirkulasi</div>
    <ul style="font-size: 13px; color: #475569; margin: 0; padding-left: 18px; line-height: 1.45;">
      <li>Riwayat transaksi tersimpan abadi di Supabase PostgreSQL.</li>
      <li>Mencakup stempel waktu detik, nama dosen pengampu, dan kondisi alat.</li>
    </ul>
  </div>

  <div class="card">
    <div style="font-family: 'JetBrains Mono', monospace; font-size: 14.5px; font-weight: 700; color: #000000;"><strong>FITUR 3</strong></div>
    <div style="font-size: 15px; font-weight: 700; margin: 2px 0 6px 0;">Label Barcode Generator</div>
    <ul style="font-size: 13px; color: #475569; margin: 0; padding-left: 18px; line-height: 1.45;">
      <li>Modul cetak label barcode fisik otomatis dari dashboard lab.</li>
      <li>Ditempelkan pada wadah atau fisik perangkat keras laboratorium.</li>
    </ul>
  </div>
</div>

<div class="card card-subtle" style="margin-top: 14px;">
  <div style="font-size: 14.5px; color: #1e293b;">
    <strong>Proteksi Keamanan:</strong> Rute dashboard dilindungi session token middleware. Akses konfigurasi database dan settingan lab dibatasi dengan protokol <em>Row Level Security (RLS)</em>.
  </div>
</div>

---

<!-- SLIDE 8: KENAPA LENTERA MENARIK DIUJI -->
<span class="badge badge-black">07 &middot; JUSTIFIKASI QA</span>

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
<span class="badge">08 &middot; MANAJEMEN TIM</span>

# SUSUNAN TIM & SPRINT ESTAFET
### Alur Estafet Terstruktur Menjamin Kualitas Pengujian Tanpa Waktu Menganggur (Idle)

<div class="grid-3">
  <div class="card card-highlight">
    <div style="font-family: 'JetBrains Mono', monospace; font-size: 16px; font-weight: 700; color: #000000;"><strong>TAHAP 1 &middot; ARSITEKTUR & INISIASI</strong></div>
    <div style="font-size: 15.5px; font-weight: 700; margin: 4px 0;">Mu'adz Hudzaifah</div>
    <ul style="font-size: 13.5px; color: #334155; margin: 4px 0 0 16px; padding: 0; line-height: 1.45;">
      <li>Master Test Plan (IEEE 829)</li>
      <li>Bedah arsitektur modul sasaran</li>
      <li>Automasi API & skrip konkurensi</li>
      <li>Setup branch <code>qa/ppl-audit</code></li>
    </ul>
  </div>

  <div class="card">
    <div style="font-family: 'JetBrains Mono', monospace; font-size: 16px; font-weight: 700; color: #000000;"><strong>TAHAP 2 &middot; ANALISIS & LOGIKA</strong></div>
    <div style="font-size: 15.5px; font-weight: 700; margin: 4px 0;">Zahraan Dzakii Ts.</div>
    <ul style="font-size: 13.5px; color: #334155; margin: 4px 0 0 16px; padding: 0; line-height: 1.45;">
      <li>Sequence & Activity Diagram</li>
      <li>White Box Basis Path Testing</li>
      <li>Analisis Cyclomatic Complexity V(G)</li>
      <li>Skema mock data & integritas DB</li>
    </ul>
  </div>

  <div class="card">
    <div style="font-family: 'JetBrains Mono', monospace; font-size: 16px; font-weight: 700; color: #000000;"><strong>TAHAP 3 &middot; VALIDASI & EKSEKUSI</strong></div>
    <div style="font-size: 15.5px; font-weight: 700; margin: 4px 0;">Syifa Amelia</div>
    <ul style="font-size: 13.5px; color: #334155; margin: 4px 0 0 16px; padding: 0; line-height: 1.45;">
      <li>Matriks Kasus Uji Black Box (BVA)</li>
      <li>Eksekusi pengujian manual antarmuka</li>
      <li>Pencatatan tiket bug di GitHub Issues</li>
      <li>User Acceptance Testing (SUS scale)</li>
    </ul>
  </div>
</div>



---

<!-- SLIDE 10: ROADMAP PENGUJIAN 1 SEMESTER -->
<span class="badge">09 &middot; RENCANA KERJA</span>

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
<span class="badge badge-black">SESI TANYA JAWAB</span>

# TERIMA KASIH

<div style="margin-top: 48px; font-size: 18px; color: #475569; line-height: 1.6;">
  Sesi tanya jawab dibuka untuk evaluasi dan diskusi rencana pengujian sistem Lentera.
</div>

