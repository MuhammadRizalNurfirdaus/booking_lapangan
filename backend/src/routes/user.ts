import { Elysia, t } from "elysia";
import sql from "../db";
import { jwtPlugin, getUserFromToken } from "../middleware/auth";

export const userRoutes = new Elysia({ prefix: "/api/user" })
  .use(jwtPlugin)
  .resolve(async ({ jwt, cookie }) => ({
    user: await getUserFromToken(jwt, cookie),
  }))

  // GET /api/user/riwayat
  .get("/riwayat", async ({ user, set }) => {
    if (!user) {
      set.status = 401;
      return { error: "Unauthorized" };
    }

    const pemesanan = await sql`
      SELECT * FROM pemesanan
      WHERE id_user = ${user.id}
      ORDER BY created_at DESC
    `;

    return { pemesanan };
  })

  // POST /api/user/feedback
  .post(
    "/feedback",
    async ({ body, user, set }) => {
      if (!user) {
        set.status = 401;
        return { error: "Unauthorized" };
      }

      const { id_pemesanan, rating, komentar } = body;

      await sql`
        INSERT INTO feedback (id_user, id_pemesanan, komentar, rating)
        VALUES (${user.id}, ${id_pemesanan}, ${komentar}, ${rating})
      `;

      return { success: true, message: "Terima kasih atas feedback Anda!" };
    },
    {
      body: t.Object({
        id_pemesanan: t.Number(),
        rating: t.Number({ minimum: 1, maximum: 5 }),
        komentar: t.String({ minLength: 5 }),
      }),
    }
  )

  // DELETE /api/user/riwayat/:id
  .delete("/riwayat/:id", async ({ params, user, set }) => {
    if (!user) {
      set.status = 401;
      return { error: "Unauthorized" };
    }

    // Verify ownership
    const pesanan = await sql`
      SELECT id FROM pemesanan
      WHERE id = ${params.id} AND id_user = ${user.id}
    `;

    if (pesanan.length === 0) {
      set.status = 404;
      return { error: "Pesanan tidak ditemukan." };
    }

    await sql`DELETE FROM pemesanan WHERE id = ${params.id}`;
    return { success: true, message: "Riwayat pemesanan berhasil dihapus." };
  })

  // GET /api/user/struk/:kode
  .get("/struk/:kode", async ({ params, user, set }) => {
    if (!user) {
      set.status = 401;
      return { error: "Unauthorized" };
    }

    const pesananRows = await sql`
      SELECT p.*, jm.jam_mulai, jm.jam_selesai, u.nama_lengkap
      FROM pemesanan p
      JOIN jadwal_master jm ON jm.id = p.id_jadwal_master
      LEFT JOIN users u ON u.id = p.id_user
      WHERE p.kode_pemesanan = ${params.kode}
      AND p.id_user = ${user.id}
      AND p.status_pembayaran = 'paid'
    `;

    if (pesananRows.length === 0) {
      set.status = 404;
      return { error: "Struk tidak tersedia." };
    }

    return { pesanan: pesananRows[0] };
  });
