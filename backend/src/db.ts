import postgres from "postgres";

const databaseUrl = process.env.DATABASE_URL || "";

const sql = postgres(databaseUrl, {
  ssl: "require",
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

export default sql;
