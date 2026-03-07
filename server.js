const express = require("express");
const cors = require("cors");
const fs = require("fs");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// establish DB connection before handling any requests
connectDB().catch(err => {
  console.error("Failed to connect to database, exiting:", err);
  // if DB connection fails at startup, exit so that a restart can be attempted
  process.exit(1);
});

// expose a simple info endpoint showing which URL/port the
// app thinks it's running on (useful for health checks or debugging)
app.get("/info", (req, res) => {
  const info = {
    port: process.env.PORT || 5000,
    baseUrl: process.env.APP_URL || `http://localhost:${process.env.PORT || 5000}`,
  };
  res.json(info);
});

app.use("/api/auth", authRoutes);

// catch-all error handler (needs to come after routes)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Server error" });
});

// if a React build exists, serve it (useful in production or when testing locally)
const path = require("path");
// note: directory renamed to 'admin-panel' per project conventions
const buildPath = path.join(__dirname, "admin-panel", "build");
if (fs.existsSync(buildPath)) {
  app.use(express.static(buildPath));
  // all non-API requests should serve the React index, letting client routing handle it
  app.use((req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(buildPath, 'index.html'));
  });
} else {
  // fallback root when no build is available
  app.get("/", (req, res) => {
    res.send("API Working");
  });
}

// export app for testing
module.exports = app;

// only start server if this file is the entry point
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  const BASE_URL =
    process.env.APP_URL ||
    process.env.RENDER_EXTERNAL_URL ||
    `http://localhost:${PORT}`;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Base URL: ${BASE_URL}`);
  });
}