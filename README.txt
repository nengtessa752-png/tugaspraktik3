TUGAS PRAKTIK 3 VUE.JS - SITTA UT

Tema:
- Warna biru tua + aksen amber seperti contoh proyek Stok & Tracking.
- Font Arial/Helvetica, layout card, navbar sticky, badge status, tabel responsif.

Cara menjalankan:
1. Ekstrak ZIP.
2. Buka folder tugas3-vue-ut.
3. Jalankan dengan Live Server atau server lokal.
   Contoh:
   python -m http.server 8000
4. Buka browser ke:
   http://localhost:8000

Catatan penting:
- Aplikasi memakai Vue 2 via CDN.
- Data utama berada pada data/dataBahanAjar.json.
- Jika fetch JSON gagal, aplikasi tetap berjalan memakai js/fallback-data.js.
- Perubahan stok dan tracking tersimpan di localStorage browser.
- Tombol "Reset ke Data JSON Awal" menghapus localStorage dan memuat ulang data awal.

Struktur file:
- index.html                         : Root aplikasi, mount #app, tab state, dan template Vue.
- assets/css/style.css               : Gaya global.
- data/dataBahanAjar.json            : Data dummy bahan ajar, paket, pengiriman, stok, tracking.
- js/fallback-data.js                : Data cadangan agar aplikasi tetap bisa dibuka.
- js/services/api.js                 : Service fetch JSON dan normalisasi data.
- js/app.js                          : Inisialisasi Vue root, filter, watcher localStorage.
- js/components/status-badge.js      : Komponen <status-badge>.
- js/components/app-modal.js         : Komponen <app-modal>.
- js/components/stock-table.js       : Komponen <ba-stock-table>.
- js/components/order-form.js        : Komponen <order-form>.
- js/components/do-tracking.js       : Komponen <do-tracking>.
- templates/*.html                   : Salinan template komponen sesuai struktur tugas.

Fitur Stok Bahan Ajar:
- Menampilkan kode, judul, kategori, UT-Daerah, lokasi rak, harga, qty, safety, dan status.
- Format harga menggunakan Rp.
- Format qty dan safety menggunakan satuan buah.
- Status Aman, Menipis, dan Kosong memakai badge warna.
- Catatan HTML tampil saat hover pada status.
- Filter berdasarkan UT-Daerah.
- Filter kategori muncul setelah UT-Daerah dipilih.
- Filter reorder untuk stok menipis dan kosong.
- Sort berdasarkan judul, stock, dan harga.
- Tambah, edit, hapus, validasi sederhana.
- Enter pada form langsung menyimpan data.
- Hapus data memakai modal konfirmasi.

Fitur Pemesanan:
- Nomor DO otomatis berdasarkan tahun berjalan dan sequence number.
- Input NIM, nama, ekspedisi, paket bahan ajar, tanggal kirim, total harga, dan status awal.
- Paket memakai select dan menampilkan detail isi paket.
- Total harga otomatis mengikuti paket.
- Tanggal tampil dalam format tanggal bulan tahun.
- Enter pada form langsung menyimpan DO.

Fitur Tracking DO:
- Pencarian berdasarkan nomor DO atau NIM.
- Enter untuk mencari.
- Esc untuk reset pencarian.
- Menampilkan detail DO, progress langkah, dan timeline perjalanan.
- Menambah status progress dengan waktu dari local time.

Indikator Vue.js yang dipakai:
- Vue Component dan custom element.
- Template dengan id tpl-stock, tpl-order, tpl-tracking, tpl-badge, tpl-modal.
- Mustache, v-text, v-html.
- v-if, v-else-if, v-show.
- v-bind dan v-model.
- computed property dan methods.
- Watcher minimal lebih dari dua: stok, tracking, selectedPaket, generatedNoDO, filters.upbjj, selectedItem.
- v-for untuk array dengan index dan name-based data.
- Filter untuk rupiah, buah, tanggalId, dan datetimeId.
