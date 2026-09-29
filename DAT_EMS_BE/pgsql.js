const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const { Pool } = require("pg");

// Thay thong tin DB trong .env, khong can sua ma nguon.
const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on("error", (error) => {
  console.error("PostgreSQL pool error:", error.message);
});

// SELECT 1 khong phu thuoc bang hay function cua database.
async function checkConnection() {
  if (!process.env.DB_NAME || !process.env.DB_USER) {
    throw new Error("Please configure DB_NAME and DB_USER in .env");
  }
  await pool.query("SELECT 1");
}

module.exports = { pool, checkConnection };
