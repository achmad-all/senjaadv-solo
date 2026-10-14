# Jejak Rimba Outdoor — Member Web App (MVP)

Frontend MVP berbasis React 18, Vite, JavaScript, dan CSS native. Tidak memakai backend, database, TypeScript, atau Tailwind.

## Persyaratan
- Node.js 18 atau lebih baru
- npm
- Browser modern. Scanner kamera menggunakan `getUserMedia` dan `BarcodeDetector` jika tersedia; fitur kamera umumnya perlu `localhost` atau HTTPS.

## Instalasi dan menjalankan
Ekstrak ZIP, lalu buka terminal di folder `outdoor-member`:

```bash
npm install
npm run dev
```

Buka URL lokal yang ditampilkan Vite (umumnya `http://localhost:5173`). Untuk build produksi:

```bash
npm test           # uji unit fungsi kalkulasi/validasi
npm run build
npm run preview
```

## Konfigurasi data bisnis
Edit `src/data.js` untuk mengganti nama bisnis, nomor WhatsApp, URL Instagram, produk, harga, layanan laundry, dan banner. `BUSINESS.whatsapp` saat ini berisi **nomor contoh** (`6281200000000`), bukan nomor klien. Ganti dengan nomor WhatsApp bisnis dalam format internasional tanpa tanda `+`, hanya angka. Harga dan produk katalog juga data contoh.

Produk menggunakan satu sumber data `PRODUCTS` di `src/data.js`. Kategori yang tersedia: `utama`, `tidur`, `masak`, `tektok`, `outfit`, `camp`, dan `tambahan`. Foto saat ini berupa ilustrasi SVG lokal di `public/images/`.

## Perilaku MVP dan privasi
- Pengajuan sewa dihitung di frontend dan membuka WhatsApp click-to-chat; tidak ada konfirmasi otomatis, reservasi stok, pembayaran, atau backend.
- Riwayat pengajuan demo disimpan pada `localStorage` browser. Riwayat hanya tersedia di browser dan perangkat yang sama, tidak disinkronkan ke database terpusat, dan dapat hilang saat data browser dihapus.
- Formulir tidak meminta unggahan foto dokumen identitas. Pilihan jaminan hanya dicatat dalam ringkasan pengajuan.
- Scanner QR tidak membuka URL otomatis. Pengguna perlu meninjau hasil dan menekan tombol buka; hanya URL HTTP/HTTPS yang didukung. Jika `BarcodeDetector` tidak tersedia, gunakan input manual atau browser Chromium yang mendukungnya.
- Kategori yang belum memiliki produk menampilkan empty state. Tambahkan produk pada `PRODUCTS` untuk mengisinya.

## Fitur yang tersedia
- Beranda dengan banner slider, navigasi utama, layanan laundry, dan produk unggulan.
- Katalog sewa tujuh kategori, kuantitas per produk, keranjang lintas kategori, dan ringkasan biaya.
- Formulir penyewaan dengan validasi data, pilihan minimal dua jaminan, durasi kalender inklusif, dan diskon 15% untuk lama pendakian lebih dari dua hari.
- Ringkasan pengajuan WhatsApp dan riwayat aktivitas lokal.
- Modal scanner QR dengan kontrol kamera, penanganan izin/kamera tidak tersedia, dan input manual.

## QA dan keterbatasan
Build perlu diverifikasi di lingkungan dengan akses registry npm. Dalam lingkungan pembuatan ZIP ini, `npm install` tidak selesai karena akses/unduhan dependensi tidak tersedia, sehingga `npm run build` tidak dapat dijalankan (`vite: not found`). Jangan anggap build atau kamera telah lolos uji browser. Periksa langkah QA pada catatan serah-terima yang menyertai hasil proyek.
