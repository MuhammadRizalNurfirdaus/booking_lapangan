import sql from "./db";

async function migrate() {
  console.log("🔄 Running migrations...");

  // 1. Create users table
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      nama_lengkap VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(10) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
      foto_profil VARCHAR(255) DEFAULT 'default.png',
      google_id VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  console.log("✅ Table 'users' created");

  // 2. Create jadwal_master table
  await sql`
    CREATE TABLE IF NOT EXISTS jadwal_master (
      id SERIAL PRIMARY KEY,
      hari VARCHAR(10) DEFAULT 'Weekday' CHECK (hari IN ('Weekday', 'Weekend')),
      jam_mulai TIME NOT NULL,
      jam_selesai TIME NOT NULL,
      harga DECIMAL(10,2) DEFAULT 100000.00
    )
  `;
  console.log("✅ Table 'jadwal_master' created");

  // 3. Create pemesanan table
  await sql`
    CREATE TABLE IF NOT EXISTS pemesanan (
      id SERIAL PRIMARY KEY,
      kode_pemesanan VARCHAR(50) UNIQUE NOT NULL,
      id_user INTEGER REFERENCES users(id) ON DELETE SET NULL,
      id_jadwal_master INTEGER NOT NULL REFERENCES jadwal_master(id) ON DELETE CASCADE,
      nama_pemesan VARCHAR(255),
      email_pemesan VARCHAR(255),
      nomor_hp_pemesan VARCHAR(20),
      tanggal_booking DATE NOT NULL,
      total_harga DECIMAL(10,2) NOT NULL,
      status_pemesanan VARCHAR(20) DEFAULT 'pending' CHECK (status_pemesanan IN ('pending', 'confirmed', 'cancelled', 'completed')),
      status_pembayaran VARCHAR(20) DEFAULT 'pending' CHECK (status_pembayaran IN ('pending', 'paid', 'failed')),
      bank_tujuan VARCHAR(50),
      bukti_pembayaran VARCHAR(255),
      catatan_pembayaran TEXT,
      waktu_pembayaran TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  console.log("✅ Table 'pemesanan' created");

  // 4. Create galeri table
  await sql`
    CREATE TABLE IF NOT EXISTS galeri (
      id SERIAL PRIMARY KEY,
      judul VARCHAR(255) NOT NULL,
      deskripsi TEXT,
      nama_file VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  console.log("✅ Table 'galeri' created");

  // 5. Create pesan_kontak table
  await sql`
    CREATE TABLE IF NOT EXISTS pesan_kontak (
      id SERIAL PRIMARY KEY,
      nama_pengirim VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      pesan TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  console.log("✅ Table 'pesan_kontak' created");

  // 6. Create feedback table
  await sql`
    CREATE TABLE IF NOT EXISTS feedback (
      id SERIAL PRIMARY KEY,
      id_user INTEGER REFERENCES users(id) ON DELETE SET NULL,
      id_pemesanan INTEGER REFERENCES pemesanan(id) ON DELETE SET NULL,
      komentar TEXT NOT NULL,
      rating SMALLINT CHECK (rating >= 1 AND rating <= 5),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  console.log("✅ Table 'feedback' created");

  console.log("🎉 All migrations completed successfully!");
  process.exit(0);
}

migrate().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
