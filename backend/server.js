import "dotenv/config";

import express from "express";
import cors from "cors";
import { generateCaption } from "./gemini.js";

const app = express();
const PORT = process.env.PORT || 3000;

// — Middleware —
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  methods: ["POST"],
}));
app.use(express.json());

// — Endpoint POST /api/generate —
app.post("/api/generate", async (req, res) => {
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

    // Panggil Gemini API
    const result = await generateCaption(topic.trim(), platform, tone);

    if (!result.success) {
      return res.status(500).json({ success: false, error: result.error });
    }

    return res.json({ success: true, caption: result.data });
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

app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
