- List item

## Latar Belakang

Peminjaman aset laboratorium merupakan kegiatan operasional yang sangat penting di lingkungan perguruan tinggi, khususnya pada laboratorium komputer, laboratorium sains, dan bengkel teknik. Selama ini, sebagian besar institusi masih mengandalkan sistem pencatatan manual menggunakan buku log peminjaman (*logbook*) untuk mencatat setiap transaksi peminjaman dan pengembalian barang. Pendekatan konvensional ini menghadirkan sejumlah permasalahan serius yang berdampak langsung pada efektivitas pengelolaan aset laboratorium.\

Permasalahan pertama adalah ketidakakuratan data dan rawan kesalahan pencatatan (*human error*). Mahasiswa sering kali lupa mencatat, mengisi data tidak lengkap, atau bahkan menulis secara tidak terbaca di buku log. Kedua, buku log fisik sangat mudah hilang, rusak, atau halaman tertentu sobek, sehingga menyebabkan hilangnya riwayat peminjaman secara permanen. Ketiga, pihak laboratorium mengalami kesulitan dalam melacak siapa yang sedang meminjam barang tertentu, kapan barang tersebut harus dikembalikan, dan di mana barang tersebut berada. Situasi ini membuka celah terjadinya pencurian aset (*asset theft*) karena tidak ada pengawasan secara *real-time* terhadap status setiap barang. Keempat, tidak adanya informasi status peminjaman secara langsung membuat mahasiswa harus datang ke laboratorium hanya untuk menanyakan ketersediaan alat, yang sangat tidak efisien.\

Perkembangan teknologi *QR Code* (Quick Response Code) menawarkan solusi yang tepat untuk mengatasi permasalahan tersebut. QR Code dapat dipindai menggunakan kamera ponsel pintar yang sudah dimiliki oleh hampir seluruh mahasiswa, tanpa memerlukan perangkat keras khusus seperti pemindai barcode (*barcode scanner*). Proses pemindaian hanya membutuhkan waktu kurang dari satu detik, sehingga sangat cepat dan praktis. Dengan menempelkan stiker QR Code pada setiap aset laboratorium, proses identifikasi barang dapat dilakukan secara instan melalui gawai masing-masing mahasiswa.\

Berdasarkan permasalahan di atas, dibangunlah **LENTERA** (*Lending & Tracking Application*), yaitu sistem informasi peminjaman dan pengembalian aset laboratorium berbasis QR Code yang diakses melalui web. Sistem ini menggunakan tumpukan teknologi modern berupa **Next.js 16** sebagai *frontend framework* yang menyediakan pengalaman antarmuka yang responsif dan cepat, **Laravel 13** sebagai *backend framework* yang menyediakan RESTful API yang aman dan terstruktur, **MariaDB** sebagai basis data relasional untuk menyimpan seluruh data transaksi dan aset, **Tailwind CSS** untuk merancang antarmuka pengguna yang bersih dan konsisten, serta **Laravel Sanctum** sebagai mekanisme autentikasi berbasis *token* yang ringan namun aman. Dengan kombinasi teknologi ini, LENTERA diharapkan mampu menjadi solusi yang komprehensif, aman, dan mudah digunakan oleh seluruh pemangku kepentingan di laboratorium.

## Rumusan Masalah

Berdasarkan latar belakang yang telah diuraikan, rumusan masalah dalam penelitian ini adalah sebagai berikut:\

1. Bagaimana merancang dan membangun sistem peminjaman dan pengembalian aset laboratorium berbasis QR Code yang dapat menggantikan pencatatan manual menggunakan buku log?\
2. Bagaimana mengimplementasikan sistem keamanan multi-lapis menggunakan *gateway token* dan *submission token* untuk memastikan bahwa hanya pengguna yang telah terautentikasi yang dapat mengakses dan melakukan transaksi peminjaman?\
3. Bagaimana menyediakan informasi status ketersediaan aset secara *real-time* kepada admin laboratorium sehingga proses monitoring dapat dilakukan secara langsung tanpa harus melakukan pengecekan fisik?\
4. Bagaimana merancang antarmuka sistem yang responsif dan ringan sehingga mahasiswa dapat melakukan peminjaman aset melalui ponsel pintar tanpa perlu menginstal aplikasi tambahan?\
5. Bagaimana mencegah terjadinya pengembalian aset oleh pihak yang tidak berwenang melalui mekanisme verifikasi NPM (Nomor Pokok Mahasiswa) pada saat transaksi pengembalian?\
6. Bagaimana menangani kondisi *race condition* yang mungkin terjadi ketika dua orang atau lebih mencoba meminjam aset yang sama dalam waktu yang bersamaan?

## Tujuan

Adapun tujuan dari penelitian dan pengembangan sistem LENTERA adalah sebagai berikut:\

1. Merancang dan membangun sistem informasi peminjaman dan pengembalian aset laboratorium berbasis QR Code yang terintegrasi dengan basis data untuk menggantikan pencatatan manual, sehingga seluruh riwayat transaksi tersimpan secara digital dan dapat diakses kapan saja.\
2. Mengimplementasikan mekanisme autentikasi multi-token dengan Laravel Sanctum yang terdiri dari *gateway token* untuk mengamankan akses masuk ke sistem dan *submission token* untuk mengamankan setiap transaksi peminjaman, sehingga data dan aset terlindungi dari akses yang tidak sah.\
3. Menyediakan dasbor *real-time* bagi admin yang menampilkan status seluruh aset laboratorium, riwayat peminjaman, notifikasi pengembalian, serta informasi peminjam secara lengkap dan terkini.\
4. Mengembangkan antarmuka pengguna berbasis web yang responsif dan *mobile-friendly* menggunakan Next.js dan Tailwind CSS, sehingga mahasiswa dapat melakukan transaksi peminjaman cukup melalui peramban ponsel pintar tanpa perlu menginstal aplikasi.\
5. Menerapkan mekanisme verifikasi identitas peminjam pada saat pengembalian aset dengan mencocokkan NPM, serta mengimplementasikan sistem penguncian transaksi (*locking mechanism*) untuk mencegah *race condition* pada saat peminjaman aset yang sama secara bersamaan.

## Manfaat

Penelitian dan pengembangan sistem LENTERA diharapkan dapat memberikan manfaat bagi berbagai pihak yang terkait dengan pengelolaan aset laboratorium.\

Bagi laboratorium dan institusi, sistem ini menyediakan sistem pencatatan digital yang terpusat sehingga seluruh data peminjaman tersimpan dengan rapi, aman, dan mudah ditelusuri kembali. Pihak laboratorium dapat memonitor status aset secara *real-time* tanpa harus melakukan pengecekan fisik, serta dapat mengekspor data laporan peminjaman dalam berbagai format untuk keperluan audit, akreditasi, dan evaluasi penggunaan aset secara periodik. Hal ini secara langsung meningkatkan akuntabilitas dan transparansi pengelolaan aset institusi.\

Bagi mahasiswa, sistem LENTERA memberikan kemudahan dalam melakukan peminjaman aset secara mandiri (*self-service borrowing*). Mahasiswa cukup memindai kode QR yang ditempel pada aset menggunakan ponsel pintar mereka, dan sistem akan secara otomatis mencatat data peminjam berdasarkan akun yang telah terautentikasi. Proses yang cepat dan tanpa antrean ini menghemat waktu mahasiswa dan menghilangkan kebutuhan untuk mengisi formulir manual atau menunggu petugas laboratorium.\

Bagi admin laboratorium, sistem ini menyediakan dasbor manajemen yang efisien dan informatif. Admin dapat melihat daftar seluruh aset, status peminjaman, riwayat transaksi, dan data peminjam dalam satu tampilan terpadu. Dasbor dilengkapi dengan fitur pembaruan otomatis (*auto-refresh*) sehingga admin selalu mendapatkan informasi terkini tanpa perlu memuat ulang halaman secara manual. Selain itu, admin dapat dengan mudah menambahkan aset baru, mencetak label QR, dan mengelola data pengguna melalui antarmuka yang intuitif.\

Bagi institusi secara keseluruhan, penerapan sistem LENTERA mendukung terciptanya tata kelola aset yang profesional dan modern. Setiap aset dapat ditempeli stiker QR Code yang berfungsi sebagai identitas digital unik, sehingga pelacakan aset menjadi lebih mudah. Sistem ini juga menghasilkan data historis peminjaman yang lengkap dan dapat dianalisis untuk pengambilan keputusan strategis, seperti evaluasi kebutuhan pengadaan alat baru atau identifikasi aset yang jarang digunakan. Dengan demikian, LENTERA tidak hanya menyelesaikan permasalahan operasional sehari-hari, tetapi juga berkontribusi pada peningkatan kualitas manajemen laboratorium secara berkelanjutan.