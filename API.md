# API Documentation - Booking Lapangan Futsal

**Base URL:** `http://localhost:3000/api`  
**Auth Method:** JWT Token (httpOnly Cookie + Bearer Token)  
**Content-Type:** `application/json` (except file uploads: `multipart/form-data`)

---

## Authentication Endpoints

### POST /auth/register
Register new user account.

**Body:**
```json
{
  "nama_lengkap": "string (min 3 chars)",
  "email": "string (valid email)",
  "password": "string (min 8 chars)",
  "pass_confirm": "string (must match password)"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Registrasi berhasil! Silakan login."
}
```

**Errors:**
- 400: Email sudah terdaftar / Password tidak cocok / Validation error

---

### POST /auth/login
Login with email and password.

**Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login berhasil!",
  "user": {
    "id": 1,
    "nama_lengkap": "string",
    "email": "string",
    "role": "user|admin",
    "foto_profil": "string"
  },
  "token": "jwt_token_string"
}
```

**Cookies Set:**
- `token`: JWT token (httpOnly, 7 days expiry)

**Errors:**
- 401: Email atau password salah

---

### POST /auth/logout
Logout current user.

**Response (200):**
```json
{
  "success": true,
  "message": "Logout berhasil."
}
```

---

### GET /auth/me
Get current authenticated user info.

**Auth:** Optional

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "nama_lengkap": "string",
    "email": "string",
    "role": "user|admin",
    "foto_profil": "string"
  }
}
```

Returns `{"user": null}` if not authenticated.

---

### GET /auth/google
Redirect to Google OAuth consent screen.

**Response:** 302 Redirect to Google

---

### GET /auth/google/callback
Google OAuth callback handler.

**Query Params:**
- `code`: Authorization code from Google

**Response:** 302 Redirect to frontend with token

---

## Home / Public Endpoints

### GET /galeri
Get list of gallery photos.

**Response (200):**
```json
{
  "fotos": [
    {
      "id": 1,
      "judul": "string",
      "deskripsi": "string",
      "nama_file": "string",
      "created_at": "timestamp"
    }
  ]
}
```

---

### GET /galeri/:id
Get single gallery photo detail.

**Params:**
- `id`: Gallery photo ID

**Response (200):**
```json
{
  "foto": {
    "id": 1,
    "judul": "string",
    "deskripsi": "string",
    "nama_file": "string",
    "created_at": "timestamp"
  }
}
```

**Errors:**
- 404: Foto tidak ditemukan

---

### POST /kontak/kirim
Send contact message.

**Body:**
```json
{
  "nama": "string",
  "email": "string",
  "pesan": "string (min 10 chars)"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Pesan Anda telah dikirim!"
}
```

---

## Booking Endpoints

### GET /booking/get-jadwal
Get available schedules for a date.

**Auth:** Required

**Query Params:**
- `tanggal`: Date in YYYY-MM-DD format

**Response (200):**
```json
{
  "status": "success",
  "jadwal": [
    {
      "id": 1,
      "hari": "Weekday|Weekend",
      "jam_mulai": "08:00",
      "jam_selesai": "09:00",
      "harga": "100000.00",
      "tersedia": true
    }
  ]
}
```

**Errors:**
- 400: Tanggal tidak valid
- 401: Unauthorized

---

### POST /booking/store
Create new booking.

**Auth:** Required

**Body:**
```json
{
  "nama_pemesan": "string",
  "email_pemesan": "string (valid email)",
  "nomor_hp_pemesan": "string",
  "tanggal_booking": "YYYY-MM-DD",
  "id_jadwal": "number"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Pemesanan berhasil!",
  "kode_pemesanan": "BOOK-20260305-ABC123"
}
```

**Errors:**
- 400: Jadwal sudah dipesan / Validation error
- 401: Unauthorized

---

### GET /booking/konfirmasi/:kode
Get booking confirmation details.

**Auth:** Required

**Params:**
- `kode`: Booking code

**Response (200):**
```json
{
  "pesanan": {
    "id": 1,
    "kode_pemesanan": "string",
    "nama_pemesan": "string",
    "email_pemesan": "string",
    "nomor_hp_pemesan": "string",
    "tanggal_booking": "YYYY-MM-DD",
    "jam_mulai": "HH:MM",
    "jam_selesai": "HH:MM",
    "total_harga": "150000.00",
    "status_pemesanan": "pending|confirmed|cancelled|completed",
    "status_pembayaran": "pending|paid|failed",
    "bank_tujuan": "string|null",
    "bukti_pembayaran": "string|null"
  }
}
```

**Errors:**
- 404: Pemesanan tidak ditemukan
- 401: Unauthorized

---

### POST /booking/simpan-pembayaran
Upload payment proof for booking.

**Auth:** Required

**Content-Type:** `multipart/form-data`

**Body:**
```
kode_pemesanan: string
bank: BCA|Mandiri|BRI
bukti_bayar: file (image/jpeg, image/png, max 5MB)
catatan: string (optional)
```

**Response (200):**
```json
{
  "success": true,
  "message": "Bukti pembayaran berhasil diunggah!"
}
```

**Errors:**
- 404: Kode pemesanan tidak ditemukan
- 400: File format invalid / File too large
- 401: Unauthorized

---

## Profile Endpoints

### GET /profil
Get current user profile.

**Auth:** Required

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "nama_lengkap": "string",
    "email": "string",
    "role": "user|admin",
    "foto_profil": "string",
    "created_at": "timestamp"
  }
}
```

---

### POST /profil/update
Update user profile.

**Auth:** Required

**Content-Type:** `multipart/form-data`

**Body:**
```
nama_lengkap: string
email: string (valid email)
foto_profil: file (optional, image/jpeg, image/png)
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profil berhasil diperbarui.",
  "user": {
    "id": 1,
    "nama_lengkap": "string",
    "email": "string",
    "role": "user|admin",
    "foto_profil": "string"
  },
  "token": "new_jwt_token"
}
```

**Cookies Updated:**
- `token`: New JWT token with updated user data

**Errors:**
- 400: Email sudah digunakan
- 401: Unauthorized

---

### POST /profil/update-password
Change user password.

**Auth:** Required

**Body:**
```json
{
  "password_lama": "string",
  "password_baru": "string (min 8 chars)",
  "konfirmasi_password": "string"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password berhasil diubah."
}
```

**Errors:**
- 400: Password lama salah / Konfirmasi tidak cocok / Password < 8 chars
- 401: Unauthorized

---

## User Endpoints

### GET /user/riwayat
Get user's booking history.

**Auth:** Required

**Response (200):**
```json
{
  "riwayat": [
    {
      "id": 1,
      "kode_pemesanan": "string",
      "tanggal_booking": "YYYY-MM-DD",
      "jam_mulai": "HH:MM",
      "jam_selesai": "HH:MM",
      "total_harga": "150000.00",
      "status_pemesanan": "pending|confirmed|cancelled|completed",
      "status_pembayaran": "pending|paid|failed",
      "created_at": "timestamp"
    }
  ]
}
```

---

### POST /user/feedback
Submit feedback for a booking.

**Auth:** Required

**Body:**
```json
{
  "id_pemesanan": "number",
  "rating": "number (1-5)",
  "komentar": "string"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Terima kasih atas feedback Anda!"
}
```

**Errors:**
- 400: Rating harus 1-5 / Pemesanan belum selesai
- 401: Unauthorized

---

### DELETE /user/riwayat/:id
Delete a booking (only pending status).

**Auth:** Required

**Params:**
- `id`: Booking ID

**Response (200):**
```json
{
  "success": true,
  "message": "Pemesanan berhasil dihapus."
}
```

**Errors:**
- 403: Hanya pemesanan pending yang bisa dihapus
- 404: Pemesanan tidak ditemukan
- 401: Unauthorized

---

### GET /user/struk/:kode
Get printable booking receipt.

**Auth:** Required

**Params:**
- `kode`: Booking code

**Response (200):**
```json
{
  "struk": {
    "kode_pemesanan": "string",
    "nama_pemesan": "string",
    "tanggal_booking": "YYYY-MM-DD",
    "jam_mulai": "HH:MM",
    "jam_selesai": "HH:MM",
    "total_harga": "150000.00",
    "status_pemesanan": "string",
    "waktu_pembayaran": "timestamp|null"
  }
}
```

---

## Admin Endpoints

**Note:** All admin endpoints require `role: "admin"` in JWT token.

### GET /admin/dashboard
Get dashboard statistics.

**Auth:** Admin

**Response (200):**
```json
{
  "total_pesanan": 10,
  "pesanan_pending": 3,
  "total_pendapatan": "1500000.00",
  "total_user": 25,
  "total_galeri": 8
}
```

---

### GET /admin/pembayaran
Get all bookings with search.

**Auth:** Admin

**Query Params:**
- `search`: Optional search by kode/nama/email

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "kode_pemesanan": "string",
      "nama_pemesan": "string",
      "email_pemesan": "string",
      "tanggal_booking": "YYYY-MM-DD",
      "jam_mulai": "HH:MM",
      "jam_selesai": "HH:MM",
      "total_harga": "150000.00",
      "status_pemesanan": "string",
      "status_pembayaran": "string",
      "created_at": "timestamp"
    }
  ]
}
```

---

### GET /admin/pembayaran/detail/:id
Get booking detail for admin.

**Auth:** Admin

**Response (200):**
```json
{
  "pesanan": {
    "id": 1,
    "kode_pemesanan": "string",
    "nama_pemesan": "string",
    "email_pemesan": "string",
    "nomor_hp_pemesan": "string",
    "tanggal_booking": "YYYY-MM-DD",
    "jam_mulai": "HH:MM",
    "jam_selesai": "HH:MM",
    "total_harga": "150000.00",
    "status_pemesanan": "string",
    "status_pembayaran": "string",
    "bank_tujuan": "string|null",
    "bukti_pembayaran": "string|null",
    "catatan_pembayaran": "string|null",
    "waktu_pembayaran": "timestamp|null"
  }
}
```

---

### POST /admin/pembayaran/simpan
Update booking payment status.

**Auth:** Admin

**Body:**
```json
{
  "id_pesanan": "number",
  "status_pembayaran": "pending|paid|failed",
  "status_pemesanan": "pending|confirmed|cancelled|completed"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Status pembayaran berhasil diupdate."
}
```

---

### DELETE /admin/pembayaran/:id
Delete a booking.

**Auth:** Admin

**Response (200):**
```json
{
  "success": true,
  "message": "Pemesanan berhasil dihapus."
}
```

---

### GET /admin/jadwal
Get all schedules with filter.

**Auth:** Admin

**Query Params:**
- `hari`: Optional filter by Weekday/Weekend

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "hari": "Weekday|Weekend",
      "jam_mulai": "HH:MM",
      "jam_selesai": "HH:MM",
      "harga": "100000.00"
    }
  ]
}
```

---

### POST /admin/jadwal/simpan
Create or update schedule.

**Auth:** Admin

**Body:**
```json
{
  "id": "number (optional, for update)",
  "hari": "Weekday|Weekend",
  "jam_mulai": "HH:MM",
  "jam_selesai": "HH:MM",
  "harga": "number"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Jadwal berhasil disimpan."
}
```

---

### DELETE /admin/jadwal/:id
Delete a schedule.

**Auth:** Admin

**Response (200):**
```json
{
  "success": true,
  "message": "Jadwal berhasil dihapus."
}
```

---

### GET /admin/users
Get all users with search and filter.

**Auth:** Admin

**Query Params:**
- `search`: Optional search by nama/email
- `role`: Optional filter by user/admin

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "nama_lengkap": "string",
      "email": "string",
      "role": "user|admin",
      "foto_profil": "string",
      "created_at": "timestamp"
    }
  ]
}
```

---

### POST /admin/users/simpan
Create or update user.

**Auth:** Admin

**Body:**
```json
{
  "id": "number (optional, for update)",
  "nama_lengkap": "string",
  "email": "string",
  "role": "user|admin",
  "password": "string (optional, min 8 chars)"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "User berhasil disimpan."
}
```

---

### DELETE /admin/users/:id
Delete a user.

**Auth:** Admin

**Response (200):**
```json
{
  "success": true,
  "message": "User berhasil dihapus."
}
```

---

### GET /admin/galeri
Get all gallery photos with search.

**Auth:** Admin

**Query Params:**
- `search`: Optional search by judul

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "judul": "string",
      "deskripsi": "string",
      "nama_file": "string",
      "created_at": "timestamp"
    }
  ]
}
```

---

### POST /admin/galeri/simpan
Create or update gallery photo.

**Auth:** Admin

**Content-Type:** `multipart/form-data`

**Body:**
```
id: number (optional, for update)
judul: string
deskripsi: string
foto: file (required for create, optional for update)
```

**Response (200):**
```json
{
  "success": true,
  "message": "Foto galeri berhasil disimpan."
}
```

---

### GET /admin/galeri/detail/:id
Get gallery photo detail.

**Auth:** Admin

**Response (200):**
```json
{
  "foto": {
    "id": 1,
    "judul": "string",
    "deskripsi": "string",
    "nama_file": "string",
    "created_at": "timestamp"
  }
}
```

---

### DELETE /admin/galeri/:id
Delete gallery photo.

**Auth:** Admin

**Response (200):**
```json
{
  "success": true,
  "message": "Foto berhasil dihapus."
}
```

---

### GET /admin/pesan-kontak
Get all contact messages with search.

**Auth:** Admin

**Query Params:**
- `search`: Optional search by nama/email/pesan

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "nama_pengirim": "string",
      "email": "string",
      "pesan": "string",
      "created_at": "timestamp"
    }
  ]
}
```

---

### DELETE /admin/pesan-kontak/:id
Delete contact message.

**Auth:** Admin

**Response (200):**
```json
{
  "success": true,
  "message": "Pesan berhasil dihapus."
}
```

---

### GET /admin/feedback
Get all feedback with search.

**Auth:** Admin

**Query Params:**
- `search`: Optional search by komentar

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "kode_pemesanan": "string",
      "nama_user": "string",
      "rating": 5,
      "komentar": "string",
      "created_at": "timestamp"
    }
  ]
}
```

---

### DELETE /admin/feedback/:id
Delete feedback.

**Auth:** Admin

**Response (200):**
```json
{
  "success": true,
  "message": "Feedback berhasil dihapus."
}
```

---

## File Upload Endpoints

### GET /uploads/profil/:filename
Get profile photo.

**Example:** `/uploads/profil/profil_1709568123456_abc123.jpg`

---

### GET /uploads/galeri/:filename
Get gallery photo.

**Example:** `/uploads/galeri/galeri_1709568123456_abc123.jpg`

---

### GET /uploads/bukti_pembayaran/:filename
Get payment proof photo.

**Example:** `/uploads/bukti_pembayaran/bukti_1709568123456_abc123.jpg`

---

## Error Response Format

All error responses follow this format:

```json
{
  "error": "Error message string"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request (validation error)
- `401` - Unauthorized (not logged in or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

**Last Updated:** March 5, 2026  
**Version:** 1.0.0  
**Author:** Muhammad Rizal Nurfirdaus
