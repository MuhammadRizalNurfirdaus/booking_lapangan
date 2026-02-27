import { Elysia, t } from "elysia";
import sql from "../db";

export const homeRoutes = new Elysia({ prefix: "/api" })

  // GET /api/galeri - Get all gallery items
  .get("/galeri", async () => {
    const fotos = await sql`SELECT * FROM galeri ORDER BY created_at DESC`;
    return { fotos };
  })

  // GET /api/galeri/:id - Get gallery detail
  .get("/galeri/:id", async ({ params, set }) => {
    const items = await sql`SELECT * FROM galeri WHERE id = ${params.id}`;
    if (items.length === 0) {
      set.status = 404;
      return { error: "Data tidak ditemukan" };
    }
    return { item: items[0] };
  })

  // POST /api/kontak/kirim - Send contact message
  .post(
    "/kontak/kirim",
    async ({ body, set }) => {
      const { nama_pengirim, email, pesan } = body;

      if (pesan.length < 10) {
        set.status = 400;
        return { error: "Pesan minimal 10 karakter." };
      }

      await sql`
        INSERT INTO pesan_kontak (nama_pengirim, email, pesan)
        VALUES (${nama_pengirim}, ${email}, ${pesan})
      `;

      return {
        success: true,
        message: "Pesan Anda telah berhasil dikirim. Terima kasih!",
      };
    },
    {
      body: t.Object({
        nama_pengirim: t.String({ minLength: 3 }),
        email: t.String(),
        pesan: t.String({ minLength: 10 }),
      }),
    }
  );
