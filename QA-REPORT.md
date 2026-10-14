# Catatan QA — Outdoor Member Web App

Tanggal pengerjaan: 14 Oktober 2026.

## Audit proyek awal
- ZIP awal berisi React 18 + Vite 5 + CSS native dan hanya memiliki Beranda, banner, katalog unggulan, halaman laundry, navigasi, serta placeholder untuk Sewa, Aktivitas, dan Scanner.
- `src/data.js` merupakan sumber tunggal data produk dan konfigurasi bisnis; struktur produk dipertahankan.
- Scanner awal hanya berupa modal placeholder. Tidak ada modul penyewaan, kalkulasi, atau riwayat sebelumnya.

## Perubahan implementasi
- Menambahkan `src/Rent.jsx`, `src/Activity.jsx`, dan `src/rental.js`.
- Mengganti placeholder scanner dengan `src/Scanner.jsx` berbasis API browser tanpa dependensi scanner tambahan.
- Mengintegrasikan modul di `src/App.jsx`, menambahkan produk contoh dan kategori pada `src/data.js`, serta menambahkan CSS modul.
- Menulis ulang README dan menambahkan laporan QA ini.

## Pemeriksaan yang benar-benar dijalankan
- ZIP awal berhasil dibaca dan daftar berkas diperiksa.
- `npm install --no-audit --no-fund` dicoba dua kali, tetapi proses tidak selesai sebelum batas waktu.
- `npm test` dijalankan: 6/6 unit test lulus (durasi kalender, batas diskon 2 vs 3 hari, multi-produk, validasi form, dan format ringkasan WhatsApp).
- `npm run build` dicoba; gagal karena dependensi belum terpasang (`vite: not found`). Karena itu, build produksi belum terverifikasi.

## Belum dapat diklaim lolos
- Build Vite dan instalasi bersih.
- Pengujian interaktif di browser, ukuran layar 360–390 px/tablet/desktop, serta tidak adanya overflow.
- Kamera QR fisik, izin ditolak, perangkat tanpa kamera, dan kompatibilitas `BarcodeDetector`.
- Uji end-to-end pembukaan WhatsApp dan penyimpanan localStorage di browser nyata.

## Catatan fungsional untuk verifikasi lokal
- Durasi sewa menggunakan hari kalender inklusif: tanggal mulai dan tanggal selesai sama dihitung minimal satu hari.
- Lama pendakian lebih dari 2 hari memicu diskon 15% dari subtotal sewa barang.
- Nomor WhatsApp di `src/data.js` adalah nomor contoh dan wajib diganti sebelum dipakai oleh bisnis.
- Riwayat lokal bukan database dan tidak mengonfirmasi ketersediaan barang.
