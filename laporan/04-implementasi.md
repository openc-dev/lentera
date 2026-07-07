Bab ini membahas implementasi sistem LENTERA (Lending & Tracking Application) yang meliputi lingkungan pengembangan, implementasi frontend, implementasi backend, dan implementasi keamanan.

## Lingkungan Pengembangan

Lingkungan pengembangan LENTERA dibangun di atas sistem operasi Arch Linux. Frontend dikembangkan menggunakan Next.js 16.2.4 dengan React 19.2.4 dan TypeScript 5 sebagai bahasa pemrograman utama. Komponen antarmuka menggunakan Tailwind CSS 4 untuk styling, Axios 1.15.2 untuk komunikasi HTTP, dan qrcode.react 4.2.0 untuk rendering QR Code. Backend dibangun menggunakan Laravel 13 dengan PHP 8.5.6 dan Laravel Sanctum untuk autentikasi berbasis token. Basis data menggunakan MariaDB 12.2.2. Proses pengembangan menggunakan Turbopack sebagai bundler untuk Next.js dan Vite untuk aset Laravel, dengan Git sebagai version control. Untuk keperluan demo melalui perangkat seluler, jaringan lokal dihubungkan menggunakan Tailscale.

## Implementasi Frontend

### Struktur Proyek Frontend

Proyek frontend LENTERA menggunakan App Router convention dari Next.js 16, di mana setiap direktori di dalam direktori `app/` merepresentasikan sebuah route. Struktur direktori utama adalah sebagai berikut:

```
lentera-frontend/
  app/
    page.tsx              # Login page (/)
    layout.tsx            # Root layout
    globals.css           # Global styles
    display/page.tsx      # QR kiosk display (/display)
    scan/page.tsx         # QR scan gateway (/scan)
    cek-alat/page.tsx     # Asset info lookup (/cek-alat)
    admin/
      dashboard/page.tsx  # Admin dashboard (/admin/dashboard)
      settings/page.tsx   # Settings page (/admin/settings)
      print-labels/page.tsx # Print labels (/admin/print-labels)
    form/
      borrow/page.tsx     # Borrow form (/form/borrow)
      return/page.tsx     # Return form (/form/return)
  components/
    ui/Button.tsx, Card.tsx, Input.tsx, Modal.tsx, Toast.tsx, Badge.tsx, Skeleton.tsx, DonutChart.tsx
    ClientProviders.tsx, ProtectedRoute.tsx, ThemeInit.tsx
  lib/
    api.ts                # Axios instance with interceptors
    useKeyboardShortcuts.ts
```

Konvensi App Router memungkinkan pembuatan halaman melalui berkas `page.tsx` dan layout melalui berkas `layout.tsx` di setiap direktori. Komponen reusable ditempatkan di direktori `components/ui/` sedangkan logika bisnis seperti instance Axios dan custom hooks disimpan di direktori `lib/`.

### Halaman Login

Halaman login merupakan halaman utama aplikasi yang diakses melalui route `/`. Form login terdiri dari dua input teks untuk email dan password yang dikelola menggunakan state React dengan hook `useState`. Saat pengguna menekan tombol submit, fungsi `handleSubmit` akan mengirimkan permintaan POST ke endpoint `/api/login` melalui Axios. Jika respons berhasil, token autentikasi disimpan ke dalam `localStorage` untuk digunakan pada permintaan selanjutnya. Notifikasi keberhasilan atau kegagalan ditampilkan menggunakan komponen Toast. Setelah login berhasil, pengguna secara otomatis diarahkan ke halaman `/admin/dashboard`.

\begin{figure}[H]
\centering
\includegraphics[width=\textwidth]{gambar/form-login.png}
\caption{Halaman Login Admin}
\label{fig:login}
\end{figure}

### Halaman Display (Kiosk QR)

Halaman display berfungsi sebagai kiosk yang menampilkan QR Code untuk dipindai oleh pengguna. Halaman ini merupakan halaman terautentikasi yang memanggil endpoint `GET /api/gateway/generate` untuk memperoleh token QR. Pembaruan QR Code dilakukan secara otomatis setiap 60 detik menggunakan `setInterval`. QR Code dirender menggunakan komponen `QRCodeCanvas` dari pustaka qrcode.react dengan ukuran 350 piksel dan tingkat koreksi error H (tertinggi). Tersedia pula tautan mode pengembangan untuk pengujian tanpa proses pemindaian QR.

\begin{figure}[H]
\centering
\includegraphics[width=\textwidth]{gambar/display-qrcode.png}
\caption{Halaman Display QR Code Kiosk}
\label{fig:display}
\end{figure}

### Halaman Scan Gateway

Halaman scan berfungsi sebagai pintu masuk setelah pengguna memindai QR Code. Token yang dibawa dari hasil pemindaian dibaca melalui parameter URL menggunakan hook `useSearchParams`. Halaman ini memanggil endpoint `GET /api/gateway/validate` untuk memvalidasi token QR. Jika validasi berhasil, ditampilkan dua tombol utama yaitu "Pinjam Alat" dan "Kembalikan Alat". Jika validasi gagal, ditampilkan kartu error yang berisi pesan kesalahan dan tombol "Scan Ulang" untuk kembali ke proses pemindaian.

\begin{figure}[H]
\centering
\includegraphics[width=\textwidth]{gambar/scan-gateway.png}
\caption{Halaman Scan Gateway}
\label{fig:scan-gateway}
\end{figure}

### Halaman Peminjaman (Borrow Form)

Halaman peminjaman alat menampilkan formulir dengan sepuluh input yang harus diisi oleh pengguna. Data aset yang tersedia diambil melalui endpoint `GET /api/assets/form-options`. Kategori aset juga diambil untuk menyediakan filter dropdown yang memudahkan pencarian. Setiap input dilengkapi dengan validasi sisi klien. Saat formulir disubmit, data dikirimkan ke endpoint `POST /api/borrow`. Setelah peminjaman berhasil dicatat, pengguna diarahkan ke halaman `/cek-alat` untuk melihat informasi aset yang baru dipinjam.

\begin{figure}[H]
\centering
\includegraphics[width=\textwidth]{gambar/form-peminjaman.png}
\caption{Formulir Peminjaman Aset}
\label{fig:borrow}
\end{figure}

### Halaman Pengembalian (Return Form)

Halaman pengembalian alat menampilkan daftar aset yang sedang dipinjam, diambil melalui endpoint `GET /api/assets/form-options?status=borrowed`. Fitur keamanan utama pada halaman ini adalah input Nomor Pokok Mahasiswa (NPM) yang digunakan untuk verifikasi identitas pengembali. NPM yang dimasukkan dicocokkan dengan data peminjaman aktif. Setelah verifikasi berhasil, formulir disubmit ke endpoint `POST /api/return`. Notifikasi keberhasilan ditampilkan menggunakan komponen Toast.

\begin{figure}[H]
\centering
\includegraphics[width=\textwidth]{gambar/form-pengembalian.png}
\caption{Formulir Pengembalian Aset}
\label{fig:return}
\end{figure}

### Halaman Dashboard Admin

Dashboard admin merupakan halaman utama pengelolaan sistem yang dilindungi oleh komponen `ProtectedRoute`. Komponen ini memeriksa keberadaan token di `localStorage` sebelum menampilkan konten. Dashboard menampilkan empat kartu statistik yang menunjukkan jumlah total aset, aset tersedia, aset dipinjam, dan aset dalam perawatan. Tabel aset menampilkan data lengkap dengan badge status berwarna. Navigasi kategori disediakan dalam bentuk navbar horizontal yang mendukung operasi CRUD. Pencarian aset dapat dilakukan melalui pintasan keyboard Ctrl+K. Operasi CRUD menggunakan modal dengan perlindungan sudo pada operasi sensitif seperti edit dan hapus. Fitur unduh QR dan ekspor CSV tersedia untuk kebutuhan pencetakan label. Data dashboard diperbarui secara otomatis setiap 30 detik. Tema gelap dan terang dapat diubah melalui tombol toggle.

\begin{figure}[H]
\centering
\includegraphics[width=\textwidth]{gambar/dashboard-admin.png}
\caption{Dashboard Admin}
\label{fig:dashboard}
\end{figure}

### Halaman Cek Alat (Public)

Halaman cek alat merupakan halaman publik yang dapat diakses tanpa autentikasi. Pengguna dapat mencari aset berdasarkan kode uniknya atau menjelajahi seluruh katalog dengan filter kategori. Setiap aset menampilkan informasi detail termasuk nama, kategori, status, dan lokasi penyimpanan. Jika aset sedang dipinjam, ditampilkan informasi peminjam berupa nama dan NPM. Halaman ini memudahkan mahasiswa dan laboran untuk memeriksa status suatu alat secara mandiri tanpa perlu login.

\begin{figure}[H]
\centering
\includegraphics[width=\textwidth]{gambar/halaman-cek-alat.png}
\caption{Halaman Cek Alat Publik}
\label{fig:cek-alat}
\end{figure}

### Halaman Cetak Label QR

Halaman cetak label QR menampilkan seluruh aset dalam bentuk grid kartu yang masing-masing berisi kode QR unik, kode aset, dan nama aset. Halaman ini dirancang khusus untuk keperluan pencetakan stiker label yang akan ditempelkan pada setiap aset laboratorium. Setiap kartu QR dapat diunduh secara individual atau seluruhnya dalam satu proses batch.

\begin{figure}[H]
\centering
\includegraphics[width=\textwidth]{gambar/print-qrcode-label.png}
\caption{Halaman Cetak Label QR}
\label{fig:print-label}
\end{figure}

### Komponen UI

LENTERA menggunakan delapan komponen UI reusable. Button memiliki enam varian (primary, secondary, danger, ghost, outline, link) dan tiga ukuran (sm, md, lg) serta mendukung state loading. Card menyediakan efek glow dan hover. Input mendukung ikon dan menampilkan state error. Modal memiliki tiga ukuran (sm, md, lg) untuk berbagai kebutuhan. Toast menggunakan context-based pattern dengan empat tipe (success, error, warning, info) dan auto-dismiss. Badge menggunakan kode warna untuk merepresentasikan status aset. Skeleton menampilkan animasi loading saat data belum tersedia. DonutChart dirender menggunakan Canvas API untuk visualisasi statistik.

## Implementasi Backend

### Struktur Proyek Backend

Proyek backend LENTERA menggunakan arsitektur MVC Laravel dengan struktur direktor sebagai berikut:

```
lentera-backend/
  routes/api.php           # 19 API endpoints
  app/Http/Controllers/Api/
    AuthController.php     # Login/Logout
    GatewayController.php  # QR token generate/validate
    TransactionController.php # Borrow/Return
    AssetController.php    # Asset CRUD + form options
    CategoryController.php # Category CRUD
    AdminController.php    # Sudo + settings
  app/Models/
    User.php, Asset.php, Category.php, Transaction.php, Setting.php
  database/migrations/     # 8 migration files
  database/seeders/        # UserSeeder + SettingSeeder
```

Terdapat enam controller API, lima model Eloquent, delapan file migrasi, dan dua seeder untuk data awal.

### API Endpoints

LENTERA menyediakan 19 endpoint API yang dikelompokkan berdasarkan fungsionalitas sebagai berikut:

| Method | Endpoint | Auth | Controller |
| --- | --- | --- | --- |
| POST | /api/login | Public | AuthController@login |
| POST | /api/logout | Sanctum | AuthController@logout |
| GET | /api/gateway/generate | Sanctum | GatewayController@generateToken |
| GET | /api/gateway/validate | Public | GatewayController@validateToken |
| POST | /api/borrow | Public | TransactionController@borrow |
| POST | /api/return | Public | TransactionController@returnAsset |
| GET | /api/assets | Public | AssetController@index |
| GET | /api/assets/scan/{code} | Public | AssetController@scanByCode |
| GET | /api/assets/form-options | Public | AssetController@getFormOptions |
| POST | /api/assets | Sanctum | AssetController@store |
| PUT | /api/assets/{id} | Sanctum+Sudo | AssetController@update |
| DELETE | /api/assets/{id} | Sanctum+Sudo | AssetController@destroy |
| PUT | /api/assets/{id}/status | Sanctum+Sudo | AssetController@updateStatus |
| GET | /api/categories | Public | CategoryController@index |
| POST | /api/categories | Sanctum | CategoryController@store |
| PUT | /api/categories/{id} | Sanctum+Sudo | CategoryController@update |
| DELETE | /api/categories/{id} | Sanctum+Sudo | CategoryController@destroy |
| POST | /api/admin/sudo | Sanctum | AdminController@verifySudo |
| PUT | /api/admin/settings | Sanctum+Sudo | AdminController@updateSettings |

### AuthController

`AuthController` menangani proses autentikasi pengguna. Metode `login` menerima email dan password dari request, memvalidasi input, dan mencari pengguna di basis data. Password diverifikasi menggunakan fungsi `Hash::check` yang membandingkan input dengan hash bcrypt yang tersimpan. Jika valid, token Sanctum baru dibuat dan dikembalikan sebagai respons. Metode `logout` menghapus token yang sedang digunakan, sehingga sesi pengguna berakhir.

### GatewayController

`GatewayController` mengelola siklus hidup token gateway dua lapis. Metode `generateToken` menghasilkan UUID unik, menyimpannya ke dalam cache dengan TTL yang ditentukan oleh pengaturan `qr_interval`, dan mengembalikan UUID tersebut. Metode `validateToken` memeriksa keberadaan UUID di cache. Jika valid, metode ini menghasilkan `submission_token` UUID baru yang disimpan di cache dengan TTL dari pengaturan `form_interval`. Token QR yang sudah divalidasi dihapus dari cache untuk mencegah penggunaan ulang.

### TransactionController

`TransactionController` menangani proses peminjaman dan pengembalian aset. Metode `borrow` menerima `submission_token` beserta data peminjaman. Token divalidasi dan dikonsumsi (dihapus dari cache) untuk memastikan penggunaannya bersifat one-time. Transaksi basis data menggunakan fitur `lockForUpdate` untuk pessimistic locking guna mencegah kondisi balapan. Data transaksi baru dibuat, status aset diperbarui menjadi "dipinjam", dan respons dikembalikan. Metode `returnAsset` memvalidasi token, mencari transaksi aktif untuk aset yang dimaksud, memverifikasi NPM pengembali, memperbarui kolom `returned_at`, mengubah status aset kembali menjadi "tersedia", dan mengonsumsi token.

### AssetController

`AssetController` mengelola data aset laboratorium. Operasi CRUD standar mencakup index, store, update, dan destroy. Operasi update dan destroy memerlukan autentikasi Sanctum dan verifikasi sudo. Metode `getFormOptions` mengembalikan data aset yang difilter berdasarkan status, digunakan untuk mengisi formulir peminjaman dan pengembalian. Metode `scanByCode` mencari aset berdasarkan kode unik dan mengembalikan informasi detail termasuk status peminjaman terkini. Sistem mencegah pengeditan atau penghapusan aset yang sedang dipinjam untuk menjaga integritas data.

### AdminController

`AdminController` menangani fitur administratif tingkat lanjut. Metode `verifySudo` memverifikasi password administrator saat ini. Jika password cocok, token sudo UUID dihasilkan dan disimpan dalam cache dengan TTL 10 menit. Token ini diperlukan untuk operasi sensitif seperti edit dan hapus aset, serta perubahan pengaturan. Metode `updateSettings` memperbarui konfigurasi sistem seperti interval QR dan interval formulir, dengan syarat token sudo yang valid.

## Implementasi Keamanan

LENTERA menerapkan sepuluh lapisan keamanan untuk melindungi integritas data dan mencegah penyalahgunaan sistem. Pertama, autentikasi menggunakan Sanctum Bearer token yang dikirimkan pada setiap permintaan ke endpoint terproteksi. Kedua, sistem token dua lapis memisahkan token gateway (untuk memulai sesi) dari token submission (untuk mengirimkan data), sehingga pemindaian QR tidak langsung memberikan akses penuh. Ketiga, token submission bersifat one-time dan langsung dikonsumsi setelah digunakan untuk mencegah serangan replay. Keempat, sudo mode melindungi operasi sensitif dengan token tambahan yang memiliki masa berlaku 10 menit. Kelima, verifikasi NPM pada pengembalian aset dilengkapi dengan petunjuk NPM yang disamarkan untuk membantu pengguna mengingat nomor mereka. Keenam, pessimistic locking menggunakan `lockForUpdate` mencegah kondisi balanen pada operasi peminjaman konkuren. Ketujuh, validasi input dilakukan di sisi server menggunakan Laravel Validation. Kedelapan, perlindungan CORS membatasi akses dari origin yang tidak diizinkan. Kesembilan, pemeriksaan integritas aset mencegah pengeditan atau penghapusan aset yang sedang dalam status dipinjam. Kesepuluh, seluruh token memiliki masa berlaku terbatas yaitu QR token 1 menit, submission token 15 menit, dan sudo token 10 menit.

\begin{figure}[H]
\centering
\includegraphics[width=\textwidth]{gambar/setting-sudo-interval.png}
\caption{Halaman Pengaturan Sistem dengan Modal Sudo}
\label{fig:settings}
\end{figure}