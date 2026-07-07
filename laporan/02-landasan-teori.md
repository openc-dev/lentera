---

## bab: 2
judul: Landasan Teori

## QR Code (Quick Response Code)

*QR Code* (Quick Response Code) pertama kali dikembangkan pada tahun 1994 oleh Denso Wave, anak perusahaan Toyota, sebagai solusi pelacakan komponen kendaraan yang memerlukan pemindaian cepat dan kapasitas penyimpanan lebih besar dibandingkan *barcode* konvensional. Tidak seperti *barcode* linear yang hanya menyimpan data secara horizontal, QR Code menyimpan data dalam dua dimensi sehingga mampu menampung hingga 7.089 karakter numerik atau 4.296 karakter alfanumerik.

Struktur QR Code terdiri atas beberapa elemen penting: *finder pattern* (pola di tiga sudut untuk deteksi orientasi), *timing pattern* (untuk menentukan ukuran modul), *data area* (tempat data dan *error correction* disimpan), serta *format information*. QR Code mendukung empat tingkat *error correction* — L (7%), M (15%), Q (25%), dan H (30%) — yang memungkinkan kode tetap terbaca meskipun sebagian rusak atau tertutup.

Keunggulan QR Code meliputi kapasitas penyimpanan tinggi, pemindaian cepat dari berbagai sudut (360°), dan kemampuan *error correction* yang andal. LENTERA memanfaatkan QR Code karena beberapa alasan strategis: tidak memerlukan aplikasi khusus (cukup kamera *smartphone* bawaan), biaya cetak murah, dan dapat dipindai dalam kondisi pencahayaan minim. Implementasi menggunakan *library* `qrcode.react` yang merender QR Code sebagai komponen React dengan dukungan berbagai tingkat *error correction*.

## Next.js

Next.js adalah kerangka kerja React sumber terbuka yang dikembangkan oleh Vercel untuk membangun aplikasi web dengan kemampuan *server-side rendering* (SSR), *static site generation* (SSG), dan API *routes*. LENTERA menggunakan Next.js versi 16 yang menghadirkan fitur-fitur modern seperti App Router sebagai sistem routing berbasis *file system*.

App Router di Next.js 16 memperkenalkan arsitektur Server dan Client Components. Server Components merender konten di sisi server, mengurangi *bundle size* yang dikirim ke klien dan meningkatkan performa halaman awal. Client Components tetap berjalan di peramban untuk menangani interaktivitas. LENTERA memanfaatkan pendekatan hibrida ini: halaman *dashboard* dan *kiosk* menggunakan Server Components untuk data awal, sementara formulir peminjaman dan komponen interaktif menggunakan Client Components.

Next.js dipilih karena beberapa pertimbangan: siklus pengembangan cepat berkat *hot module replacement* dan Turbopack sebagai *bundler* generasi baru, API Routes untuk menangani *endpoint* internal tanpa server terpisah, serta dukungan penuh terhadap TypeScript dan *layout* bersarang yang memudahkan pengelolaan antarmuka LENTERA.

## React

React adalah *library* JavaScript sumber terbuka yang dikembangkan oleh Meta untuk membangun antarmuka pengguna berbasis komponen. React mengadopsi arsitektur komponen — setiap bagian antarmuka dienkapsulasi dalam komponen mandiri yang dapat dikomposisi ulang membentuk halaman utuh.

Manajemen status dalam React dikelola menggunakan Hooks seperti `useState` untuk status lokal, `useEffect` untuk *side effect*, `useCallback` untuk memoization fungsi, dan `useMemo` untuk memoisasi nilai komputasi berat. LENTERA menggunakan `useState` pada formulir peminjaman, `useEffect` untuk pemindaian QR Code secara periodik di halaman *kiosk*, serta `useCallback` dan `useMemo` untuk mengoptimalkan render ulang komponen daftar barang.

Integrasi TypeScript memberikan *type safety* pada setiap komponen dan *prop* yang dilewatkan, mengurangi potensi *bug* akibat kesalahan tipe data. Seluruh komponen LENTERA didefinisikan dengan antarmuka TypeScript yang ketat, memastikan setiap properti yang diterima komponen memiliki tipe yang jelas dan terdokumentasi.

## Tailwind CSS

Tailwind CSS adalah kerangka kerja CSS berbasis *utility-first* yang menyediakan kelas-kelas atomik untuk membangun antarmuka tanpa menulis CSS kustom. Berbeda dengan pendekatan CSS tradisional yang memisahkan gaya dari markup, Tailwind CSS memungkinkan penulisan gaya secara *inline* menggunakan kelas-kelas utilitas seperti `flex`, `grid`, `p-4`, atau `text-lg`.

LENTERA memanfaatkan Tailwind CSS untuk mendukung tema gelap dan terang (*dark/light mode*) melalui CSS *variables* yang didefinisikan dalam konfigurasi `:root` dan `.dark`. Setiap komponen merespons perubahan tema secara otomatis tanpa memerlukan logika tambahan. Pendekatan *responsive design* menggunakan *breakpoint* `sm`, `md`, `lg`, dan `xl` memastikan antarmuka LENTERA beradaptasi dengan baik di berbagai perangkat — dari ponsel mahasiswa hingga layar besar *kiosk display* di laboratorium.

## Laravel

Laravel adalah kerangka kerja PHP sumber terbuka yang mengadopsi arsitektur MVC (*Model-View-Controller*) untuk pengembangan aplikasi web. LENTERA menggunakan Laravel versi 13 sebagai API *backend* yang menyediakan layanan RESTful bagi aplikasi Next.js.

Eloquent ORM (*Object-Relational Mapping*) memungkinkan interaksi dengan basis data MariaDB menggunakan sintaks yang ekspresif dan aman dari serangan SQL *injection*. LENTERA mendefinisikan model seperti `Asset`, `Category`, `Transaction`, `User`, dan `Setting` yang saling terhubung melalui relasi Eloquent. Migrasi digunakan untuk mengelola skema basis data secara *versioned*, sementara *seeder* memudahkan pengisian data awal untuk pengembangan dan pengujian.

Laravel menyediakan sistem validasi *request* dan *middleware pipeline* yang menjadi tulang punggung keamanan LENTERA. Validasi *request* memeriksa setiap masukan dari klien sebelum diproses, sementara *middleware* seperti `auth:sanctum` memastikan hanya pengguna terautentikasi yang dapat mengakses *endpoint* tertentu.

## Laravel Sanctum

Laravel Sanctum adalah paket autentikasi ringan untuk API berbasis Laravel yang mendukung dua mekanisme: autentikasi SPA (*Single Page Application*) menggunakan *cookie session* dan autentikasi berbasis *token*. Sanctum menyimpan token API dalam tabel basis data dan menghubungkannya dengan model pengguna melalui relasi *hasMany*.

LENTERA menggunakan Sanctum dalam mode *token-based authentication*. Setiap admin yang masuk ke sistem menerima *Bearer token* yang dikirimkan melalui *header* `Authorization` pada setiap permintaan HTTP ke API. Token ini disimpan di sisi klien (dalam *memory* aplikasi Next.js) dan kedaluwarsa sesuai konfigurasi.

Pemilihan Sanctum didasarkan pada kesederhanaan implementasi, integrasi erat dengan ekosistem Laravel, serta kemampuan membatasi kemampuan token (*token abilities*) — misalnya, token admin dapat memiliki kemampuan untuk membuat atau menghapus data, sementara token yang digunakan untuk pemindaian QR memiliki kemampuan terbatas.

## MariaDB

MariaDB adalah sistem manajemen basis data relasional (RDBMS) sumber terbuka yang dikembangkan sebagai cabang (*fork*) dari MySQL. MariaDB menawarkan performa tinggi, kepatuhan terhadap prinsip ACID (*Atomicity, Consistency, Isolation, Durability*), dan kompatibilitas penuh dengan ekosistem Laravel melalui konektor bawaan.

LENTERA memilih MariaDB karena sifatnya yang sumber terbuka tanpa biaya lisensi, performa yang setara atau melebihi MySQL, serta dukungan penuh terhadap fitur-fitur basis data modern seperti *Common Table Expressions* (CTE), *window functions*, dan *storage engine* InnoDB yang mendukung *transactional locking*.

Dalam sistem LENTERA, penguncian basis data (*pessimistic locking*) menggunakan metode `lockForUpdate` pada Eloquent diterapkan saat pemrosesan peminjaman barang. Mekanisme ini mencegah kondisi balapan (*race condition*) ketika dua mahasiswa mencoba meminjam barang yang sama secara bersamaan — transaksi pertama akan memperoleh kunci, sementara transaksi lain harus menunggu hingga transaksi pertama selesai, menjamin integritas data inventaris laboratorium.

## Gateway Token System

*Gateway Token System* adalah arsitektur keamanan dua lapis yang dirancang khusus untuk LENTERA guna mengamankan proses peminjaman berbasis pemindaian QR Code. Sistem ini terdiri atas dua jenis token dengan masa berlaku dan fungsi yang berbeda.

*QR token* adalah token berusia pendek (*short-lived*, 5 menit) yang dihasilkan oleh admin yang telah terautentikasi dan ditampilkan pada perangkat *kiosk* dalam bentuk QR Code. Token ini hanya menandakan bahwa sesi peminjaman sedang aktif di suatu lokasi. *Submission token* adalah token berusia menengah (*medium-lived*, 15 menit) yang hanya dapat digunakan satu kali (*single-use*) dan dihasilkan saat mahasiswa memindai QR Code. Token inilah yang digunakan untuk mengirimkan data peminjaman ke API.

Siklus hidup token meliputi empat tahap: pembangkitan (*generate*) → penyimpanan dalam *cache* → validasi saat permintaan masuk → pemusnahan (*consume*) setelah digunakan. Arsitektur ini memberikan beberapa manfaat keamanan: mencegah serangan *replay* karena token hanya valid sekali pakai, membatasi durasi sesi formulir, dan memastikan bahwa hanya pemindaian dari *kiosk* resmi yang dapat memulai proses peminjaman. Dengan demikian, sistem ini secara efektif menghubungkan sesi autentikasi admin di *kiosk* dengan formulir peminjaman yang diakses mahasiswa melalui perangkat pribadi.