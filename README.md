# Booking Lapangan Futsal

> **Status: Siap Pakai (Production Ready)**

Aplikasi pemesanan lapangan futsal berbasis web dengan fitur lengkap termasuk booking online, pembayaran, galeri, feedback, dan panel admin.

**Pemilik / Developer:** Muhammad Rizal Nurfirdaus

---

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| **Backend** | [Elysia](https://elysiajs.com/) + [Bun](https://bun.sh/) (TypeScript) |
| **Frontend** | [React 19](https://react.dev/) + [Vite](https://vitejs.dev/) (TypeScript) |
| **Database** | PostgreSQL (Aiven Cloud) |
| **Styling** | Bootstrap 4.6.2 + Custom CSS (Dark Theme) |
| **Auth** | JWT (httpOnly Cookie) + Google OAuth 2.0 |

> **Catatan:** Project ini merupakan hasil migrasi dari PHP CodeIgniter 4 ke TypeScript full-stack (Elysia + React).

---

## 📚 Dokumentasi

| Dokumen | Deskripsi |
|---------|-----------|
| **[API.md](API.md)** | Complete API documentation - semua endpoint dengan request/response examples |
| **[TESTING.md](TESTING.md)** | Panduan testing lengkap - manual testing checklist untuk semua fitur |
| **[DEPLOYMENT.md](DEPLOYMENT.md)** | Production deployment guide - VPS, Docker, Cloud platforms |
| **[test-api.sh](test-api.sh)** | Automated API testing script - test semua endpoint dengan satu command |

---

## Struktur Project

```
booking_lapangan/
├── backend/          # Elysia API server (port 3000)
│   └── src/
│       ├── index.ts          # Entry point
│       ├── db.ts             # PostgreSQL connection
│       ├── migrate.ts        # Database migration
│       ├── seed.ts           # Database seeder
│       ├── middleware/        # JWT auth middleware
│       ├── routes/            # API routes (auth, home, booking, profil, user, admin)
│       └── uploads/           # File uploads (profil, galeri, bukti_pembayaran)
├── frontend/         # React SPA (port 5173)
│   └── src/
│       ├── App.tsx            # Router & route definitions
│       ├── api.ts             # Axios API client
│       ├── context/           # Auth context provider
│       ├── components/layout/ # UserTemplate, AdminLayout
│       ├── pages/             # Halaman user (Home, Booking, Galeri, dll)
│       └── pages/admin/       # Halaman admin (Dashboard, Jadwal, Users, dll)
└── app/              # (Legacy) PHP CodeIgniter 4 source
```

---

## Fitur

- **Autentikasi** — Login/Register (semua email) & Google OAuth 2.0
- **Booking Lapangan** — Pilih tanggal, lihat jadwal tersedia, pesan langsung
- **Konfirmasi Pembayaran** — Upload bukti pembayaran dengan pilihan bank
- **Riwayat Pemesanan** — Lihat status booking & beri feedback/rating
- **Profil** — Edit nama, email, foto profil, ubah password
- **Galeri** — Lihat foto-foto lapangan
- **Kontak** — Kirim pesan ke admin
- **Admin Panel** — Dashboard, kelola pembayaran, jadwal, users, galeri, pesan kontak, feedback

---

## 🚀 Quick Start

### Prasyarat

- [Bun](https://bun.sh/) v1.3+ — Runtime JavaScript/TypeScript modern
- PostgreSQL database (sudah dikonfigurasi di Aiven Cloud)

### Setup Otomatis

```bash
# Clone repository
git clone <repository-url>
cd booking_lapangan

# Jalankan setup script (install dependencies, migrate, seed database)
./setup.sh

# Start development servers (backend + frontend sekaligus)
./start-dev.sh
```

**Atau Manual:**

### 1. Setup Backend

```bash
cd backend
bun install            # Install dependencies
bun run migrate        # Buat tabel database
bun run seed           # Isi data awal (jadwal + admin)
bun run dev            # Jalankan server di http://localhost:3000
```

### 2. Setup Frontend

```bash
cd frontend
bun install            # Install dependencies
bun run dev            # Jalankan di http://localhost:5173
```

### 3. Testing

```bash
# Test semua API endpoints
./test-api.sh

# Atau testing manual (lihat TESTING.md untuk checklist lengkap)
```

### Akses Aplikasi

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000
- **Health Check:** http://localhost:3000/api/health

**Default Admin Login:**
- Email: `admin123@gmail.com`
- Password: `admin12345`

---

## 🧪 Testing

```bash
# Test semua API endpoints dengan automated script
./test-api.sh

# Untuk testing manual lengkap, lihat TESTING.md
# Checklist mencakup semua fitur: Auth, Booking, Admin Panel, dll
```

---

## Konfigurasi Google OAuth 2.0

Buka [Google Cloud Console](https://console.cloud.google.com/apis/credentials) dan atur:

**Authorized JavaScript origins:**
```
http://localhost:5173
http://localhost:3000
```

**Authorized redirect URIs:**
```
http://localhost:3000/api/auth/google/callback
```

---

## Environment Variables (backend/.env)

```env
DATABASE_URL=postgres://user:pass@host:port/db_name?sslmode=require
JWT_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
FRONTEND_URL=http://localhost:5173
PORT=3000
```

---

## 📡 API Endpoints

**Ringkasan Endpoint Utama:**

| Method | Endpoint | Keterangan |
|--------|----------|------------|
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/register` | Register |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Cek session |
| GET | `/api/auth/google` | Google OAuth redirect |
| GET | `/api/galeri` | Daftar galeri |
| POST | `/api/kontak/kirim` | Kirim pesan kontak |
| GET | `/api/booking/get-jadwal` | Ambil jadwal tersedia |
| POST | `/api/booking/store` | Buat pemesanan |
| POST | `/api/booking/simpan-pembayaran` | Upload bukti bayar |
| GET | `/api/user/riwayat` | Riwayat pemesanan |
| POST | `/api/user/feedback` | Kirim feedback |

**📄 Dokumentasi Lengkap:** Lihat [API.md](API.md) untuk semua 50+ endpoints dengan request/response examples.

---

**Admin Endpoints:** `/api/admin/*` - Dashboard, pembayaran, jadwal, users, galeri, pesan kontak, feedback

📄 **Dokumentasi Lengkap:** Lihat [API.md](API.md) untuk semua 50+ endpoints dengan request/response examples.

---

## 🚀 Deployment

Project ini siap untuk deployment ke production. Lihat [DEPLOYMENT.md](DEPLOYMENT.md) untuk panduan lengkap:

- **VPS Deployment** (Nginx + Systemd)
- **Docker Deployment** (Docker Compose)
- **Cloud Platforms** (Vercel, Railway, Render)
- **Database Migration** (PostgreSQL production setup)
- **Environment Configuration** (Production environment variables)
- **Security Best Practices** (HTTPS, CORS, Rate Limiting)

---

## 📝 Scripts Reference

```bash
# Setup & Development
./setup.sh              # Initial setup (install deps, migrate, seed)
./start-dev.sh          # Start both servers (backend + frontend)

# Backend
cd backend
bun run dev             # Development server
bun run migrate         # Run migrations
bun run seed            # Seed database
bun test                # Run tests

# Frontend
cd frontend
bun run dev             # Development server
bun run build           # Production build
bun run preview         # Preview production build

# Testing
./test-api.sh           # Automated API tests
# Manual testing: lihat TESTING.md
```

---

## 📋 Development Checklist

- [x] Backend API (Elysia + Bun)
- [x] Frontend SPA (React + Vite)
- [x] Database Schema & Migrations
- [x] Authentication (JWT + Google OAuth)
- [x] User Features (Booking, Galeri, Kontak, Profil)
- [x] Admin Panel (Dashboard, CRUD semua tabel)
- [x] File Uploads (Profil, Galeri, Bukti Pembayaran)
- [x] Comprehensive Documentation
- [x] Bug Fixing & API Path Corrections
- [x] Dark Theme UI Polish & Consistency
- [x] End-to-End Testing
- [ ] Performance Optimization
- [ ] Production Deployment
- [ ] CI/CD Pipeline

---

## 📄 License

MIT License

Copyright (c) 2026 Muhammad Rizal Nurfirdaus

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

## 👤 Developer

**Muhammad Rizal Nurfirdaus**

- GitHub: [@muhammadrizal]
- Project Status: **Siap Pakai (Production Ready)**

---

## 📝 Changelog (Maret 2026)

### Bug Fixes
- **Fix API Path Galeri** — Frontend Galeri page menggunakan path `/home/galeri` yang salah, diperbaiki menjadi `/galeri` sesuai backend route
- **Fix API Path Kontak** — Frontend Kontak page menggunakan path `/home/kontak/kirim` yang salah, diperbaiki menjadi `/kontak/kirim`
- **Fix Login Handler** — Login page tidak menggunakan return value dari `login()` dengan benar, menyebabkan error tidak ditampilkan
- **Fix Feedback** — Field `id_pemesanan` tidak dikirim saat submit feedback dari halaman Riwayat
- **Fix Cetak Struk Link** — Link "Cetak Struk" di halaman Konfirmasi mengarah ke route `/struk/cetak/` yang tidak ada, diperbaiki ke route admin print

### UI/UX Improvements
- **Dark Theme Modal** — Semua modal dialog di admin panel kini menggunakan dark theme yang konsisten
- **Sidebar Active Link** — Highlight aktif dengan warna hijau (#1abc9c) di admin sidebar
- **Dark Form Inputs** — Semua form input (date picker, select, textarea) kini memiliki dark styling yang konsisten
- **Smooth Animations** — Tambahan animasi smooth untuk modal (fade-in + slide-down) dan transisi pada card/button
- **Table Improvements** — Header tabel uppercase, font-weight lebih tebal, border-color konsisten
- **Responsive Mobile** — Admin sidebar dengan smooth slide transition, hero section responsive
- **Scrollbar Styling** — Custom dark scrollbar di seluruh aplikasi
- **Badge Polish** — Font-weight dan letter-spacing yang lebih baik pada badge status

---

**✅ Catatan:** Project ini sudah melalui tahap bug fixing, UI polish, dan testing. Aplikasi siap untuk digunakan dan di-deploy ke production.

