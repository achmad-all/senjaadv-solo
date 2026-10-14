// ============================================================
// SATU-SATUNYA tempat konfigurasi bisnis & data contoh.
// Ganti isi file ini saat client menyerahkan data asli.
// ============================================================

export const BUSINESS = {
  name: 'Jejak Rimba Outdoor',          // CONTOH
  tagline: 'Sewa, laundry, dan bucket bunga',
  whatsapp: '+62 896 2681 1959',            // CONTOH: format internasional tanpa + (62...)
  instagramUrl: 'https://instagram.com/senjaadv_solo?srtk=MTFjZGJudG9wZ3VzOQ%3D%3D', // CONTOH: ganti dengan URL akun Instagram asli
}

// Satu sumber data produk. Modul lain WAJIB memakai bentuk data ini.
// { id, name, description, pricePerDay (angka, Rupiah), image (path di /public), category }
export const PRODUCTS = [
  { id:'mandala-6-pro', name:'Mandala 6 Pro', category:'camp', pricePerDay:80000, description:'Tenda kapasitas besar untuk kegiatan berkemah.', image:'/images/mandala_6pro.jpg' },
  { id:'tenda-2p-basic-pollux', name:'Tenda 2P Basic Pollux', category:'camp', pricePerDay:35000, description:'Tenda ringkas untuk dua orang.', image:'/images/compas_2.jpg' },
  { id:'tenda-4p-borneo', name:'Tenda 4P Borneo', category:'camp', pricePerDay:40000, description:'Tenda untuk kegiatan berkemah bersama.', image:'/images/tendaki_4.jpg' },
  { id:'tenda-6p-borneo', name:'Tenda 6P Borneo', category:'camp', pricePerDay:80000, description:'Tenda berkapasitas enam orang.', image:'/images/borneo_6.jpg' },

  { id:'matras', name:'Matras', category:'tidur', pricePerDay:5000, description:'Alas tidur ringan untuk kegiatan outdoor.', image:'/images/matras.jpg' },
  { id:'sleeping-bag', name:'Sleeping Bag', category:'tidur', pricePerDay:13000, description:'Perlengkapan tidur untuk udara dingin.', image:'/images/sb.jpg' },
  { id:'hammock', name:'Hammock', category:'tidur', pricePerDay:15000, description:'Tempat beristirahat praktis di alam terbuka.', image:'/images/hammock.jpg' },

  { id:'kompor-bunga', name:'Kompor Bunga', category:'masak', pricePerDay:15000, description:'Kompor untuk memasak saat berkemah.', image:'/images/kompor_bunga.jpg' },
  { id:'kompor-petak', name:'Kompor Petak', category:'masak', pricePerDay:12000, description:'Kompor ringkas untuk kegiatan outdoor.', image:'/images/kompor_petak.jpg' },
  { id:'kompor-piknik', name:'Kompor Piknik', category:'masak', pricePerDay:15000, description:'Kompor praktis untuk perjalanan.', image:'/images/kompor.jpg' },
  { id:'nesting-200', name:'Nesting 200', category:'masak', pricePerDay:10000, description:'Peralatan masak ringkas.', image:'/images/200.jpg' },
  { id:'nesting-308', name:'Nesting 308', category:'masak', pricePerDay:15000, description:'Set peralatan masak untuk berkemah.', image:'/images/308.jpg' },
  { id:'teko-air', name:'Teko Air', category:'masak', pricePerDay:10000, description:'Teko untuk memanaskan air.', image:'/images/teko.jpg' },
  { id:'gas-portable', name:'Gas Portable', category:'masak', pricePerDay:18000, description:'Tabung gas portable.', image:'/images/gas.jpg' },

  { id:'carrier-45l', name:'Carrier 45L', category:'utama', pricePerDay:25000, description:'Tas carrier untuk membawa perlengkapan.', image:'/images/carrier_45L.webp' },
  { id:'carrier-65l', name:'Carrier 65L', category:'utama', pricePerDay:25000, description:'Carrier kapasitas besar untuk perjalanan.', image:'/images/carrier_65L.jpg' },
  { id:'daypack', name:'Daypack', category:'tektok', pricePerDay:18000, description:'Tas ringkas untuk perjalanan satu hari.', image:'/images/daypack.jpg' },
  { id:'hydropack', name:'Hydropack', category:'tektok', pricePerDay:13000, description:'Tas minum praktis untuk aktivitas luar ruang.', image:'/images/hydropack.jpg' },

  { id:'jaket-gopcore', name:'Jaket Gopcore', category:'outfit', pricePerDay:18000, sizes:['S','M','L','X','XL'], description:'Jaket outdoor tersedia dalam beberapa ukuran.', image:'/images/jeket.jpg' },
  { id:'jaket-anti-uv', name:'Jaket Anti UV', category:'outfit', pricePerDay:18000, sizes:['S','M','L','X','XL'], description:'Jaket pelindung UV tersedia dalam beberapa ukuran.', image:'/images/anti_uv.jpg' },
  { id:'baselayer', name:'Baselayer', category:'outfit', pricePerDay:8000, sizes:['S','M','L','X','XL'], description:'Lapisan pakaian dasar untuk kegiatan outdoor.', image:'/images/baselayer.jpg' },
  { id:'sepatu', name:'Sepatu', category:'outfit', pricePerDay:20000, sizes:['38','39','40','41','42','43','44'], description:'Sepatu outdoor tersedia dalam beberapa ukuran.', image:'/images/sepatu.jpg' },
  { id:'trackpants', name:'Trackpants', category:'outfit', pricePerDay:18000, sizes:['S','M','L','X','XL'], description:'Celana olahraga untuk kegiatan outdoor.', image:'/images/trackpants.jpg' },
  { id:'celana-cargo', name:'Celana Cargo', category:'outfit', pricePerDay:18000, sizes:['S','M','L','X','XL'], description:'Celana cargo untuk aktivitas luar ruang.', image:'/images/celana_panjang.jpg' },
  { id:'celana-pendek', name:'Celana Pendek', category:'outfit', pricePerDay:6000, sizes:['S','M','L','X','XL'], description:'Celana pendek ringan untuk kegiatan outdoor.', image:'/images/celpen.jpg' },
  { id:'topi', name:'Topi', category:'outfit', pricePerDay:5000, description:'Topi untuk aktivitas di luar ruang.', image:'/images/topi.jpg' },

  { id:'flysheet', name:'Flysheet', category:'camp', pricePerDay:15000, description:'Pelindung tambahan dari panas dan hujan.', image:'/images/flysheet.jpg' },
  { id:'trekking-pole', name:'Trekking Pole', category:'tambahan', pricePerDay:10000, description:'Tongkat untuk membantu keseimbangan saat trekking.', image:'/images/trackingpole.jpg' },
  { id:'headlamp', name:'Headlamp', category:'tambahan', pricePerDay:5000, description:'Lampu kepala untuk penerangan malam.', image:'/images/headlamp.jpg' },
  { id:'lampu-tenda', name:'Lampu Tenda', category:'tambahan', pricePerDay:5000, description:'Lampu untuk penerangan di dalam tenda.', image:'/images/lampu.jpg' },
  { id:'kacamata', name:'Kacamata', category:'tambahan', pricePerDay:5000, description:'Kacamata untuk aktivitas luar ruang.', image:'/images/kacamata.jpg' },
];
// Layanan laundry contoh (halaman informasi laundry)
export const LAUNDRY_SERVICES = [
  { name: 'Sleeping bag', price: 35000 },
  { name: 'Tenda dome', price: 60000 },
  { name: 'Jaket gunung / down jacket', price: 45000 },
  { name: 'Carrier', price: 40000 },
]

// Banner beranda. action.type: 'view' (pindah halaman) atau 'link' (buka URL luar).
export const SLIDES = [
  { id: 'sewa', title: 'Sewa alat outdoor, siap berangkat',
    text: 'Tenda, carrier, sleeping bag, dan kompor. Pilih alatnya, hitung biayanya.',
    image: '/images/banner-sewa.svg', action: { type: 'view', target: 'rent', label: 'Lihat alat sewa' } },
  { id: 'laundry', title: 'Laundry perlengkapan outdoor',
    text: 'Sleeping bag, tenda, dan jaket gunung dicuci sesuai bahannya.',
    image: '/images/banner-laundry.svg', action: { type: 'view', target: 'laundry', label: 'Lihat layanan' } },
  { id: 'bucket', title: 'Bucket bunga untuk hari spesial',
    text: 'Rangkaian bunga segar, dikemas rapi dalam bucket.',
    image: '/images/banner-bucket.svg', action: { type: 'link', url: BUSINESS.instagramUrl, label: 'Kunjungi' } },
]

export const formatRupiah = (n) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)

// Pembuat tautan WhatsApp. Nomor hanya dibaca dari BUSINESS.whatsapp.
export const buildWhatsAppUrl = (message = '') =>
  'https://wa.me/' + BUSINESS.whatsapp + (message ? '?text=' + encodeURIComponent(message) : '')
