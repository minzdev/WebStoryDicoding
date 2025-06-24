# 📖 STORYN AJA - Web Story App

Web Story App (STORYN AJA) adalah aplikasi berbasis web yang memungkinkan pengguna untuk berbagi cerita disertai gambar dan lokasi. Dibangun sebagai proyek submission akhir dengan dukungan fitur modern seperti PWA, Push Notification, dan penyimpanan offline.

## 🚀 Demo Aplikasi

[🔗 Coba versi live](https://dynamic-hotteok-d2bcb5.netlify.app/)

## 🎯 Fitur Utama

- 📜 Menampilkan daftar cerita dari API
- 🧭 Menampilkan lokasi cerita pada peta interaktif
- 📷 Mengambil gambar dari kamera atau mengunggah file
- 🌐 Tambah cerita lengkap dengan deskripsi dan lokasi
- 📡 Mendukung **Push Notification** dengan VAPID
- ⚙️ Installable dan **offline ready** (PWA)
- 💾 Menyimpan cerita ke **IndexedDB** untuk akses offline
- 📱 Tampilan **mobile-friendly** dan responsif
- ♿ Aksesibilitas: Alt text, semantic HTML, skip link

## 🧪 Teknologi

- Frontend: HTML5, CSS3, JavaScript (ES6+)
- Arsitektur: SPA (Single Page Application) dengan hash routing
- Library: Leaflet.js, View Transition API
- Module Bundler: Webpack
- Storage: IndexedDB (via idb), Cache Storage
- Service Worker: Custom dengan App Shell
- PWA: Manifest, install prompt, offline fallback
- API: https://story-api.dicoding.dev/v1

## 📂 Struktur Folder

```
storynaja/
├── dist/                            # Hasil build akhir dari Webpack
│   ├── index.html
│   ├── bundle.js
│   ├── manifest.json
│   ├── service-worker.js
│   ├── fallback-tile.png
│   └── icons/
│       ├── icon-192.png
│       ├── icon-512.png
│       └── screenshot1.png

├── public/                          # Aset publik yang disalin ke dist/
│   ├── manifest.json
│   ├── service-worker.js
│   ├── fallback-tile.png
│   └── icons/
│       ├── icon-192.png
│       ├── icon-512.png
│       └── screenshot1.png

├── src/
│   ├── index.js                    # Entry point utama
│   ├── index.html                 # Template HTML utama
│   ├── main.css                   # Style global utama

│   ├── scripts/
│   │   ├── routes/                # Routing SPA
│   │   │   └── routes.js
│   │
│   │   ├── views/                 # Halaman SPA
│   │   │   ├── pages/
│   │   │   │   ├── home.js
│   │   │   │   ├── addStoryView.js
│   │   │   │   ├── myStory.js
│   │   │   │   └── about.js
│   │   │   └── components/
│   │   │       ├── navbar.js
│   │   │       └── footer.js
│   │
│   │   ├── presenters/            # Presenter untuk setiap view (MVP)
│   │   │   ├── homePresenter.js
│   │   │   └── addStoryPresenter.js
│   │
│   │   ├── utils/                 # Utilitas umum
│   │   │   ├── api.js
│   │   │   ├── auth.js
│   │   │   ├── db.js
│   │   │   ├── story-idb.js
│   │   │   └── mapHelper.js

├── netlify.toml                    # Konfigurasi untuk Netlify deploy
├── package.json                    # Konfigurasi npm
├── webpack.config.js              # Konfigurasi Webpack
└── README.md                       # Dokumentasi proyek

```

## 📥 Cara Install dan Jalankan

```bash
git clone https://github.com/username/web-story-app.git
cd web-story-app
npm install
npm run start
```

Untuk versi produksi:

```bash
npm run build
```

## 📝 Kriteria Submission yang Dipenuhi

| Kriteria                                           | Status     |
| -------------------------------------------------- | ---------- |
| Menggunakan API story dari Dicoding                | ✅ Selesai |
| SPA dengan routing hash                            | ✅ Selesai |
| Daftar cerita dengan gambar, teks, dan lokasi      | ✅ Selesai |
| Tambah cerita: kamera, upload, lokasi              | ✅ Selesai |
| Aksesibilitas web                                  | ✅ Selesai |
| Transisi halus antar halaman (View Transition API) | ✅ Selesai |
| Push Notification (VAPID)                          | ✅ Selesai |
| PWA (App Shell, offline, installable)              | ✅ Selesai |
| IndexedDB: simpan, tampil, hapus cerita offline    | ✅ Selesai |
| Deployment publik (Netlify/Firebase/GitHub Pages)  | ✅ Selesai |

## 📸 Screenshot

| Home Page                     | Add Story                         |
| ----------------------------- | --------------------------------- |
| ![home](screenshots/home.png) | ![add](screenshots/add-story.png) |

## 🧑‍💻 Kontributor

> Dibuat oleh **Suparman Denz**  
> Untuk Submission Dicoding: Menjadi Front-End Web Developer Expert
