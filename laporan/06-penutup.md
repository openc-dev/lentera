## Kesimpulan

Berdasarkan hasil perancangan, implementasi, dan pengujian sistem LENTERA, dapat ditarik kesimpulan sebagai berikut:

1. LENTERA berhasil dibangun sebagai sistem peminjaman aset laboratorium berbasis QR Code dengan 42 fitur yang mencakup manajemen aset, peminjaman mandiri oleh mahasiswa, dan dashboard admin *real-time*.

2. Sistem QR Gateway dengan arsitektur dua lapis token (QR token dan submission token) berhasil mengamankan proses otentikasi mahasiswa dengan mencegah serangan *replay* dan pemakaian token berulang.

3. Fitur sudo mode memberikan lapisan keamanan tambahan untuk operasi sensitif seperti edit, hapus, dan pengaturan sistem.

4. Verifikasi NPM pada proses pengembalian berhasil mencegah pengembalian alat oleh pihak yang tidak berwenang.

5. Sistem berhasil mendigitalisasi proses peminjaman yang sebelumnya manual (buku catatan) menjadi sistem digital yang *real-time*, terstruktur, dan mudah diakses dari *smartphone*.

6. Dashboard admin dengan *auto-refresh* 30 detik dan fitur export CSV memudahkan monitoring dan pelaporan aset laboratorium.

## Saran

Untuk pengembangan sistem LENTERA lebih lanjut, berikut beberapa saran yang dapat dipertimbangkan:

1. Penggunaan Laravel Octane atau FrankenPHP pada *production* agar performa lebih optimal, mengingat PHP *built-in server* memiliki keterbatasan *single-thread*.

2. Implementasi Redis sebagai *cache driver* untuk meningkatkan kecepatan akses token dan mengurangi beban *database*.

3. Penambahan halaman riwayat transaksi untuk melihat histori peminjaman dan pengembalian aset secara lengkap.

4. Implementasi notifikasi (Email/WhatsApp) sebagai pengingat pengembalian alat yang mendekati jatuh tempo.

5. Penambahan *pagination* pada tabel aset di dashboard untuk mendukung pengelolaan ribuan aset.

6. Implementasi *role-based access control* (super admin, operator) untuk fleksibilitas pengelolaan sistem.

7. Integrasi dengan sistem SSO kampus untuk autentikasi mahasiswa yang lebih terpadu.

8. Penambahan fitur ekspor PDF untuk pembuatan laporan periodik.

## Penutup

Puji syukur ke hadirat Tuhan Yang Maha Esa atas berkat dan rahmat-Nya sehingga penelitian dan pengembangan sistem LENTERA dapat diselesaikan dengan baik. Penulis mengucapkan terima kasih kepada semua pihak yang telah memberikan dukungan, bimbingan, dan bantuan selama proses penyusunan laporan ini. Penulis menyadari bahwa sistem dan laporan ini masih memiliki kekurangan, oleh karena itu kritik dan saran yang membangun sangat diharapkan untuk pengembangan selanjutnya. Semoga sistem LENTERA dapat memberikan manfaat bagi institusi dalam meningkatkan efisiensi dan efektivitas pengelolaan peminjaman aset laboratorium.
