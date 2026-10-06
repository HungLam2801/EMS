require("dotenv").config({ path: `${process.cwd()}/.env` });

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST;

const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

const apiRouter = require("./route/data.js");
// const solar = require("./route/solar.js");
const dbpostgres = require("./pgsql.js");

// PostgreSQL
dbpostgres
  .connection()
  .then(() => {
    console.log("Postgres connected");
  })
  .catch((err) => {
    console.log("Connection error:", err.message);
  });

// CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    optionsSuccessStatus: 200,
  }),
);

// Body parser
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", apiRouter);
// app.use("/solar", solar);

// 404
app.use((req, res) => {
  res.status(404).json({
    status: "Not Found",
    mess: "Route not found",
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,

    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

    allowedHeaders: ["Content-Type", "Authorization"],

    optionsSuccessStatus: 200,
  }),
);
// Server
app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
