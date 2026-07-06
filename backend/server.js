import "dotenv/config";

import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import { generateCaption } from "./gemini.js";

const app = express();
const PORT = process.env.PORT || 3000;

// — HTTP Request Logger —
app.use(morgan("dev"));

// — Rate Limiter —
// Membatasi request untuk mencegah abuse API key
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 20, // maksimal 20 request per IP dalam 15 menit
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Terlalu banyak permintaan pembuatan caption dari perangkat ini. Silakan coba lagi dalam 15 menit.",
  },
});

// — Middleware —
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  methods: ["POST", "GET"],
}));
app.use(express.json());

// — Endpoint POST /api/generate (with rate-limiting) —
app.post("/api/generate", apiLimiter, async (req, res) => {
  try {
    const { topic, platform, tone } = req.body;

    // Validasi input
    if (!topic || !platform || !tone) {
      return res.status(400).json({
        success: false,
        error: "Semua field (topic, platform, tone) wajib diisi.",
      });
    }

    if (typeof topic !== "string" || topic.trim().length < 3) {
      return res.status(400).json({
        success: false,
        error: "Topik minimal 3 karakter.",
      });
    }

    const validPlatforms = ["Instagram", "X", "Facebook", "LinkedIn"];
    const validTones = ["Santai", "Formal", "Lucu", "Profesional"];

    if (!validPlatforms.includes(platform)) {
      return res.status(400).json({
        success: false,
        error: `Platform tidak valid. Pilih: ${validPlatforms.join(", ")}`,
      });
    }
    if (!validTones.includes(tone)) {
      return res.status(400).json({
        success: false,
        error: `Gaya bahasa tidak valid. Pilih: ${validTones.join(", ")}`,
      });
    }

    // Panggil Gemini API yang telah refaktor dengan structured output
    const result = await generateCaption(topic.trim(), platform, tone);

    if (!result.success) {
      return res.status(500).json({ success: false, error: result.error });
    }

    // Mengembalikan array opsi caption yang terstruktur
    return res.json({ success: true, captions: result.data });
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({
      success: false,
      error: "Terjadi kesalahan internal server.",
    });
  }
});

// — Health Check —
app.get("/", (_req, res) => {
  res.json({ status: "ok", service: "Smart Caption Generator API" });
});

// — 404 Handler —
app.use((_req, res) => {
  res.status(404).json({ success: false, error: "Endpoint tidak ditemukan." });
});

// — Error Handler Middleware —
app.use((err, _req, res, _next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({
    success: false,
    error: "Terjadi kesalahan sistem yang tidak terduga.",
  });
});

// Hanya jalankan app.listen jika tidak berjalan di Vercel (Serverless Function)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Backend running at http://localhost:${PORT}`);
  });
}

export default app;
