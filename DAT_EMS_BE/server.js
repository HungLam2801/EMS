const express = require("express");
const cors = require("cors");
const { pool, checkConnection } = require("./pgsql");

const app = express();
const PORT = Number(process.env.PORT || 5000);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());

if (require.main === module) {
  const server = app.listen(PORT, () => {
    console.log(`EMS backend is running at http://localhost:${PORT}`);
    checkConnection()
      .then(() => console.log("PostgreSQL connected successfully"))
      .catch((error) => {
        console.error("PostgreSQL connection error:", error.message);
        console.log("Update .env and restart to connect to your database.");
      });
  });

  server.on("error", async (error) => {
    console.error("Server error:", error.message);
    await pool.end();
    process.exitCode = 1;
  });

  let shuttingDown = false;
  function shutdown() {
    if (shuttingDown) return;
    shuttingDown = true;
    const timeout = setTimeout(() => process.exit(1), 10000);
    timeout.unref();
    server.close(async () => {
      try {
        await pool.end();
      } catch (error) {
        console.error("Shutdown error:", error.message);
        process.exitCode = 1;
      } finally {
        clearTimeout(timeout);
      }
    });
  }
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

module.exports = app;
