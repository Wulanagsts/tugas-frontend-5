# Katalog UMKM — Tugas Praktikum 5 Dasar Pemrograman Frontend

Tugas Praktikum 5 mata kuliah **Dasar Pemrograman Frontend (KK112104)**, Program Studi S1 Teknik Informatika, STIKOM PGRI Banyuwangi.

| | |
|---|---|
| Nama | Sindi Agustiya Wulandari |
| NIM | 1125102198 |
| Kelas | SP3 |

## Deskripsi

Web **Katalog UMKM** terdiri dari dua halaman yang saling terhubung dan memakai data yang sama lewat `localStorage`. Perubahan di satu halaman langsung terlihat di halaman lainnya.

| Halaman | File | Fungsi |
|---|---|---|
| Kelola Produk | `tugas 3&4.html` | Form tambah/edit produk, live preview, tabel produk, hapus, pencarian, dan filter kategori (Pertemuan 3 dan 4) |
| Kartu Produk | `product-card.html` | Produk tampil sebagai kartu dinamis, ringkasan data, tombol ubah status aktif/nonaktif, dan tombol hapus (Pertemuan 5) |

## Fitur Pertemuan 5

1. **Dynamic UI Rendering**: fungsi `buildCard()` dan `renderProductCards()` mengubah array of objects menjadi kartu produk yang responsif (CSS Grid `auto-fill`).
2. **Aksi Manipulasi DOM**
   - Tombol **Hapus Produk** menghapus elemen kartu dari DOM dengan `remove()`.
   - Tombol **Ubah Status** mengganti status aktif/nonaktif dengan `classList.toggle()`.
3. **Transisi Visual**: kartu muncul bertahap saat dimuat (kelas `enter`), memudar saat dihapus (kelas `fade-out`), dan badge berubah warna dengan halus saat status diganti.

Teknik DOM yang dipakai: `querySelector`, `createElement`, `setAttribute`, `dataset`, `append`, `classList`, dan event delegation.

## Struktur Project

```
tugas frontend 5/
├── assets/
│   ├── css/
│   │   ├── cards.css       # gaya halaman Kartu Produk dan transisi
│   │   └── style.css       # gaya umum (navbar, form, tabel)
│   └── js/
│       ├── data.js         # dataset awal 8 produk
│       ├── store.js        # fungsi bersama (localStorage, validasi data, format rupiah)
│       ├── tugas4.js       # logika halaman Kelola Produk
│       └── tugas5.js       # logika halaman Kartu Produk
├── .gitignore
├── product-card.html       # halaman Kartu Produk
├── README.md
└── tugas 3&4.html          # halaman Kelola Produk
```

## Cara Menjalankan

1. Clone atau unduh repository ini.
2. Buka `tugas 3&4.html` atau `product-card.html` langsung di browser (Chrome, Edge, atau Firefox). Tidak perlu instalasi apa pun.
3. Gunakan menu navigasi di bagian atas untuk berpindah halaman.
4. Buka Developer Tools (`F12`) lalu tab **Console** untuk melihat log pengujian.

Untuk menjalankan lewat server lokal (opsional):

```bash
npx serve .
```

## Cara Penggunaan

**Halaman Kelola Produk**
- Isi form lalu klik **Simpan Produk** untuk menambah produk.
- Klik **Edit** pada baris tabel untuk mengubah produk, lalu **Simpan Perubahan** (atau **Batal Edit**).
- Klik **Hapus** untuk menghapus produk.
- Gunakan kolom **Cari** dan filter **Categori** untuk menyaring tabel.
- Klik **Reset Data** untuk mengembalikan 8 produk awal.

**Halaman Kartu Produk**
- Klik **Ubah Status** untuk mengganti Aktif/Nonaktif. Kartu menjadi redup saat nonaktif.
- Klik **Hapus Produk** untuk menghapus kartu (kartu memudar dahulu sebelum hilang).
- Ringkasan di atas (Total, Aktif, Nonaktif, Total Nilai Stok) ikut diperbarui otomatis.

## Validasi Form (Halaman Kelola Produk)

| Kolom | Aturan |
|---|---|
| Name | Wajib diisi dan tidak boleh sama dengan produk lain (huruf besar/kecil diabaikan) |
| Categori | Wajib dipilih |
| Price | Angka minimal Rp 1.000 |
| Stok | Bilangan bulat 0 atau lebih (desimal ditolak) |

Data di `localStorage` yang rusak atau bentuknya salah tidak membuat halaman error. Aplikasi otomatis memakai dataset awal dan mencetak peringatan di console.

## Penyimpanan Data

Data disimpan di `localStorage` dengan kunci `katalogUmkmProducts`. Jika belum ada data, aplikasi memakai dataset awal dari `data.js`. Untuk mengosongkan data, gunakan tombol **Reset Data** atau hapus kunci tersebut lewat Developer Tools (Application, lalu Local Storage).

## Teknologi

HTML5, CSS3 (Grid, Flexbox, transition), dan JavaScript (vanilla, tanpa library).

&copy; 2026 Katalog UMKM, STIKOM PGRI Banyuwangi