import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

function buildPrompt(topic, platform, tone) {
  const platformGuides = {
    Instagram: "caption aesthetic, engaging, dengan 3-5 hashtag relevan. Gunakan 1-3 emoji. Style: storytelling singkat.",
    X: "caption singkat, to the point, maksimal 280 karakter. 1-2 hashtag. Style: witty atau insightful.",
    Facebook: "caption naratif dan memancing interaksi. Ajak diskusi dengan pertanyaan di akhir. 2-3 hashtag.",
    LinkedIn: "caption profesional, insight-driven, dengan value proposition yang jelas. Akhiri dengan call-to-action. 1-2 hashtag.",
  };

  const toneGuides = {
    Santai: "bahasa santai, ramah, seperti ngobrol dengan teman.",
    Formal: "bahasa baku dan sopan, sesuai untuk konteks resmi.",
    Lucu: "humor ringan, puns, dan gaya yang menghibur.",
    Profesional: "bahasa profesional, objektif, dan terstruktur.",
  };

  return `Kamu adalah mesin generator teks sosial media. Tugasmu HANYA menghasilkan caption.

ATURAN KETAT:
1. DILARANG KERAS memberikan sapaan (seperti "Halo!", "Berikut adalah...", dll).
2. DILARANG memberikan penjelasan, komentar, atau basa-basi apapun di awal maupun di akhir.
3. DILARANG memberikan deskripsi "Fokus" pada masing-masing opsi.
4. Output HARUS langsung berupa caption.

FORMAT OUTPUT YANG DIWAJIBKAN:
Opsi 1:
[Isi caption pertama di sini beserta hashtag dan emoji]

Opsi 2:
[Isi caption kedua di sini beserta hashtag dan emoji]

KONTEKS POSTINGAN:
- Platform: ${platformGuides[platform] || platform}
- Gaya Bahasa: ${toneGuides[tone] || tone}
- Topik: ${topic}`;
}

export async function generateCaption(topic, platform, tone) {
  try {
    const prompt = buildPrompt(topic, platform, tone);

    const response = await genAI.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        temperature: 0.9,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });

    const text = response.text;

    if (!text) {
      return { success: false, error: "AI mengembalikan respons kosong." };
    }

    return { success: true, data: text.trim() };
  } catch (error) {
    console.error("Gemini API Error:", error.message);

    if (error.message?.includes("API_KEY_INVALID")) {
      return {
        success: false,
        error:
          "API Key tidak valid. Periksa GEMINI_API_KEY di file .env Anda.",
      };
    }
    if (error.message?.includes("SAFETY")) {
      return {
        success: false,
        error:
          "Konten tidak dapat diproses karena kebijakan keamanan. Coba dengan topik lain.",
      };
    }
    if (error.message?.includes("quota")) {
      return {
        success: false,
        error: "Kuota API habis. Tunggu beberapa saat atau upgrade akun Gemini Anda.",
      };
    }

    return {
      success: false,
      error: `Gagal menghasilkan caption: ${error.message}`,
    };
  }
}