import { Elysia, t } from "elysia";
import sql from "../db";
import bcrypt from "bcryptjs";
import { jwtPlugin, getUserFromToken } from "../middleware/auth";
import { writeFile, mkdir, unlink } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const UPLOADS_DIR = path.join(import.meta.dir, "../uploads");

export const profilRoutes = new Elysia({ prefix: "/api/profil" })
  .use(jwtPlugin)
  .resolve(async ({ jwt, cookie }) => ({
    user: await getUserFromToken(jwt, cookie),
  }))

  // GET /api/profil
  .get("/", async ({ user, set }) => {
    if (!user) {
      set.status = 401;
      return { error: "Unauthorized" };
    }

    const users =
      await sql`SELECT id, nama_lengkap, email, role, foto_profil, created_at FROM users WHERE id = ${user.id}`;
    if (users.length === 0) {
      set.status = 404;
      return { error: "User tidak ditemukan" };
    }

    return { user: users[0] };
  })

  // POST /api/profil/update
  .post("/update", async ({ body, user, jwt, cookie: { token }, set }) => {
    if (!user) {
      set.status = 401;
      return { error: "Unauthorized" };
    }

    const formData = body as any;
    const nama_lengkap = formData.nama_lengkap;
    const email = formData.email;
    const fotoFile = formData.foto_profil;

    // Check email uniqueness
    const existing =
      await sql`SELECT id FROM users WHERE email = ${email} AND id != ${user.id}`;
    if (existing.length > 0) {
      set.status = 400;
      return { error: "Email sudah digunakan." };
    }

    // Get current user data
    const currentUsers =
      await sql`SELECT foto_profil FROM users WHERE id = ${user.id}`;
    let namaFoto = currentUsers[0]?.foto_profil || "default.png";

    // Handle file upload
    if (fotoFile && fotoFile.size > 0) {
      const uploadDir = path.join(UPLOADS_DIR, "profil");
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }

      // Delete old photo
      if (namaFoto !== "default.png") {
        const oldPath = path.join(uploadDir, namaFoto);
        if (existsSync(oldPath)) {
          await unlink(oldPath);
        }
      }

      const ext = fotoFile.name.split(".").pop() || "jpg";
      namaFoto = `profil_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2)}.${ext}`;
      const filePath = path.join(uploadDir, namaFoto);
      const buffer = await fotoFile.arrayBuffer();
      await writeFile(filePath, Buffer.from(buffer));
    }

    await sql`
      UPDATE users
      SET nama_lengkap = ${nama_lengkap}, email = ${email}, foto_profil = ${namaFoto}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${user.id}
    `;

    // Refresh JWT token with new data
    const newToken = await jwt.sign({
      id: user.id,
      nama_lengkap,
      email,
      role: user.role,
      foto_profil: namaFoto,
    });

    token.set({
      value: newToken,
      httpOnly: true,
      maxAge: 7 * 86400,
      path: "/",
      sameSite: "lax",
    });

    return {
      success: true,
      message: "Profil berhasil diperbarui.",
      user: { id: user.id, nama_lengkap, email, role: user.role, foto_profil: namaFoto },
      token: newToken,
    };
  })

  // POST /api/profil/update-password
  .post(
    "/update-password",
    async ({ body, user, set }) => {
      if (!user) {
        set.status = 401;
        return { error: "Unauthorized" };
      }

      const { password_lama, password_baru, konfirmasi_password } = body;

      if (password_baru !== konfirmasi_password) {
        set.status = 400;
        return { error: "Konfirmasi password tidak cocok." };
      }

      if (password_baru.length < 8) {
        set.status = 400;
        return { error: "Password baru minimal 8 karakter." };
      }

      // Get current password
      const users =
        await sql`SELECT password FROM users WHERE id = ${user.id}`;
      const valid = await bcrypt.compare(password_lama, users[0].password);
      if (!valid) {
        set.status = 400;
        return { error: "Password lama tidak sesuai." };
      }

      const hashed = await bcrypt.hash(password_baru, 10);
      await sql`UPDATE users SET password = ${hashed}, updated_at = CURRENT_TIMESTAMP WHERE id = ${user.id}`;

      return { success: true, message: "Password berhasil diubah." };
    },
    {
      body: t.Object({
        password_lama: t.String(),
        password_baru: t.String({ minLength: 8 }),
        konfirmasi_password: t.String(),
      }),
    }
  );
