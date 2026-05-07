const express = require("express");

const authRoutes = require("./routes/authroute");
const cityRoutes = require("./routes/cityroute");
const insightRoutes = require("./routes/insightroute");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

const isAllowedOrigin = (origin) => {
  if (!origin) {
    return true;
  }

  if (allowedOrigins.includes(origin)) {
    return true;
  }

  try {
    const { hostname } = new URL(origin);
    return ["localhost", "127.0.0.1"].includes(hostname);
  } catch (error) {
    return false;
  }
};

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (isAllowedOrigin(origin)) {
    res.header("Access-Control-Allow-Origin", origin || "*");
  }

  res.header("Vary", "Origin");
  res.header("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  return next();
});

app.use((req, res, next) => {
  res.header("X-Content-Type-Options", "nosniff");
  res.header("X-Frame-Options", "DENY");
  res.header("Referrer-Policy", "no-referrer");
  next();
});

app.use(express.json({ limit: "1mb" }));

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Weather dashboard API is running",
    version: "1.0.0",
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "healthy" });
});

app.use("/api/auth", authRoutes);
app.use("/api/cities", cityRoutes);
app.use("/api/insights", insightRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
