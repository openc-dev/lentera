## Analisis Kebutuhan

Analisis kebutuhan merupakan tahap awal dalam pengembangan sistem LENTERA yang bertujuan untuk mengidentifikasi seluruh kebutuhan yang harus dipenuhi oleh sistem. Kebutuhan ini dikelompokkan menjadi dua kategori, yaitu kebutuhan fungsional dan kebutuhan non-fungsional.

### Kebutuhan Fungsional

Kebutuhan fungsional mendefinisikan fitur-fitur spesifik yang harus dimiliki oleh sistem. Berdasarkan hasil analisis terhadap proses peminjaman alat laboratorium yang berjalan di Fakultas Sains dan Teknologi UIN SGD Bandung, diidentifikasi sebanyak 42 fitur yang dikelompokkan ke dalam beberapa modul.

Modul Autentikasi dan Keamanan mencakup fitur login dan logout admin menggunakan email dan kata sandi yang terintegrasi dengan Laravel Sanctum Bearer token. Sistem menerapkan sudo mode yang mewajibkan re-autentikasi untuk operasi sensitif seperti edit dan hapus aset atau perubahan pengaturan sistem. Terdapat pula sistem token dua lapis yang terdiri dari QR token dan submission token, serta verifikasi NPM untuk proses pengembalian alat guna memastikan bahwa hanya peminjam asli yang dapat mengembalikan alat.

Modul QR Code Gateway menyediakan halaman display kiosk yang menampilkan QR code dinamis dengan pembaruan otomatis setiap enam puluh detik. QR token dibangkitkan menggunakan UUID dan disimpan di cache dengan Time-To-Live (TTL) yang dapat dikonfigurasi. Validasi QR token dilakukan melalui endpoint publik yang mengeluarkan submission token setelah validasi berhasil.

Modul Peminjaman Aset menyediakan formulir peminjaman dengan sepuluh field yang mencakup pemilihan aset, identitas mahasiswa, informasi mata kuliah, serta tanggal dan jam pengembalian. Sistem menerapkan validasi sisi server dengan pessimistic locking pada tingkat basis data untuk mencegah kondisi balapan. Submission token bersifat one-time use dan langsung dikonsumsi setelah transaksi berhasil.

Modul Pengembalian Aset menyediakan formulir pengembalian dengan pemilihan aset dan verifikasi NPM. Sistem memastikan bahwa hanya peminjam asli yang dapat melakukan pengembalian, dan status aset akan diperbarui secara otomatis menjadi tersedia.

Modul Manajemen Admin mencakup operasi CRUD untuk aset dan kategori yang dilindungi sudo mode. Admin dapat mengubah status aset antara tersedia dan perbaikan, mencari aset berdasarkan kode atau nama, memfilter berdasarkan kategori, menyalin kode aset ke papan klip, mengekspor data CSV, mengunduh QR code individual atau massal, serta mencetak label QR yang siap tempel.

Modul Fitur Publik menyediakan pencarian informasi aset berdasarkan kode yang dapat diakses dari QR statis yang ditempel pada alat, serta katalog aset lengkap dengan filter kategori dan tampilan status. Sementara itu, Modul UI/UX mencakup tema gelap dan terang yang disimpan di localStorage, pintasan keyboard seperti Ctrl+K untuk pencarian, Escape untuk menutup modal, dan Ctrl+L untuk logout, notifikasi toast, skeleton loading, serta dasbor yang diperbarui otomatis setiap tiga puluh detik.

### Kebutuhan Non-Fungsional

Kebutuhan non-fungsional mendefinisikan atribut kualitas yang harus dimiliki oleh sistem. Sistem LENTERA dirancang dengan antarmuka pengguna responsif modern yang dapat diakses dengan baik melalui peramban ponsel tanpa memerlukan aplikasi native. Dari segi keamanan, sistem menerapkan perlindungan berlapis yang meliputi sistem token multi-lapis, perlindungan CORS, serta penguncian basis data pada tingkat baris untuk mencegah konflik data. Arsitektur sistem bersifat stateless sehingga mendukung penskalaan horizontal dan dapat dijalankan dengan Laravel Octane untuk kebutuhan produksi dengan lalu lintas tinggi. Performa sistem dioptimalkan dengan server-side rendering untuk memuat halaman awal dengan cepat, sementara interaksi selanjutnya berjalan secara dinamis melalui API.

## Perancangan Sistem

Perancangan sistem merupakan tahap yang menerjemahkan kebutuhan yang telah dianalisis menjadi representasi teknis yang akan menjadi panduan dalam implementasi. Perancangan mencakup arsitektur sistem, diagram use case, ERD, flowchart QR Gateway, serta sequence diagram peminjaman.

### Arsitektur Sistem

Sistem LENTERA menerapkan arsitektur berbasis RESTful API yang memisahkan frontend dan backend secara tegas. Arsitektur ini dipilih untuk memberikan fleksibilitas dalam pengembangan dan memudahkan penskalaan sistem di masa mendatang.

```
+--------------+    Axios HTTP    +--------------+    Eloquent    +-------------+
|  Frontend    | ---------------->|  Backend API | ------------>|  Database    |
|  Next.js 16  | <----------------|  Laravel 13  | <------------|  MariaDB     |
|  :3000       |    JSON Response |  :8000        |               |              |
+--------------+                  +--------------+               +-------------+
```

Frontend dibangun menggunakan Next.js 16 dan berperan sebagai single-page application yang menyajikan antarmuka pengguna. Seluruh komunikasi antara frontend dan backend dilakukan melalui permintaan HTTP yang difasilitasi oleh Axios, di mana data dikirim dan diterima dalam format JSON. Backend yang dibangun dengan Laravel 11 menangani seluruh logika bisnis, autentikasi, dan manajemen data. Backend berinteraksi dengan basis data MariaDB melalui Eloquent ORM untuk memastikan integritas referensial dan kemudahan dalam pengelolaan data.

### Use Case Diagram

Diagram use case menggambarkan interaksi antara aktor dengan sistem LENTERA. Terdapat dua aktor yang berinteraksi dengan sistem, yaitu Admin dan Mahasiswa.

Admin sebagai pengelola sistem memiliki hak akses penuh terhadap seluruh fitur. Admin dapat melakukan login dan logout, mengelola data aset dan kategori dengan operasi CRUD, mengelola pengaturan sistem, membangkitkan QR token, melihat dasbor, mengekspor data CSV, mencetak label QR, serta mengaktifkan sudo mode untuk operasi sensitif.

Mahasiswa sebagai pengguna layanan peminjaman dapat memindai QR code yang ditampilkan pada layar kiosk atau QR statis yang ditempel pada alat. Setelah memindai QR code, mahasiswa dapat mengakses formulir peminjaman untuk meminjam alat, formulir pengembalian untuk mengembalikan alat, atau melihat informasi aset berdasarkan kode alat yang tertera pada QR statis.

### Entity Relationship Diagram (ERD)

Perancangan basis data sistem LENTERA terdiri dari lima tabel utama yang saling berelasi untuk menjaga integritas data.

Tabel `users` menyimpan data admin dengan kolom id sebagai primary key, name, email yang bersifat unik, password yang telah di-hash, serta timestamps. Tabel `categories` menyimpan kategori aset dengan kolom id sebagai primary key dan name yang unik. Relasi satu kategori terhubung dengan banyak aset.

Tabel `assets` menyimpan data aset laboratorium dengan kolom id sebagai primary key, category_id sebagai foreign key yang merujuk ke tabel categories, name, code yang bersifat unik, serta status yang merupakan enum dengan nilai available, borrowed, dan maintenance. Satu aset dapat terlibat dalam banyak transaksi dan berada dalam satu kategori.

Tabel `transactions` menyimpan seluruh riwayat peminjaman dengan kolom id sebagai primary key, asset_id sebagai foreign key ke tabel assets, student_name, student_npm, student_prodi, student_class, subject, lecturer, borrowed_at, expected_return_at, dan returned_at yang bersifat nullable. Tabel `settings` menyimpan konfigurasi sistem dengan kolom key yang unik dan value. Tabel `personal_access_tokens` mengikuti skema standar Laravel Sanctum untuk autentikasi Bearer token.

### Flowchart QR Gateway

Alur QR Gateway merupakan mekanisme inti yang menghubungkan antara QR code yang dipindai mahasiswa dengan proses peminjaman atau pengembalian aset. Mekanisme ini menggunakan sistem token dua lapis untuk menjaga keamanan transaksi.

Tahap pertama dimulai ketika admin yang telah terautentikasi membuka halaman display. Frontend mengirimkan permintaan GET ke endpoint `/api/gateway/generate`. Backend kemudian membangkitkan UUID sebagai gateway token dan menyimpannya di cache dengan TTL sesuai konfigurasi `qr_interval`. QR code ditampilkan pada halaman display dengan URL yang mengarah ke `{frontend_url}/scan?token={gateway_token}`.

Tahap kedua terjadi ketika mahasiswa memindai QR code dari ponsel dan membuka halaman scan. Halaman scan memanggil endpoint `/api/gateway/validate?token={gateway_token}` yang bersifat publik. Backend memeriksa cache, dan jika token valid, backend membangkitkan submission token dengan TIL sesuai konfigurasi `form_interval`. Mahasiswa kemudian melihat dua tombol, yaitu Pinjam Alat dan Kembalikan Alat.

Tahap ketiga, mahasiswa memilih salah satu opsi dan diarahkan ke halaman formulir dengan submission token sebagai parameter query. Seluruh panggilan API pada formulir memerlukan submission token untuk otorisasi. Setelah transaksi peminjaman atau pengembalian berhasil, submission token dihapus dari cache sehingga tidak dapat digunakan kembali.

### Sequence Diagram: Peminjaman

Proses peminjaman aset melibatkan interaksi berurutan antara mahasiswa, halaman scan, formulir peminjaman, backend, cache, dan basis data. Berikut adalah langkah-langkah detail dalam skenario peminjaman yang berhasil.

Mahasiswa memulai proses dengan memindai QR code yang ditampilkan pada layar kiosk. Halaman scan yang terbuka mengirimkan gateway token ke backend melalui endpoint validasi. Backend memeriksa keberadaan gateway token di cache dan, jika valid, membangkitkan submission token yang dikembalikan ke halaman scan. Halaman scan kemudian menampilkan tombol pinjam dan kembali kepada mahasiswa.

Mahasiswa memilih tombol Pinjam Alat dan diarahkan ke formulir peminjaman yang telah menyertakan submission token. Setelah mengisi identitas dan detail aset, mahasiswa mengirimkan formulir ke backend melalui POST `/borrow` dengan menyertakan submission token. Backend memvalidasi submission token di cache dan memastikan token belum pernah digunakan sebelumnya.

Backend memulai transaksi basis data dan mengunci baris aset yang dipilih menggunakan mekanisme `lockForUpdate` untuk mencegah peminjaman ganda secara bersamaan. Setelah kunci diperoleh, backend menyimpan data transaksi ke tabel transactions dan memperbarui status aset menjadi borrowed. Submission token kemudian dihapus dari cache sebagai konsumsi one-time use. Response berhasil dikembalikan ke frontend, dan mahasiswa diarahkan ke halaman pengecekan alat yang menampilkan kode aset yang baru saja dipinjam.
