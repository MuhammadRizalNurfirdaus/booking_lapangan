import { Elysia, t } from "elysia";
import sql from "../db";
import { jwtPlugin, getUserFromToken } from "../middleware/auth";
import { randomUUID } from "crypto";
import { writeFile, mkdir, unlink } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const UPLOADS_DIR = path.join(import.meta.dir, "../uploads");

export const bookingRoutes = new Elysia({ prefix: "/api/booking" })
  .use(jwtPlugin)
  .resolve(async ({ jwt, cookie }) => ({
    user: await getUserFromToken(jwt, cookie),
  }))

  // GET /api/booking/get-jadwal?tanggal=YYYY-MM-DD
  .get("/get-jadwal", async ({ query, set }) => {
    const tanggalString = query.tanggal;
    if (!tanggalString) {
      set.status = 400;
      return { status: "error", message: "Tanggal tidak valid." };
    }

    try {
      const tanggalDipilih = new Date(tanggalString);
      if (isNaN(tanggalDipilih.getTime())) {
        set.status = 400;
        return { status: "error", message: "Format tanggal tidak valid." };
      }

      // Determine day type
      const dayOfWeek = tanggalDipilih.getUTCDay();
      const jenisHari =
        dayOfWeek === 0 || dayOfWeek === 6 ? "Weekend" : "Weekday";

      // Get all slots for the day type
      const semuaSlot = await sql`
        SELECT * FROM jadwal_master
        WHERE hari = ${jenisHari}
        ORDER BY jam_mulai ASC
      `;

      // Get booked slot IDs for this date
      const bookedSlots = await sql`
        SELECT id_jadwal_master FROM pemesanan
        WHERE tanggal_booking = ${tanggalString}
        AND status_pemesanan IN ('pending', 'confirmed')
      `;
      const bookedIds = bookedSlots.map(
        (row) => row.id_jadwal_master
      );

      // Filter out booked slots
      let slotTersedia = semuaSlot.filter(
        (slot) => !bookedIds.includes(slot.id)
      );

      // Filter past time slots if today
      const today = new Date();
      const todayStr = today.toLocaleDateString("en-CA", {
        timeZone: "Asia/Jakarta",
      }); // YYYY-MM-DD format

      if (tanggalString === todayStr) {
        const now = new Date().toLocaleTimeString("en-GB", {
          timeZone: "Asia/Jakarta",
          hour12: false,
        });
        slotTersedia = slotTersedia.filter(
          (slot) => slot.jam_mulai > now
        );
      }

      return { status: "success", jadwal: slotTersedia };
    } catch (e) {
      set.status = 400;
      return { status: "error", message: "Format tanggal tidak valid." };
    }
  })

  // POST /api/booking/store
  .post(
    "/store",
    async ({ body, user, set }) => {
      if (!user) {
        set.status = 401;
        return { error: "Anda harus login." };
      }

      const { tanggal_booking, id_jadwal, nama_pemesan, email_pemesan, nomor_hp_pemesan } = body;

      // Get jadwal
      const jadwalRows = await sql`SELECT * FROM jadwal_master WHERE id = ${id_jadwal}`;
      if (jadwalRows.length === 0) {
        set.status = 400;
        return { error: "Jadwal yang dipilih tidak valid." };
      }

      const jadwal = jadwalRows[0];
      const kode = "BOOK-" + randomUUID().split("-")[0].toUpperCase();

      let finalNama = nama_pemesan || "";
      let finalEmail = email_pemesan || "";
      let finalHp = nomor_hp_pemesan || "";
      let statusPemesanan = "pending";
      let statusPembayaran = "pending";

      // If admin, mark as offline order
      if (user.role === "admin") {
        finalNama = "Pesanan Offline (Admin)";
        finalEmail = user.email;
        finalHp = "000000";
        statusPemesanan = "confirmed";
        statusPembayaran = "paid";
      }

      await sql`
        INSERT INTO pemesanan (kode_pemesanan, id_user, id_jadwal_master, nama_pemesan, email_pemesan, nomor_hp_pemesan, tanggal_booking, total_harga, status_pemesanan, status_pembayaran)
        VALUES (${kode}, ${user.id}, ${id_jadwal}, ${finalNama}, ${finalEmail}, ${finalHp}, ${tanggal_booking}, ${jadwal.harga}, ${statusPemesanan}, ${statusPembayaran})
      `;

      return {
        success: true,
        message:
          user.role === "admin"
            ? "Booking offline berhasil ditambahkan."
            : "Pemesanan berhasil!",
        kode_pemesanan: kode,
        is_admin: user.role === "admin",
      };
    },
    {
      body: t.Object({
        tanggal_booking: t.String(),
        id_jadwal: t.Number(),
        nama_pemesan: t.Optional(t.String()),
        email_pemesan: t.Optional(t.String()),
        nomor_hp_pemesan: t.Optional(t.String()),
      }),
    }
  )

  // GET /api/booking/konfirmasi/:kode
  .get("/konfirmasi/:kode", async ({ params, set }) => {
    const pesananRows = await sql`
      SELECT p.*, jm.jam_mulai, jm.jam_selesai
      FROM pemesanan p
      JOIN jadwal_master jm ON jm.id = p.id_jadwal_master
      WHERE p.kode_pemesanan = ${params.kode}
    `;

    if (pesananRows.length === 0) {
      set.status = 404;
      return { error: "Pesanan tidak ditemukan." };
    }

    return { pesanan: pesananRows[0] };
  })

  // POST /api/booking/simpan-pembayaran
  .post("/simpan-pembayaran", async ({ body, set }) => {
    const formData = body as any;
    const kode_pemesanan = formData.kode_pemesanan;
    const bank_tujuan = formData.bank_tujuan;
    const catatan_pembayaran = formData.catatan_pembayaran || "";
    const buktiFile = formData.bukti_pembayaran;

    if (!kode_pemesanan || !bank_tujuan || !buktiFile) {
      set.status = 400;
      return { error: "Data tidak lengkap." };
    }

    // Save file
    const uploadDir = path.join(UPLOADS_DIR, "bukti_pembayaran");
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const ext = buktiFile.name.split(".").pop() || "jpg";
    const namaFile = `bukti_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2)}.${ext}`;
    const filePath = path.join(uploadDir, namaFile);
    const buffer = await buktiFile.arrayBuffer();
    await writeFile(filePath, Buffer.from(buffer));

    await sql`
      UPDATE pemesanan
      SET bank_tujuan = ${bank_tujuan},
          catatan_pembayaran = ${catatan_pembayaran},
          bukti_pembayaran = ${namaFile},
          status_pembayaran = 'paid',
          waktu_pembayaran = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
      WHERE kode_pemesanan = ${kode_pemesanan}
    `;

    return {
      success: true,
      message:
        "Konfirmasi pembayaran berhasil dikirim. Pesanan Anda sedang ditinjau oleh admin.",
    };
  });
