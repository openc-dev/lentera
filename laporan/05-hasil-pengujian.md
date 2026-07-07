## Hasil Implementasi

Setelah melalui tahap analisis, perancangan, dan pengembangan, sistem LENTERA berhasil diimplementasikan sebagai aplikasi web fungsional yang terdiri dari 42 fitur. Implementasi mencakup 9 halaman frontend, 19 endpoint API, dan 5 tabel database yang saling terintegrasi.

Halaman frontend yang berhasil dibangun meliputi halaman Login, Dashboard Admin, halaman Manajemen Aset, halaman Manajemen Kategori, halaman Pengaturan, halaman Generate QR, halaman Cetak Label, halaman Peminjaman, dan halaman Informasi Aset Publik.

Admin dashboard menyediakan fitur CRUD aset dan kategori, manajemen QR (generate dan validasi), serta pengaturan sistem. Sisi mahasiswa menyediakan alur peminjaman dan pengembalian melalui scan QR yang cepat dan intuitif. Sistem juga mendukung tema gelap/terang (dark/light mode), desain responsif untuk perangkat seluler, cetak label QR, dan ekspor data ke format CSV.

## Pengujian Fungsional (Black Box Testing)

Pengujian fungsional dilakukan menggunakan metode black box testing untuk memastikan setiap fitur berjalan sesuai dengan spesifikasi yang diharapkan. Pengujian mencakup modul login, manajemen aset, manajemen kategori, sudo mode, QR generation dan validation, peminjaman, pengembalian, cetak label, ekspor CSV, dashboard, dark mode, dan logout.

| Modul | Skenario | Input | Hasil Diharapkan | Hasil |
| --- | --- | --- | --- | --- |
| Login | Login dengan kredensial benar | email: [boashadmin@kampus.ac.id](mailto:boashadmin@kampus.ac.id), password: 12345678 | Redirect ke dashboard | Berhasil |
| Login | Login dengan password salah | password: wrongpassword | Toast error "Kredensial salah" | Berhasil |
| Login | Login dengan email tidak terdaftar | email: [x@y.com](mailto:x@y.com) | Toast error "Kredensial salah" | Berhasil |
| Tambah Aset | Tambah aset baru | kategori: Proyektor, kode: INV-01, nama: Epson EB-X51 | Aset tersimpan, muncul di tabel | Berhasil |
| Tambah Aset | Tambah aset dengan kode duplikat | kode: INV-01 | Toast error, aset tidak tersimpan | Berhasil |
| Edit Aset | Edit aset tanpa sudo session | Edit nama aset | Modal sudo muncul | Berhasil |
| Edit Aset | Edit aset setelah sudo | Password benar, ubah nama | Aset terupdate | Berhasil |
| Edit Aset | Edit aset yang sedang dipinjam | Edit nama INV-01 (status borrowed) | Toast error "Aset sedang dipinjam" | Berhasil |
| Hapus Aset | Hapus aset yang dipinjam | Hapus aset status borrowed | Diblokir dengan peringatan | Berhasil |
| Tambah Kategori | Tambah kategori baru | nama: Proyektor | Kategori tersimpan | Berhasil |
| Sudo Mode | Aktivasi sudo dengan password benar | Password admin | Sudo token terbit (10 menit) | Berhasil |
| Sudo Mode | Aktivasi sudo dengan password salah | Password salah | Toast error "Password salah!" | Berhasil |
| QR Generate | Generate QR dari halaman display | Admin login, buka /display | QR muncul dengan UUID token | Berhasil |
| QR Validate | Validasi QR token valid | Token valid | Submission token terbit | Berhasil |
| QR Validate | Validasi QR token expired | Token expired/random | 403 "Barcode kadaluarsa" | Berhasil |
| Peminjaman | Pinjam alat tersedia | Isi lengkap, submit | Transaksi tercatat, status berubah | Berhasil |
| Peminjaman | Pinjam alat tanpa submission_token | Langsung akses /form/borrow | Error "Akses ditolak" | Berhasil |
| Peminjaman | Pinjam alat sudah dipinjam orang lain | Asset status borrowed | Error tidak bisa pinjam | Berhasil |
| Pengembalian | Kembalikan alat dengan NPM benar | NPM sesuai peminjam | Return sukses, status available | Berhasil |
| Pengembalian | Kembalikan alat dengan NPM salah | NPM berbeda | 403 dengan hint NPM asli | Berhasil |
| Pengembalian | Kembalikan alat tidak dipinjam | Asset status available | Error | Berhasil |
| Cetak Label | Buka halaman print labels | Admin login | Grid QR code muncul | Berhasil |
| Export CSV | Export data aset | Klik Export CSV | File CSV terdownload | Berhasil |
| Dashboard | Auto-refresh data | Tunggu 30 detik | Data ter-refresh | Berhasil |
| Dark Mode | Toggle theme | Klik icon moon/sun | Theme berubah, persist di localStorage | Berhasil |
| Logout | Logout dari dashboard | Klik logout, konfirmasi | Redirect ke login, token dihapus | Berhasil |

## Pengujian Keamanan

Pengujian keamanan dilakukan untuk memverifikasi bahwa mekanisme keamanan yang diterapkan pada sistem berfungsi dengan baik. Hasil pengujian menunjukkan bahwa seluruh skenario keamanan berhasil diatasi oleh sistem.

| Skenario | Hasil |
| --- | --- |
| Akses /admin/dashboard tanpa login | Redirect ke / |
| Akses API protected tanpa Bearer token | 401 Unauthorized |
| Reuse submission_token setelah transaksi | 403 Sesi habis |
| Akses form tanpa submission_token | Error validasi |
| HTTP request dari origin tidak terdaftar | Diblokir CORS |
| Return alat dengan NPM berbeda | Ditolak dengan hint |
| Edit aset yang sedang dipinjam | Diblokir |
| Concurrent borrow pada aset sama | Locking mencegah duplikasi |

## Pembahasan

Berdasarkan hasil pengujian yang telah dilakukan, seluruh fitur sistem berjalan sesuai dengan spesifikasi yang diharapkan. Mekanisme keamanan yang diterapkan efektif dalam mencegah akses tidak sah, termasuk perlindungan terhadap endpoint API menggunakan Bearer token, pembatasan akses halaman admin, serta validasi origin melalui CORS.

Sistem QR Gateway dengan arsitektur dua lapis token (QR token dan submission token) berhasil memberikan pengalaman pengguna yang lancar. Mahasiswa cukup memindai QR Code yang tersedia di laboratorium untuk memulai proses peminjaman tanpa perlu registrasi atau login terlebih dahulu. Token bersifat *single-use* dan memiliki masa berlaku terbatas, sehingga serangan *replay* dapat dicegah secara efektif.

Verifikasi NPM pada proses pengembalian berhasil mencegah pengembalian alat oleh pihak yang tidak berwenang. Sistem memberikan petunjuk NPM yang benar apabila terjadi kesalahan input, sehingga mahasiswa yang sah tetap dapat melakukan pengembalian tanpa kesulitan.

Fitur auto-refresh pada dashboard setiap 30 detik memungkinkan admin memantau status aset secara *real-time*. Fitur ekspor CSV juga memudahkan pembuatan laporan aset untuk keperluan inventarisasi.

Secara keseluruhan, sistem LENTERA berhasil mendigitalisasi proses peminjaman aset laboratorium yang sebelumnya dilakukan secara manual menggunakan buku catatan menjadi sistem digital yang *real-time*, terstruktur, dan mudah diakses dari perangkat seluler mahasiswa.