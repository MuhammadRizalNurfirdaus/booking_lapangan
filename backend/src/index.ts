import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { staticPlugin } from "@elysiajs/static";
import path from "path";

import { authRoutes } from "./routes/auth";
import { homeRoutes } from "./routes/home";
import { bookingRoutes } from "./routes/booking";
import { profilRoutes } from "./routes/profil";
import { userRoutes } from "./routes/user";
import { adminRoutes } from "./routes/admin";

const PORT = Number(process.env.PORT) || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const app = new Elysia()
  // CORS for frontend
  .use(
    cors({
      origin: FRONTEND_URL,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  )
  // Serve uploaded files
  .use(
    staticPlugin({
      assets: path.join(import.meta.dir, "uploads"),
      prefix: "/uploads",
    })
  )
  // Register all routes
  .use(authRoutes)
  .use(homeRoutes)
  .use(bookingRoutes)
  .use(profilRoutes)
  .use(userRoutes)
  .use(adminRoutes)
  // Health check
  .get("/api/health", () => ({ status: "ok", timestamp: new Date().toISOString() }))
  .listen(PORT);

console.log(`🚀 Backend running at http://localhost:${PORT}`);
