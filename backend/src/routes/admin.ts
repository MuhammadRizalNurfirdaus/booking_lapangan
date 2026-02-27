import { Elysia, t } from "elysia";
import sql from "../db";
import bcrypt from "bcryptjs";
import { jwtPlugin, getUserFromToken } from "../middleware/auth";
import { writeFile, mkdir, unlink } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const UPLOADS_DIR = path.join(import.meta.dir, "../uploads");

export const adminRoutes = new Elysia({ prefix: "/api/admin" })
  .use(jwtPlugin)
  .resolve(async ({ jwt, cookie, set }) => {
    const user = await getUserFromToken(jwt, cookie);
    if (!user || user.role !== "admin") {
      set.status = user ? 403 : 401;
    }
    return { user };
  })

  // ======================== DASHBOARD ========================
  .get("/dashboard", async ({ user, set }) => {
    if (!user) {
      set.status = 403;
      return { error: "Forbidden" };
    }

    const totalPesanan =
      await sql`SELECT COUNT(*) as count FROM pemesanan`;
    const pesananPending =
      await sql`SELECT COUNT(*) as count FROM pemesanan WHERE status_pemesanan = 'pending'`;
    const totalPendapatan =
      await sql`SELECT COALESCE(SUM(total_harga), 0) as total FROM pemesanan WHERE status_pembayaran = 'paid'`;
    const totalUser =
      await sql`SELECT COUNT(*) as count FROM users`;
    const totalGaleri =
      await sql`SELECT COUNT(*) as count FROM galeri`;

    return {
      total_pesanan: Number(totalPesanan[0].count),
      pesanan_pending: Number(pesananPending[0].count),
      total_pendapatan: Number(totalPendapatan[0].total),
      total_user: Number(totalUser[0].count),
      total_galeri: Number(totalGaleri[0].count),
    };
  })

  // ======================== PEMBAYARAN ========================
  .get("/pembayaran", async ({ query, user, set }) => {
    if (!user) {
      set.status = 403;
      return { error: "Forbidden" };
    }

    const keyword = query.keyword || "";
    let pemesanan;

    if (keyword) {
      pemesanan = await sql`
        SELECT p.*, u.nama_lengkap
        FROM pemesanan p
        LEFT JOIN users u ON u.id = p.id_user
        WHERE p.kode_pemesanan ILIKE ${"%" + keyword + "%"}
        OR u.nama_lengkap ILIKE ${"%" + keyword + "%"}
        ORDER BY p.created_at DESC
      `;
    } else {
      pemesanan = await sql`
        SELECT p.*, u.nama_lengkap
        FROM pemesanan p
        LEFT JOIN users u ON u.id = p.id_user
        ORDER BY p.created_at DESC
      `;
    }

    return { pemesanan };
  })

  .get("/pembayaran/detail/:id", async ({ params, user, set }) => {
    if (!user) {
      set.status = 403;
      return { error: "Forbidden" };
    }

    const pesananRows = await sql`
      SELECT p.*, jm.jam_mulai, jm.jam_selesai, u.nama_lengkap, u.email as user_email
      FROM pemesanan p
      JOIN jadwal_master jm ON jm.id = p.id_jadwal_master
      LEFT JOIN users u ON u.id = p.id_user
      WHERE p.id = ${params.id}
    `;

    if (pesananRows.length === 0) {
      set.status = 404;
      return { error: "Data tidak ditemukan." };
    }

    return { pesanan: pesananRows[0] };
  })

  .post(
    "/pembayaran/update-status",
    async ({ body, user, set }) => {
      if (!user) {
        set.status = 403;
        return { error: "Forbidden" };
      }

      const { id_pesanan, status_pembayaran, status_pemesanan } = body;

      await sql`
        UPDATE pemesanan
        SET status_pembayaran = ${status_pembayaran},
            status_pemesanan = ${status_pemesanan},
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id_pesanan}
      `;

      return { success: true, message: "Status pemesanan berhasil diperbarui." };
    },
    {
      body: t.Object({
        id_pesanan: t.Number(),
        status_pembayaran: t.String(),
        status_pemesanan: t.String(),
      }),
    }
  )

  .get("/pembayaran/cetak/:id", async ({ params, user, set }) => {
    if (!user) {
      set.status = 403;
      return { error: "Forbidden" };
    }

    const pesananRows = await sql`
      SELECT p.*, jm.jam_mulai, jm.jam_selesai, u.nama_lengkap
      FROM pemesanan p
      JOIN jadwal_master jm ON jm.id = p.id_jadwal_master
      LEFT JOIN users u ON u.id = p.id_user
      WHERE p.id = ${params.id}
    `;

    if (pesananRows.length === 0) {
      set.status = 404;
      return { error: "Data tidak ditemukan." };
    }

    return { pesanan: pesananRows[0] };
  })

  .delete("/pembayaran/:id", async ({ params, user, set }) => {
    if (!user) {
      set.status = 403;
      return { error: "Forbidden" };
    }

    const pesanan =
      await sql`SELECT bukti_pembayaran FROM pemesanan WHERE id = ${params.id}`;
    if (pesanan.length > 0 && pesanan[0].bukti_pembayaran) {
      const filePath = path.join(
        UPLOADS_DIR,
        "bukti_pembayaran",
        pesanan[0].bukti_pembayaran
      );
      if (existsSync(filePath)) {
        await unlink(filePath);
      }
    }

    await sql`DELETE FROM pemesanan WHERE id = ${params.id}`;
    return { success: true, message: "Data pemesanan berhasil dihapus." };
  })

  // ======================== JADWAL ========================
  .get("/jadwal", async ({ query, user, set }) => {
    if (!user) {
      set.status = 403;
      return { error: "Forbidden" };
    }

    const keyword = query.keyword || "";
    let jadwal;

    if (keyword) {
      jadwal = await sql`
        SELECT * FROM jadwal_master
        WHERE hari ILIKE ${"%" + keyword + "%"}
        OR CAST(jam_mulai AS TEXT) ILIKE ${"%" + keyword + "%"}
        OR CAST(harga AS TEXT) ILIKE ${"%" + keyword + "%"}
        ORDER BY jam_mulai ASC
      `;
    } else {
      jadwal =
        await sql`SELECT * FROM jadwal_master ORDER BY jam_mulai ASC`;
    }

    return { jadwal };
  })

  .post(
    "/jadwal/simpan",
    async ({ body, user, set }) => {
      if (!user) {
        set.status = 403;
        return { error: "Forbidden" };
      }

      const { id, hari, jam_mulai, jam_selesai, harga } = body;

      if (id) {
        await sql`
          UPDATE jadwal_master
          SET hari = ${hari}, jam_mulai = ${jam_mulai}, jam_selesai = ${jam_selesai}, harga = ${harga}
          WHERE id = ${id}
        `;
      } else {
        await sql`
          INSERT INTO jadwal_master (hari, jam_mulai, jam_selesai, harga)
          VALUES (${hari}, ${jam_mulai}, ${jam_selesai}, ${harga})
        `;
      }

      return { success: true, message: "Data jadwal berhasil disimpan." };
    },
    {
      body: t.Object({
        id: t.Optional(t.Number()),
        hari: t.String(),
        jam_mulai: t.String(),
        jam_selesai: t.String(),
        harga: t.Number(),
      }),
    }
  )

  .delete("/jadwal/:id", async ({ params, user, set }) => {
    if (!user) {
      set.status = 403;
      return { error: "Forbidden" };
    }

    await sql`DELETE FROM jadwal_master WHERE id = ${params.id}`;
    return { success: true, message: "Data jadwal berhasil dihapus." };
  })

  // ======================== USERS ========================
  .get("/users", async ({ query, user, set }) => {
    if (!user) {
      set.status = 403;
      return { error: "Forbidden" };
    }

    const keyword = query.keyword || "";
    let users;

    if (keyword) {
      users = await sql`
        SELECT id, nama_lengkap, email, role, foto_profil, created_at
        FROM users
        WHERE nama_lengkap ILIKE ${"%" + keyword + "%"}
        OR email ILIKE ${"%" + keyword + "%"}
        ORDER BY id DESC
      `;
    } else {
      users = await sql`
        SELECT id, nama_lengkap, email, role, foto_profil, created_at
        FROM users
        ORDER BY id DESC
      `;
    }

    return { users };
  })

  .post(
    "/users/simpan",
    async ({ body, user, set }) => {
      if (!user) {
        set.status = 403;
        return { error: "Forbidden" };
      }

      const { id, nama_lengkap, email, password, role } = body;

      // Check email uniqueness
      if (id) {
        const existing =
          await sql`SELECT id FROM users WHERE email = ${email} AND id != ${id}`;
        if (existing.length > 0) {
          set.status = 400;
          return { error: "Email sudah digunakan." };
        }
      } else {
        const existing =
          await sql`SELECT id FROM users WHERE email = ${email}`;
        if (existing.length > 0) {
          set.status = 400;
          return { error: "Email sudah digunakan." };
        }
      }

      if (id) {
        // Update
        if (password) {
          const hashed = await bcrypt.hash(password, 10);
          await sql`
            UPDATE users
            SET nama_lengkap = ${nama_lengkap}, email = ${email}, password = ${hashed}, role = ${role}, updated_at = CURRENT_TIMESTAMP
            WHERE id = ${id}
          `;
        } else {
          await sql`
            UPDATE users
            SET nama_lengkap = ${nama_lengkap}, email = ${email}, role = ${role}, updated_at = CURRENT_TIMESTAMP
            WHERE id = ${id}
          `;
        }
      } else {
        // Insert
        if (!password) {
          set.status = 400;
          return { error: "Password wajib diisi untuk pengguna baru." };
        }
        const hashed = await bcrypt.hash(password, 10);
        await sql`
          INSERT INTO users (nama_lengkap, email, password, role)
          VALUES (${nama_lengkap}, ${email}, ${hashed}, ${role})
        `;
      }

      return { success: true, message: "Data pengguna berhasil disimpan." };
    },
    {
      body: t.Object({
        id: t.Optional(t.Number()),
        nama_lengkap: t.String({ minLength: 3 }),
        email: t.String(),
        password: t.Optional(t.String()),
        role: t.String(),
      }),
    }
  )

  .delete("/users/:id", async ({ params, user, set }) => {
    if (!user) {
      set.status = 403;
      return { error: "Forbidden" };
    }

    if (Number(params.id) === user.id) {
      set.status = 400;
      return { error: "Anda tidak dapat menghapus akun Anda sendiri." };
    }

    await sql`DELETE FROM users WHERE id = ${params.id}`;
    return { success: true, message: "Pengguna berhasil dihapus." };
  })

  // ======================== GALERI ========================
  .get("/galeri", async ({ query, user, set }) => {
    if (!user) {
      set.status = 403;
      return { error: "Forbidden" };
    }

    const keyword = query.keyword || "";
    let galeri;

    if (keyword) {
      galeri = await sql`
        SELECT * FROM galeri
        WHERE judul ILIKE ${"%" + keyword + "%"}
        ORDER BY created_at DESC
      `;
    } else {
      galeri =
        await sql`SELECT * FROM galeri ORDER BY created_at DESC`;
    }

    return { galeri };
  })

  .post("/galeri/simpan", async ({ body, user, set }) => {
    if (!user) {
      set.status = 403;
      return { error: "Forbidden" };
    }

    const formData = body as any;
    const id = formData.id ? Number(formData.id) : null;
    const judul = formData.judul;
    const deskripsi = formData.deskripsi || "";
    const gambar = formData.gambar;

    if (!judul || judul.length < 3) {
      set.status = 400;
      return { error: "Judul minimal 3 karakter." };
    }

    const uploadDir = path.join(UPLOADS_DIR, "galeri");
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    if (id) {
      // Update
      const oldItems =
        await sql`SELECT nama_file FROM galeri WHERE id = ${id}`;
      let namaFile = oldItems[0]?.nama_file || "";

      if (gambar && gambar.size > 0) {
        // Delete old file
        if (namaFile && namaFile !== "default.png") {
          const oldPath = path.join(uploadDir, namaFile);
          if (existsSync(oldPath)) {
            await unlink(oldPath);
          }
        }

        const ext = gambar.name.split(".").pop() || "jpg";
        namaFile = `galeri_${Date.now()}_${Math.random()
          .toString(36)
          .slice(2)}.${ext}`;
        const filePath = path.join(uploadDir, namaFile);
        const buffer = await gambar.arrayBuffer();
        await writeFile(filePath, Buffer.from(buffer));
      }

      await sql`
        UPDATE galeri
        SET judul = ${judul}, deskripsi = ${deskripsi}, nama_file = ${namaFile}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
      `;
    } else {
      // Insert - gambar wajib
      if (!gambar || gambar.size === 0) {
        set.status = 400;
        return { error: "Gambar wajib diisi untuk data baru." };
      }

      const ext = gambar.name.split(".").pop() || "jpg";
      const namaFile = `galeri_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2)}.${ext}`;
      const filePath = path.join(uploadDir, namaFile);
      const buffer = await gambar.arrayBuffer();
      await writeFile(filePath, Buffer.from(buffer));

      await sql`
        INSERT INTO galeri (judul, deskripsi, nama_file)
        VALUES (${judul}, ${deskripsi}, ${namaFile})
      `;
    }

    return { success: true, message: "Data galeri berhasil disimpan." };
  })

  .get("/galeri/detail/:id", async ({ params, user, set }) => {
    if (!user) {
      set.status = 403;
      return { error: "Forbidden" };
    }

    const items =
      await sql`SELECT * FROM galeri WHERE id = ${params.id}`;
    if (items.length === 0) {
      set.status = 404;
      return { error: "Data tidak ditemukan." };
    }

    return items[0];
  })

  .delete("/galeri/:id", async ({ params, user, set }) => {
    if (!user) {
      set.status = 403;
      return { error: "Forbidden" };
    }

    const items =
      await sql`SELECT nama_file FROM galeri WHERE id = ${params.id}`;
    if (items.length > 0) {
      const filePath = path.join(
        UPLOADS_DIR,
        "galeri",
        items[0].nama_file
      );
      if (existsSync(filePath)) {
        await unlink(filePath);
      }
    }

    await sql`DELETE FROM galeri WHERE id = ${params.id}`;
    return { success: true, message: "Data galeri berhasil dihapus." };
  })

  // ======================== PESAN KONTAK ========================
  .get("/pesan-kontak", async ({ query, user, set }) => {
    if (!user) {
      set.status = 403;
      return { error: "Forbidden" };
    }

    const keyword = query.keyword || "";
    let pesan;

    if (keyword) {
      pesan = await sql`
        SELECT * FROM pesan_kontak
        WHERE nama_pengirim ILIKE ${"%" + keyword + "%"}
        OR email ILIKE ${"%" + keyword + "%"}
        OR pesan ILIKE ${"%" + keyword + "%"}
        ORDER BY created_at DESC
      `;
    } else {
      pesan =
        await sql`SELECT * FROM pesan_kontak ORDER BY created_at DESC`;
    }

    return { pesan };
  })

  .delete("/pesan-kontak/:id", async ({ params, user, set }) => {
    if (!user) {
      set.status = 403;
      return { error: "Forbidden" };
    }

    await sql`DELETE FROM pesan_kontak WHERE id = ${params.id}`;
    return { success: true, message: "Pesan berhasil dihapus." };
  })

  // ======================== FEEDBACK ========================
  .get("/feedback", async ({ query, user, set }) => {
    if (!user) {
      set.status = 403;
      return { error: "Forbidden" };
    }

    const keyword = query.keyword || "";
    let feedbacks;

    if (keyword) {
      feedbacks = await sql`
        SELECT f.*, u.nama_lengkap as nama_user
        FROM feedback f
        LEFT JOIN users u ON u.id = f.id_user
        WHERE u.nama_lengkap ILIKE ${"%" + keyword + "%"}
        OR f.komentar ILIKE ${"%" + keyword + "%"}
        ORDER BY f.created_at DESC
      `;
    } else {
      feedbacks = await sql`
        SELECT f.*, u.nama_lengkap as nama_user
        FROM feedback f
        LEFT JOIN users u ON u.id = f.id_user
        ORDER BY f.created_at DESC
      `;
    }

    return { feedbacks };
  })

  .delete("/feedback/:id", async ({ params, user, set }) => {
    if (!user) {
      set.status = 403;
      return { error: "Forbidden" };
    }

    await sql`DELETE FROM feedback WHERE id = ${params.id}`;
    return { success: true, message: "Feedback berhasil dihapus." };
  });
