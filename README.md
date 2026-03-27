# Uleman Digital

Platform Undangan Pernikahan Digital yang modern, dinamis, dan mudah dikustomisasi. Proyek ini dilengkapi dengan halaman undangan (landing page) untuk tamu dan *dashboard admin* untuk mengelola informasi acara serta data RSVP.

## 🚀 Fitur Utama

- **Undangan Digital (Landing Page):** Tampilan undangan yang elegan dan responsif.
- **Pilihan Tema:** Tersedia beberapa tema yang bisa disesuaikan (Elegant, Minimalist, dll) dari *dashboard admin*.
- **RSVP Digital:** Tamu dapat mengonfirmasi kehadiran serta mengirimkan ucapan secara langsung.
- **Admin Dashboard:** Panel khusus untuk mengatur konfigurasi pernikahan (nama mempelai, tanggal acara, alamat akad/resepsi, hadiah/rekening) dan melihat daftar RSVP.
- **Kustomisasi Media:** Upload foto pengantin (hero, mempelai pria, mempelai wanita) serta mengatur musik latar (backsound) kustom langsung dari dashboard.
- **Manajemen Profil Admin:** Pembaruan username, password, dan detail akun langsung dari dashboard.
- **Data Tersimpan Otomatis:** Semua perubahan dan ucapan tersimpan persisten ke dalam satu database SQLite.

---

## 💻 Tech Stack (Teknologi yang Digunakan)

Proyek ini dipisahkan menjadi beberapa *services* dalam satu *repository* ini (Monorepo).

### Backend (`/backend`)
Menjalankan REST API dan mengelola penyimpanan data.
- **Node.js** & **Express.js** untuk web server.
- **SQLite3** untuk database relasional (file base, mudah dikelola).
- **CORS** untuk menangani lintas domain.

### Frontend (`/frontend`)
Aplikasi web *client-side* (SPA) untuk tampilan undangan dan dashboard.
- **React.js** dengan Vite sebagai bundler (kecepatan *build* tinggi).
- **React Router** untuk navigasi halaman (*routing*).
- **Lucide React** untuk ikon.
- **Recharts** untuk visualisasi data jika ada (di dashboard).
- Vanilla CSS untuk styling fleksibel dan animasi yang *smooth* (dikombinasikan dengan *Lenis*).

*(Terdapat juga direktori `/uleman-next` yang merupakan versi alternatif atau pengembangan lanjutan menggunakan framework **Next.js**).*

---

## 📂 Struktur Direktori

```text
📁 uleman-deri-new/
├── 📁 backend/       # Kode REST API Express dan Database SQLite
│   ├── package.json
│   ├── server.js     # Entry point server backend
│   └── uleman_v3.db  # Database otomatis terbuat saat pertama kali jalan
├── 📁 frontend/      # Aplikasi React (Vite) untuk UI (Admin & Undangan)
│   ├── package.json
│   ├── src/          # Source code React (komponen, pages, styles)
│   └── public/
└── 📁 uleman-next/   # (Opsional) Versi framework Next.js dari platform ini
```

---

## 🛠️ Cara Menjalankan Aplikasi di Komputer Lokal

Pastikan Anda sudah menginstal [Node.js](https://nodejs.org/) di komputer Anda.

### 1. Menjalankan Backend API

Buka terminal baru, masuk ke folder `backend`:

```bash
cd backend
npm install
npm start
# Atau bisa langsung dengan perintah: node server.js
```
*Server REST API akan berjalan di http://localhost:5000*

### 2. Menjalankan Frontend (UI)

Buka terminal *lainnya*, masuk ke folder `frontend`:

```bash
cd frontend
npm install
npm run dev
```
*Vite akan memberikan URL untuk diakses melalui browser Anda (biasanya http://localhost:5173).*

---

## 🌟 Mulai Menggunakan Admin Dashboard

Secara default *Credentials* saat pertama install:
- **Username:** admin
- **Password:** admin

Setelah berhasil *login* ke dashboard admin, Anda dapat langsung mengedit informasi acara dan melihat previewnya di halaman utama undangan.

---

## 📜 Lisensi

Proyek ini bersifat *Open-Source* atau penggunaannya mengikuti kebijakan lisensi pribadi. Silakan *fork* repositori ini untuk kustomisasi lebih lanjut.
