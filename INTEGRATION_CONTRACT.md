# Catatan integrasi

Dokumen kontrak tahap integrasi awal telah digantikan oleh implementasi berikut:

- `src/Rent.jsx`: katalog sewa, kuantitas, formulir, validasi, ringkasan harga, dan pengajuan WhatsApp.
- `src/Activity.jsx`: riwayat pengajuan dari localStorage.
- `src/Scanner.jsx`: scanner QR browser dan input manual.
- `src/rental.js`: kalkulasi harga, durasi, validasi, penyimpanan riwayat, dan pembentukan pesan.

Kontrak data katalog tetap menggunakan `PRODUCTS` dari `src/data.js` dengan field `{ id, name, description, pricePerDay, image, category }`. Tidak ada backend atau database. Lihat `README.md` dan `QA-REPORT.md` untuk menjalankan proyek dan keterbatasan yang diketahui.
