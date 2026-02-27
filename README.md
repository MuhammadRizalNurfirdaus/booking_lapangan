# Booking Lapangan Futsal

> **Status: Dalam Tahap Pengembangan (Development)**

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

- **Autentikasi** — Login/Register manual & Google OAuth 2.0
- **Booking Lapangan** — Pilih tanggal, lihat jadwal tersedia, pesan langsung
- **Konfirmasi Pembayaran** — Upload bukti pembayaran dengan pilihan bank
- **Riwayat Pemesanan** — Lihat status booking & beri feedback/rating
- **Profil** — Edit nama, email, foto profil, ubah password
- **Galeri** — Lihat foto-foto lapangan
- **Kontak** — Kirim pesan ke admin
- **Admin Panel** — Dashboard, kelola pembayaran, jadwal, users, galeri, pesan kontak, feedback

---

## Cara Menjalankan

### Prasyarat

- [Bun](https://bun.sh/) v1.3+
- PostgreSQL database (atau gunakan Aiven Cloud)

### 1. Setup Backend

```bash
cd backend
cp .env.example .env   # Sesuaikan konfigurasi di .env
bun install
bun run migrate        # Buat tabel database
bun run seed           # Isi data awal (jadwal + admin)
bun run dev            # Jalankan server di http://localhost:3000
```

### 2. Setup Frontend

```bash
cd frontend
bun install
bun run dev            # Jalankan di http://localhost:5173
```

### 3. Akses Aplikasi

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000
- **Admin Login:** `admin@booking.com` / `admin123`

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

## API Endpoints

| Method | Endpoint | Keterangan |
|--------|----------|------------|
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/register` | Register |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Cek session |
| GET | `/api/auth/google` | Google OAuth redirect |
| GET | `/api/auth/google/callback` | Google OAuth callback |
| GET | `/api/galeri` | Daftar galeri |
| GET | `/api/galeri/:id` | Detail galeri |
| POST | `/api/kontak/kirim` | Kirim pesan kontak |
| GET | `/api/booking/get-jadwal` | Ambil jadwal tersedia |
| POST | `/api/booking/store` | Buat pemesanan |
| GET | `/api/booking/konfirmasi/:kode` | Detail konfirmasi |
| POST | `/api/booking/simpan-pembayaran` | Upload bukti bayar |
| GET | `/api/profil` | Data profil |
| POST | `/api/profil/update` | Update profil |
| POST | `/api/profil/update-password` | Ubah password |
| GET | `/api/user/riwayat` | Riwayat pemesanan |
| POST | `/api/user/feedback` | Kirim feedback |
| GET | `/api/admin/dashboard` | Dashboard admin |
| GET | `/api/admin/pembayaran` | Daftar pembayaran |
| POST | `/api/admin/jadwal/simpan` | CRUD jadwal |
| GET | `/api/admin/users` | Daftar users |
| ... | `/api/admin/...` | Endpoint admin lainnya |

---

## License

MIT License

---

> **⚠️ Project ini masih dalam tahap pengembangan aktif.**
