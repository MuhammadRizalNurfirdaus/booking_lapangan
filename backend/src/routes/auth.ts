import { Elysia, t } from "elysia";
import sql from "../db";
import bcrypt from "bcryptjs";
import { jwtPlugin } from "../middleware/auth";

export const authRoutes = new Elysia({ prefix: "/api/auth" })
  .use(jwtPlugin)

  // POST /api/auth/login
  .post(
    "/login",
    async ({ body, jwt, cookie: { token }, set }) => {
      const { email, password } = body;

      const users = await sql`SELECT * FROM users WHERE email = ${email}`;
      if (users.length === 0) {
        set.status = 401;
        return { error: "Email atau password salah." };
      }

      const user = users[0];
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        set.status = 401;
        return { error: "Email atau password salah." };
      }

      const tokenValue = await jwt.sign({
        id: user.id,
        nama_lengkap: user.nama_lengkap,
        email: user.email,
        role: user.role,
        foto_profil: user.foto_profil,
      });

      token.set({
        value: tokenValue,
        httpOnly: true,
        maxAge: 7 * 86400,
        path: "/",
        sameSite: "lax",
      });

      return {
        success: true,
        message: "Login berhasil!",
        user: {
          id: user.id,
          nama_lengkap: user.nama_lengkap,
          email: user.email,
          role: user.role,
          foto_profil: user.foto_profil,
        },
        token: tokenValue,
      };
    },
    {
      body: t.Object({
        email: t.String(),
        password: t.String(),
      }),
    }
  )

  // POST /api/auth/register
  .post(
    "/register",
    async ({ body, set }) => {
      const { nama_lengkap, email, password, pass_confirm } = body;

      if (password !== pass_confirm) {
        set.status = 400;
        return { error: "Password dan konfirmasi tidak cocok." };
      }

      if (password.length < 8) {
        set.status = 400;
        return { error: "Password minimal 8 karakter." };
      }

      // Check if email exists
      const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
      if (existing.length > 0) {
        set.status = 400;
        return { error: "Email sudah terdaftar." };
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await sql`
        INSERT INTO users (nama_lengkap, email, password, role)
        VALUES (${nama_lengkap}, ${email}, ${hashedPassword}, 'user')
      `;

      return { success: true, message: "Registrasi berhasil! Silakan login." };
    },
    {
      body: t.Object({
        nama_lengkap: t.String({ minLength: 3 }),
        email: t.String(),
        password: t.String({ minLength: 8 }),
        pass_confirm: t.String(),
      }),
    }
  )

  // POST /api/auth/logout
  .post("/logout", ({ cookie: { token } }) => {
    token.set({
      value: "",
      maxAge: 0,
      path: "/",
    });
    return { success: true, message: "Logout berhasil." };
  })

  // GET /api/auth/me - Check current session
  .get("/me", async ({ jwt, cookie: { token } }) => {
    const tokenValue = String(token?.value ?? "");
    if (!tokenValue) {
      return { user: null };
    }

    const payload = await jwt.verify(tokenValue);
    if (!payload) {
      return { user: null };
    }

    // Get fresh user data from DB
    const users =
      await sql`SELECT id, nama_lengkap, email, role, foto_profil FROM users WHERE id = ${payload.id as number}`;
    if (users.length === 0) {
      return { user: null };
    }

    return { user: users[0] };
  })

  // GET /api/auth/google - Redirect to Google OAuth
  .get("/google", ({ set }) => {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;
    const scope = encodeURIComponent("openid email profile");
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri!
    )}&response_type=code&scope=${scope}&access_type=offline`;

    set.redirect = url;
  })

  // GET /api/auth/google/callback - Google OAuth callback
  .get("/google/callback", async ({ query, jwt, cookie: { token }, set }) => {
    const { code } = query;
    if (!code) {
      set.redirect = `${process.env.FRONTEND_URL}/login?error=Google login gagal`;
      return;
    }

    try {
      // Exchange code for token
      const tokenResponse = await fetch(
        "https://oauth2.googleapis.com/token",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: process.env.GOOGLE_REDIRECT_URI,
            grant_type: "authorization_code",
          }),
        }
      );

      const tokenData = (await tokenResponse.json()) as {
        access_token?: string;
        error?: string;
      };
      if (!tokenData.access_token) {
        set.redirect = `${process.env.FRONTEND_URL}/login?error=Google login gagal`;
        return;
      }

      // Get user info
      const userInfoResponse = await fetch(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: { Authorization: `Bearer ${tokenData.access_token}` },
        }
      );

      const userInfo = (await userInfoResponse.json()) as {
        id: string;
        email: string;
        name: string;
        picture?: string;
      };

      // Check if user exists by google_id or email
      let users =
        await sql`SELECT * FROM users WHERE google_id = ${userInfo.id} OR email = ${userInfo.email}`;

      let user;
      if (users.length === 0) {
        // Create new user
        const randomPass = await bcrypt.hash(
          Math.random().toString(36).slice(-10),
          10
        );
        const newUsers = await sql`
          INSERT INTO users (nama_lengkap, email, password, role, google_id, foto_profil)
          VALUES (${userInfo.name}, ${userInfo.email}, ${randomPass}, 'user', ${userInfo.id}, ${userInfo.picture || "default.png"})
          RETURNING *
        `;
        user = newUsers[0];
      } else {
        user = users[0];
        // Update google_id if not set
        if (!user.google_id) {
          await sql`UPDATE users SET google_id = ${userInfo.id} WHERE id = ${user.id}`;
        }
      }

      const jwtToken = await jwt.sign({
        id: user.id,
        nama_lengkap: user.nama_lengkap,
        email: user.email,
        role: user.role,
        foto_profil: user.foto_profil,
      });

      token.set({
        value: jwtToken,
        httpOnly: true,
        maxAge: 7 * 86400,
        path: "/",
        sameSite: "lax",
      });

      set.redirect = `${process.env.FRONTEND_URL}/auth/callback?token=${jwtToken}`;
    } catch (error) {
      console.error("Google OAuth error:", error);
      set.redirect = `${process.env.FRONTEND_URL}/login?error=Google login gagal`;
    }
  });
