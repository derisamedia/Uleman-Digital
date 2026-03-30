<div align="center">
  <img src="./logo.png" alt="Uleman Digital Logo" width="250" />
  
  <h1>Uleman Digital</h1>
  
  <p>
    <strong>Platform Undangan Pernikahan Digital yang modern, dinamis, dan mudah dikustomisasi.</strong>
  </p>
</div>

Proyek ini adalah repositori bagian **Frontend** yang dilengkapi dengan halaman undangan (landing page) interaktif untuk tamu, animasi *smooth scrolling*, dan **dashboard admin** fungsional untuk mengelola informasi acara, musik latar (backsound), foto galeri, serta data RSVP secara *real-time*.

## 🚀 Fitur Utama

- **Undangan Digital (Landing Page):** Tampilan undangan yang elegan dan responsif.
- **Pilihan Tema:** Tersedia beberapa tema yang bisa disesuaikan (Elegant, Minimalist, dll) dari *dashboard admin*.
- **RSVP Digital:** Tamu dapat mengonfirmasi kehadiran serta mengirimkan ucapan secara langsung.
- **Admin Dashboard:** Panel khusus untuk mengatur konfigurasi pernikahan (nama mempelai, tanggal acara, alamat akad/resepsi, hadiah/rekening) dan melihat daftar RSVP.
- **Kustomisasi Media:** Upload foto pengantin, mengatur musik latar (backsound) kustom langsung dari dashboard.

---

## 💻 Tech Stack (Teknologi Frontend)

Aplikasi web *client-side* (SPA) untuk tampilan undangan dan dashboard dibangun menggunakan:
- **React.js** dengan **Vite** sebagai *bundler* (kecepatan *build* tinggi).
- **React Router** untuk navigasi halaman (*routing*).
- **Lucide React** untuk ikon.
- Vanilla CSS untuk styling fleksibel dan animasi yang *smooth* (dikombinasikan dengan *Lenis*).
- **CORS Proxy (Vercel Rewrites)** untuk mengatasi masalah lintas domain.

---

## 🛠️ Cara Menjalankan di Komputer Lokal

Pastikan Anda sudah menginstal [Node.js](https://nodejs.org/) dan telah menjalankan *backend* API dari repositori **Uleman Digital Backend** di komputer Anda.

1. Hubungkan ke Backend Lokal:
   Buka file `vite.config.js` dan pastikan konfigurasi `target` *proxy* mengarah ke port backend Anda (misal: `http://localhost:5000`).
   File `.env` cukup berisi: `VITE_API_URL=/api`

2. Instalasi modul dan jalankan:
   ```bash
   npm install
   npm run dev
   ```
3. Akses aplikasi melalui browser di `http://localhost:5173`.

---

## ☁️ Panduan Publikasi / Deploy ke Hosting Gratis

Arsitektur aplikasi ini menggunakan **Vercel** untuk Frontend dan **Railway** (atau platform Node.js sejenis) untuk Backend.

### Langkah 1: Deploy Backend (Railway / Hosting Node.js)
1. Buat project baru di [Railway](https://railway.app/).
2. Hubungkan ke repositori **Uleman Digital Backend** Anda.
3. Tambahkan **Volume** berjenis Persistent Storage yang di-mount ke path `/app/uploads` dan berikan database path *environment variable* agar data SQLite dan foto tidak hilang saat Railway *restart*.
4. Dapatkan domain publik backend Anda (Misal: `https://uleman-backend-production.up.railway.app`).

### Langkah 2: Konfigurasi Frontend untuk Produksi
Sebelum deploy Frontend, Anda harus menautkan frontend ini ke domain Backend production Anda. Buka codebase frontend dan edit dua file ini:

**1. Edit file `vercel.json`**
Ubah bagian `destination` URL dengan alamat backend Railway Anda:
```json
{
  "source": "/api/(.*)",
  "destination": "https://ALAMAT_RAILWAY_ANDA/api/$1"
},
{
  "source": "/uploads/(.*)",
  "destination": "https://ALAMAT_RAILWAY_ANDA/uploads/$1"
}
```

**2. (Opsional) Edit `vite.config.js`**
Jika Anda ingin mengetes frontend ini terkoneksi ke backend live sembari _development_ lokal, ubah isian `target` dari `localhost` menjadi alamat `https://ALAMAT_RAILWAY_ANDA`.

### Langkah 3: Deploy Frontend ke Vercel
1. Buat project baru di [Vercel](https://vercel.com/).
2. Impor / sambungkan ke repositori GitHub **Uleman Digital** (Frontend) ini.
3. Masuk ke opsi **Environment Variables**, dan tambahkan:
   - **Key:** `VITE_API_URL`
   - **Value:** `/api`
   *(Catatan: Isian bernilai `/api` ini memicu Vercel Rewrites, sebuah arsitektur server proxy sehingga aplikasi terhindar dari error CORS secara otomatis).*
4. Klik **Deploy** dan tunggu proses instalasi selesai.
5. Selesai! Undangan digital Anda kini live.

---

## 🌟 Mengakses Admin Dashboard
Jika Anda menguji *deployment* atau menjalankan pertama kali dan database dalam keadaan kosong, kredensial bawaan (*default*) adalah:
- **Username:** admin
- **Password:** admin

Setelah berhasil *login* ke dashboard admin via `/dashboard`, **segera ubah kredensial Anda** demi keamanan, lalu Anda dapat langsung mengedit semua informasi acara atau mengganti foto.

---

## 📜 Lisensi
Proyek ini bersifat *Open-Source*. Silakan *fork* repositori ini untuk kustomisasi lebih lanjut proyek pernikahan Anda.
