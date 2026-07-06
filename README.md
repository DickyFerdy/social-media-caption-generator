# ✨ Smart Social Media Caption Generator

Aplikasi generator caption otomatis berkualitas tinggi untuk berbagai platform sosial media, ditenagai oleh **Google Gemini API** dengan desain UI/UX premium yang responsif.

Aplikasi ini menghasilkan caption terstruktur menggunakan formula penulisan pemasaran (*copywriting frameworks*) populer untuk memaksimalkan performa dan interaksi konten Anda.

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + Vite, Tailwind CSS v3, Lucide React (Ikon Modern) |
| **Backend** | Node.js, Express.js, Morgan (Logger), Express Rate Limit (Keamanan) |
| **AI Service** | Google Gemini API (`@google/genai`) |

---

## 🚀 Fitur Unggulan

- **Formula Copywriting Terstruktur**: Menghasilkan **3 opsi alternatif sekaligus** berdasarkan formula pemasaran teruji:
  1. **AIDA** (Attention, Interest, Desire, Action)
  2. **PAS** (Problem, Agitate, Solve)
  3. **Storytelling / Punchy** (Naratif emosional atau tulisan ringkas & tajam)
- **Live Mockup Post Previews**: Tampilan pratinjau langsung postingan yang interaktif menyerupai tampilan asli di **Instagram**, **X (Twitter)**, **Facebook**, dan **LinkedIn**.
- **Ketahanan Sistem Terhadap Beban Tinggi (High Demand API Fault Tolerance)**:
  - **Auto-Retry & Backoff**: Mencoba kembali otomatis jika model sibuk atau terkena batas limit temporer (error 503).
  - **Model Fallback**: Berpindah ke model cadangan secara otomatis (`gemini-3.5-flash` → `gemini-2.5-flash` → `gemini-1.5-flash`) jika model utama sedang bermasalah.
- **Keamanan & Proteksi API**: Terintegrasi dengan `express-rate-limit` untuk membatasi request per perangkat guna mencegah penyalahgunaan API key.
- **Copywriter Hook Strategy**: Menampilkan penjelasan taktik pembuka (*hook*) dari masing-masing opsi yang dihasilkan.
- **Tagar Pintar (Smart Hashtags)**: Tagar dipisahkan dalam visual pil yang rapi, namun otomatis digabungkan dengan caption utama saat disalin.
- **Akses Cepat Platform**: Tautan langsung untuk membuka platform sosial media target dalam satu klik.
- **Riwayat Konten**: Riwayat caption tersimpan aman di browser (*localStorage*) dengan fitur gunakan kembali (*reuse*), salin, atau hapus.
- **Antarmuka Premium**: Desain bertema gelap (*dark mode*) modern dengan efek *glassmorphism* yang responsif.
- **Arsitektur Modular & Bersih**: Kode frontend telah direfaktor dan dipecah menjadi komponen modular untuk kemudahan pemeliharaan (*maintainability*) dan performa optimal.

---

## 📁 Struktur Proyek

```
social-media-caption-generator/
├── backend/
│   ├── server.js          # Express server, middleware logger, & rate-limiting
│   ├── gemini.js          # Integrasi Gemini API + skema JSON & alur auto-retry
│   ├── package.json       # Dependensi backend (express, cors, rate-limit, morgan)
│   └── .env               # File environment berisi API key (tidak di-commit)
├── frontend/
│   ├── index.html
│   ├── vite.config.js     # Proxy ke backend port 3000
│   ├── tailwind.config.js # Konfigurasi Tailwind CSS
│   ├── postcss.config.js  # Konfigurasi PostCSS compiler
│   ├── package.json       # Dependensi frontend (react, tailwind, lucide-react)
│   └── src/
│       ├── main.jsx       # Entry point React
│       ├── App.jsx        # Komponen logika utama generator
│       ├── App.css        # Gaya custom tambahan & impor Tailwind CSS
│       └── components/    # Komponen React modular hasil refaktorisasi
│           ├── SocialIcons.jsx      # Ikon platform & brand SVG
│           ├── Toast.jsx            # Toast notifikasi feedback
│           ├── LoadingSkeleton.jsx  # Loader placeholder
│           └── PlatformMockup.jsx   # Live mockup pratinjau media sosial
└── README.md
```

---

## ⚡ Instalasi & Menjalankan

### Prasyarat
- Node.js v18 atau lebih tinggi
- API Key Google Gemini ([Dapatkan di Google AI Studio](https://aistudio.google.com/apikey))

### 1. Clone Repository
```bash
git clone https://github.com/username/smart-caption-generator.git
cd smart-caption-generator
```

### 2. Setup & Konfigurasi Backend
```bash
cd backend
npm install
```

Buat file `.env` di dalam folder `backend/` untuk menyimpan kunci API Anda:
```env
GEMINI_API_KEY=AIzaSy...paste_api_key_anda_di_sini
PORT=3000
CORS_ORIGIN=http://localhost:5173
```

### 3. Setup & Konfigurasi Frontend
```bash
cd ../frontend
npm install
```

### 4. Jalankan Aplikasi

Jalankan **Backend** (buka Terminal 1):
```bash
cd backend
npm run dev
# 🚀 Backend running at http://localhost:3000
```

Jalankan **Frontend** (buka Terminal 2):
```bash
cd frontend
npm run dev
# ➜ Local: http://localhost:5173
```

Buka tautan **http://localhost:5173** pada browser Anda untuk menggunakan aplikasi.

---

## 🌐 Environment Variables (Backend)

| Variable | Keterangan | Default |
|----------|-----------|---------|
| `GEMINI_API_KEY` | API Key resmi Google Gemini (*wajib*) | - |
| `PORT` | Port server Express berjalan | `3000` |
| `CORS_ORIGIN` | Alamat asal frontend yang diizinkan melakukan request | `http://localhost:5173` |

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah lisensi MIT.