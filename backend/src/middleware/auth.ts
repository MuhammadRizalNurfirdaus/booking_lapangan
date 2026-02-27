import { Elysia } from "elysia";
import jwt from "@elysiajs/jwt";

export interface UserPayload {
  id: number;
  nama_lengkap: string;
  email: string;
  role: string;
  foto_profil: string;
}

// JWT plugin instance shared across routes
export const jwtPlugin = new Elysia({ name: "jwt" }).use(
  jwt({
    name: "jwt",
    secret: process.env.JWT_SECRET || "booking-lapangan-secret",
    exp: "7d",
  })
);

// Helper to extract user from JWT cookie
export async function getUserFromToken(
  jwtInstance: { verify: (token: string) => Promise<any> },
  cookie: Record<string, any>
): Promise<UserPayload | null> {
  const tokenValue = String(cookie?.token?.value ?? "");
  if (!tokenValue) return null;

  const payload = await jwtInstance.verify(tokenValue);
  if (!payload) return null;

  return {
    id: payload.id as number,
    nama_lengkap: payload.nama_lengkap as string,
    email: payload.email as string,
    role: payload.role as string,
    foto_profil: payload.foto_profil as string,
  };
}

// Middleware to verify authentication - injects user into context
export const authMiddleware = new Elysia({ name: "authMiddleware" })
  .use(jwtPlugin)
  .derive(async ({ jwt, cookie, set }) => {
    const user = await getUserFromToken(jwt, cookie);
    if (!user) {
      set.status = 401;
    }
    return { user } as { user: UserPayload | null };
  });

// Middleware to verify admin role
export const adminMiddleware = new Elysia({ name: "adminMiddleware" })
  .use(jwtPlugin)
  .derive(async ({ jwt, cookie, set }) => {
    const user = await getUserFromToken(jwt, cookie);
    if (!user) {
      set.status = 401;
      return { user } as { user: UserPayload | null };
    }
    if (user.role !== "admin") {
      set.status = 403;
      return { user: null } as { user: UserPayload | null };
    }
    return { user } as { user: UserPayload | null };
  });
