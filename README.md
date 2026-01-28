# LMS Frontend (Next.js)

> Learning Management System (LMS) Frontend built with Next.js, React, and TypeScript.

## Fitur Utama

- Autentikasi (Login, Register) untuk dosen & mahasiswa
- Dashboard dosen & mahasiswa
- Manajemen course, module (materi PDF/video), dan tugas
- Upload & preview materi (PDF/video) langsung di card module
- Enroll mahasiswa ke course
- Lihat daftar mahasiswa yang terdaftar di course
- Integrasi penuh ke backend API (bukan mock/local API)

## Struktur Project

- `app/` — Routing Next.js (app router)
- `components/` — Komponen UI & layout
- `lib/` — Helper API, auth, JWT, dsb
- `public/` — Asset statis (icon, dsb)

## Setup & Menjalankan

1. **Install dependencies**
   ```bash
   npm install
   # atau
   yarn install
   ```
2. **Buat file .env.local**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   ```
   (Ganti sesuai URL backend kamu)
3. **Jalankan development server**
   ```bash
   npm run dev
   ```
   Buka [http://localhost:3000](http://localhost:3000)

## Integrasi Backend

- Semua data (auth, course, module, dsb) diambil dari backend API (bukan mock/local route)
- File materi (PDF/video) diakses via URL: `http://[domain-backend]/uploads/modules/namafile.pdf`
- Pastikan backend sudah expose folder uploads/ sebagai static

## Build & Deploy

```bash
npm run build
npm start
```

## Stack

- Next.js 16
- React 19
- TypeScript
- TailwindCSS (jika diaktifkan)

## Kontribusi

Pull request & issue sangat diterima!

---

> Untuk detail API backend, cek dokumentasi backend masing-masing.
