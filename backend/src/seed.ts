import sql from "./db";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("🌱 Running seeders...");

  // 1. Seed jadwal_master (Weekday)
  const weekdaySlots = [
    { hari: "Weekday", jam_mulai: "08:00:00", jam_selesai: "09:30:00", harga: 100000 },
    { hari: "Weekday", jam_mulai: "09:30:00", jam_selesai: "11:00:00", harga: 100000 },
    { hari: "Weekday", jam_mulai: "11:00:00", jam_selesai: "12:30:00", harga: 100000 },
    { hari: "Weekday", jam_mulai: "12:30:00", jam_selesai: "14:00:00", harga: 100000 },
    { hari: "Weekday", jam_mulai: "14:00:00", jam_selesai: "15:30:00", harga: 100000 },
    { hari: "Weekday", jam_mulai: "15:30:00", jam_selesai: "17:00:00", harga: 100000 },
    { hari: "Weekday", jam_mulai: "19:00:00", jam_selesai: "20:30:00", harga: 100000 },
    { hari: "Weekday", jam_mulai: "20:30:00", jam_selesai: "22:00:00", harga: 100000 },
  ];

  const weekendSlots = [
    { hari: "Weekend", jam_mulai: "08:00:00", jam_selesai: "09:30:00", harga: 150000 },
    { hari: "Weekend", jam_mulai: "09:30:00", jam_selesai: "11:00:00", harga: 150000 },
    { hari: "Weekend", jam_mulai: "11:00:00", jam_selesai: "12:30:00", harga: 150000 },
    { hari: "Weekend", jam_mulai: "12:30:00", jam_selesai: "14:00:00", harga: 150000 },
    { hari: "Weekend", jam_mulai: "14:00:00", jam_selesai: "15:30:00", harga: 150000 },
    { hari: "Weekend", jam_mulai: "15:30:00", jam_selesai: "17:00:00", harga: 150000 },
    { hari: "Weekend", jam_mulai: "19:00:00", jam_selesai: "20:30:00", harga: 150000 },
    { hari: "Weekend", jam_mulai: "20:30:00", jam_selesai: "22:00:00", harga: 150000 },
  ];

  const allSlots = [...weekdaySlots, ...weekendSlots];

  for (const slot of allSlots) {
    await sql`
      INSERT INTO jadwal_master (hari, jam_mulai, jam_selesai, harga)
      VALUES (${slot.hari}, ${slot.jam_mulai}, ${slot.jam_selesai}, ${slot.harga})
      ON CONFLICT DO NOTHING
    `;
  }
  console.log("✅ Jadwal master seeded");

  // 2. Seed admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);
  await sql`
    INSERT INTO users (nama_lengkap, email, password, role)
    VALUES ('Administrator', 'admin@booking.com', ${hashedPassword}, 'admin')
    ON CONFLICT (email) DO NOTHING
  `;
  console.log("✅ Admin user seeded (admin@booking.com / admin123)");

  console.log("🎉 All seeders completed!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
