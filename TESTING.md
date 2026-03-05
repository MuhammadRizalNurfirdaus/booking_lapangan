# Testing Guide - Booking Lapangan Futsal

> **Project Status:** Development  
> **Owner:** Muhammad Rizal Nurfirdaus  
> **Stack:** Elysia (Bun) + React (Vite) + PostgreSQL

---

## Prerequisites

Pastikan kedua server sudah running:
```bash
# Terminal 1 - Backend
cd backend
bun run dev
# Server running at http://localhost:3000

# Terminal 2 - Frontend  
cd frontend
bun run dev
# Server running at http://localhost:5173
```

---

## 1. Testing Autentikasi

### 1.1 Register User Baru
1. Buka http://localhost:5173/register
2. Isi form:
   - Nama Lengkap: `Test User`
   - Email: `test@example.com`
   - Password: `testpass123`
   - Konfirmasi Password: `testpass123`
3. Klik **Daftar**
4. **Expected:** Redirect ke `/login` dengan pesan sukses

**API Endpoint:** `POST /api/auth/register`

### 1.2 Login dengan Email/Password
1. Buka http://localhost:5173/login
2. Isi form:
   - Email: `test@example.com`
   - Password: `testpass123`
3. Klik **Masuk**
4. **Expected:** Redirect ke `/` (home), navbar menampilkan nama user

**API Endpoint:** `POST /api/auth/login`

### 1.3 Login Admin
1. Buka http://localhost:5173/login
2. Isi form:
   - Email: `admin123@gmail.com`
   - Password: `admin12345`
3. Klik **Masuk**
4. **Expected:** Redirect ke `/admin/dashboard`

### 1.4 Google OAuth Login
1. Buka http://localhost:5173/login
2. Klik tombol **Masuk dengan Google**
3. **Expected:** Redirect ke Google OAuth consent screen
4. Pilih akun Google
5. **Expected:** Redirect kembali ke aplikasi dengan user logged in

**API Endpoints:**
- `GET /api/auth/google` (redirect)
- `GET /api/auth/google/callback` (callback)

### 1.5 Logout
1. Klik dropdown user di navbar
2. Klik **Logout**
3. **Expected:** Redirect ke `/login`, session cleared

**API Endpoint:** `POST /api/auth/logout`

---

## 2. Testing Halaman User

### 2.1 Home Page
1. Buka http://localhost:5173/
2. **Expected:** Hero section dengan background image, tombol "Pesan Sekarang"
3. Klik **Pesan Sekarang**
4. **Expected:** Redirect ke `/booking` jika login, atau `/login` jika belum

### 2.2 Galeri
1. Buka http://localhost:5173/galeri
2. **Expected:** Tampil grid foto galeri (kosong jika belum ada data)
3. Admin bisa tambah foto di `/admin/galeri`
4. Klik foto → **Expected:** redirect ke `/galeri/:id` (detail)

**API Endpoints:**
- `GET /api/galeri` (list)
- `GET /api/galeri/:id` (detail)

### 2.3 Kontak
1. Buka http://localhost:5173/kontak
2. Isi form kontak:
   - Nama: `Test Sender`
   - Email: `sender@example.com`
   - Pesan: `Testing kontak form`
3. Klik **Kirim Pesan**
4. **Expected:** Alert sukses, form direset

**API Endpoint:** `POST /api/kontak/kirim`

Admin bisa lihat pesan di `/admin/pesan-kontak`

---

## 3. Testing Booking Flow

### 3.1 Pilih Tanggal & Jadwal
1. Login sebagai user (bukan admin)
2. Buka http://localhost:5173/booking
3. Pilih tanggal di calendar (weekday atau weekend)
4. **Expected:** Jadwal tersedia muncul (08:00-09:00, 09:00-10:00, dst)
5. Slot yang sudah dipesan akan disabled

**API Endpoint:** `GET /api/booking/get-jadwal?tanggal=YYYY-MM-DD`

### 3.2 Buat Pemesanan
1. Klik salah satu slot jadwal yang tersedia
2. Isi data pemesan (atau gunakan data dari profil)
3. Klik **Pesan Sekarang**
4. **Expected:** 
   - Alert sukses dengan kode booking
   - Redirect ke `/booking/konfirmasi/:kode`

**API Endpoint:** `POST /api/booking/store`

**Request Body:**
```json
{
  "nama_pemesan": "Test User",
  "email_pemesan": "test@example.com",
  "nomor_hp_pemesan": "081234567890",
  "tanggal_booking": "2026-03-10",
  "id_jadwal": 3
}
```

### 3.3 Konfirmasi & Upload Bukti Pembayaran
1. Buka `/booking/konfirmasi/:kode` (dari redirect sebelumnya)
2. **Expected:** Detail pemesanan ditampilkan:
   - Kode booking
   - Tanggal & jam
   - Total harga
   - Status: Pending
3. Isi form pembayaran:
   - Pilih Bank (BCA/Mandiri/BRI)
   - Upload foto bukti pembayaran (.jpg/.png)
   - Catatan (optional)
4. Klik **Simpan Bukti Pembayaran**
5. **Expected:** Alert sukses, status berubah "Menunggu Konfirmasi"

**API Endpoint:** `POST /api/booking/simpan-pembayaran`

---

## 4. Testing Profil User

### 4.1 Lihat Profil
1. Login sebagai user
2. Klik **Profil** di navbar
3. **Expected:** Data profil ditampilkan (nama, email, foto)

**API Endpoint:** `GET /api/profil`

### 4.2 Update Profil
1. Di halaman profil
2. Edit nama/email
3. Upload foto profil baru (optional)
4. Klik **Simpan Perubahan**
5. **Expected:** Alert sukses, token JWT di-refresh dengan data baru

**API Endpoint:** `POST /api/profil/update`

### 4.3 Ubah Password
1. Scroll ke section "Ubah Password"
2. Isi form:
   - Password Lama
   - Password Baru
   - Konfirmasi Password Baru
3. Klik **Ubah Password**
4. **Expected:** Alert sukses

**API Endpoint:** `POST /api/profil/update-password`

---

## 5. Testing Riwayat Pemesanan & Feedback

### 5.1 Lihat Riwayat
1. Login sebagai user
2. Buka http://localhost:5173/riwayat
3. **Expected:** Tabel daftar pemesanan user dengan:
   - Kode booking
   - Tanggal
   - Jam
   - Status pemesanan
   - Status pembayaran
   - Aksi (feedback/hapus/struk)

**API Endpoint:** `GET /api/user/riwayat`

### 5.2 Beri Feedback & Rating
1. Klik **Beri Feedback** pada pemesanan yang sudah confirmed/completed
2. Modal feedback muncul
3. Pilih rating (1-5 bintang)
4. Isi komentar
5. Klik **Kirim Feedback**
6. **Expected:** Alert sukses, modal tertutup

**API Endpoint:** `POST /api/user/feedback`

### 5.3 Hapus Pemesanan
1. Klik **Hapus** pada pemesanan dengan status pending
2. Konfirmasi hapus
3. **Expected:** Pemesanan terhapus dari list

**API Endpoint:** `DELETE /api/user/riwayat/:id`

### 5.4 Cetak Struk
1. Klik **Struk** pada pemesanan yang completed
2. **Expected:** Halaman struk terbuka di tab baru (print-ready)

**API Endpoint:** `GET /api/user/struk/:kode`

---

## 6. Testing Admin Panel

Login dengan `admin123@gmail.com` / `admin12345` untuk akses semua fitur admin.

### 6.1 Dashboard
- Buka http://localhost:5173/admin/dashboard
- **Expected:** Statistik cards:
  - Total Pesanan
  - Pesanan Pending
  - Total Pendapatan
  - Total User
  - Total Galeri

**API Endpoint:** `GET /api/admin/dashboard`

### 6.2 Pembayaran
- Buka http://localhost:5173/admin/pembayaran
- **Expected:** Tabel semua pemesanan dengan search
- Klik **Detail** → lihat detail pembayaran
- Update status pembayaran (pending/paid/failed)
- Update status pemesanan (pending/confirmed/cancelled/completed)

**API Endpoints:**
- `GET /api/admin/pembayaran?search=...`
- `GET /api/admin/pembayaran/detail/:id`
- `POST /api/admin/pembayaran/simpan`
- `DELETE /api/admin/pembayaran/:id`

### 6.3 Jadwal Master
- Buka http://localhost:5173/admin/jadwal
- **Expected:** Tabel jadwal (weekday/weekend) dengan CRUD
- **Tambah:** Modal form tambah jadwal baru
- **Edit:** Modal form edit jadwal
- **Hapus:** Konfirmasi hapus jadwal

**API Endpoints:**
- `GET /api/admin/jadwal?hari=...`
- `POST /api/admin/jadwal/simpan` (create/update)
- `DELETE /api/admin/jadwal/:id`

### 6.4 Users Management
- Buka http://localhost:5173/admin/users
- **Expected:** Tabel semua user dengan search & filter role
- **Tambah:** Modal form tambah user baru (admin/user)
- **Edit:** Modal form edit user (nama, email, role, password)
- **Hapus:** Konfirmasi hapus user

**API Endpoints:**
- `GET /api/admin/users?search=...&role=...`
- `POST /api/admin/users/simpan`
- `DELETE /api/admin/users/:id`

### 6.5 Galeri Management
- Buka http://localhost:5173/admin/galeri
- **Expected:** Grid foto dengan CRUD
- **Tambah:** Modal upload foto + judul + deskripsi
- **Edit:** Modal edit judul/deskripsi/ganti foto
- **Detail:** Modal detail foto full size
- **Hapus:** Konfirmasi hapus foto

**API Endpoints:**
- `GET /api/admin/galeri?search=...`
- `POST /api/admin/galeri/simpan` (multipart/form-data)
- `GET /api/admin/galeri/detail/:id`
- `DELETE /api/admin/galeri/:id`

### 6.6 Pesan Kontak
- Buka http://localhost:5173/admin/pesan-kontak
- **Expected:** Tabel pesan dari form kontak
- **Hapus:** Konfirmasi hapus pesan

**API Endpoints:**
- `GET /api/admin/pesan-kontak?search=...`
- `DELETE /api/admin/pesan-kontak/:id`

### 6.7 Feedback
- Buka http://localhost:5173/admin/feedback
- **Expected:** Tabel feedback dengan rating (bintang) & komentar
- **Hapus:** Konfirmasi hapus feedback

**API Endpoints:**
- `GET /api/admin/feedback?search=...`
- `DELETE /api/admin/feedback/:id`

---

## 7. Testing File Upload

File upload tersimpan di `backend/src/uploads/`:

### 7.1 Profile Photo
- Path: `backend/src/uploads/profil/`
- Route: `/uploads/profil/:filename`
- Test: Update profil dengan foto baru

### 7.2 Payment Proof
- Path: `backend/src/uploads/bukti_pembayaran/`
- Route: `/uploads/bukti_pembayaran/:filename`
- Test: Upload bukti pembayaran saat konfirmasi booking

### 7.3 Gallery Photos
- Path: `backend/src/uploads/galeri/`
- Route: `/uploads/galeri/:filename`
- Test: Admin upload foto di galeri management

**Verifikasi:**
```bash
ls -la backend/src/uploads/profil/
ls -la backend/src/uploads/bukti_pembayaran/
ls -la backend/src/uploads/galeri/
```

---

## 8. Testing Error Handling

### 8.1 Validation Errors
- Register dengan email yang sudah terdaftar
- Login dengan password salah
- Booking tanpa login (protected route)
- Upload file > 5MB
- Password < 8 karakter

### 8.2 Authorization Errors
- User biasa akses `/admin/*` → redirect ke login
- Akses profil orang lain
- Edit pemesanan orang lain

### 8.3 Not Found
- Akses `/galeri/999` (ID tidak ada)
- Akses `/booking/konfirmasi/INVALID_CODE`

---

## 9. Testing Responsiveness

Test di berbagai ukuran layar:
- Desktop (1920x1080)
- Tablet (768x1024)
- Mobile (375x667)

**Halaman yang harus responsive:**
- Home page (hero section)
- Booking form & calendar
- Admin sidebar (toggle mobile)
- Gallery grid
- Tables (scroll horizontal di mobile)

---

## 10. Database Verification

```bash
# Connect ke PostgreSQL
psql "DATABASE_URL_HERE"

# Check tables
\dt

# Check data
SELECT * FROM users;
SELECT * FROM jadwal_master;
SELECT * FROM pemesanan ORDER BY created_at DESC LIMIT 10;
SELECT * FROM galeri;
SELECT * FROM pesan_kontak;
SELECT * FROM feedback;
```

---

## 11. Security Testing

### 11.1 JWT Token
- Token disimpan di httpOnly cookie + localStorage fallback
- Expire: 7 days
- Refresh saat update profil

### 11.2 Password Hashing
- Menggunakan bcryptjs (10 rounds)
- Password lama tidak bisa sama dengan password baru

### 11.3 SQL Injection Prevention
- Menggunakan postgres.js parameterized queries
- Input sanitization di backend

### 11.4 CORS
- Hanya allow `http://localhost:5173`
- Credentials: true

---

## 12. Performance Testing

### 12.1 API Response Time
```bash
# Test health endpoint
time curl -s http://localhost:3000/api/health

# Test get jadwal
time curl -s "http://localhost:3000/api/booking/get-jadwal?tanggal=2026-03-05"

# Test admin dashboard
time curl -s -b "token=YOUR_JWT" http://localhost:3000/api/admin/dashboard
```

### 12.2 Frontend Bundle Size
```bash
cd frontend
bun run build
ls -lh dist/
```

---

## Test Checklist

### Autentikasi
- [ ] Register user baru
- [ ] Login dengan email/password
- [ ] Login admin
- [ ] Google OAuth login
- [ ] Logout
- [ ] Session persistence (refresh page)

### User Features
- [ ] View home page
- [ ] Browse galeri
- [ ] Send contact message
- [ ] Create booking
- [ ] Upload payment proof
- [ ] View booking history
- [ ] Submit feedback
- [ ] Update profile
- [ ] Change password

### Admin Features
- [ ] View dashboard stats
- [ ] Manage pembayaran (confirm/reject)
- [ ] CRUD jadwal master
- [ ] CRUD users
- [ ] CRUD galeri
- [ ] View & delete pesan kontak
- [ ] View & delete feedback
- [ ] Print struk

### Technical
- [ ] All API endpoints respond correctly
- [ ] File uploads work (profil, payment, galeri)
- [ ] Auth middleware protects routes
- [ ] Admin middleware restricts admin routes
- [ ] Database constraints work (UNIQUE, FOREIGN KEY)
- [ ] Error messages displayed properly
- [ ] Loading states shown during API calls

---

## Known Issues / Todo

- [ ] Email notification (belum diimplementasi)
- [ ] Payment gateway integration (masih manual upload)
- [ ] Real-time booking availability (perlu websocket)
- [ ] Advanced search & filter
- [ ] Export laporan to PDF/Excel
- [ ] Multi-language support

---

**Last Updated:** March 5, 2026  
**Tested By:** Muhammad Rizal Nurfirdaus
