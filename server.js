const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("API Working");
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