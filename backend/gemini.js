import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// List model cadangan jika model utama sibuk (High Demand)
const MODELS = ["gemini-3.5-flash", "gemini-2.5-flash", "gemini-1.5-flash"];
const MAX_RETRIES = 2; // Jumlah percobaan ulang jika terjadi error temporer

// Helper jeda waktu
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// System instruction to guide the AI Copywriter role
const systemInstruction = `Kamu adalah seorang AI Copywriter profesional dan Spesialis Pemasaran Media Sosial tingkat tinggi. 
Tugasmu adalah menghasilkan caption promosi, interaksi, atau edukasi sosial media yang memukau dan persuasif berdasarkan topik, platform, dan tone yang diberikan.

Kamu harus menghasilkan 3 opsi caption yang berbeda untuk topik tersebut menggunakan framework penulisan pemasaran yang bervariasi:
1. Opsi AIDA (Attention, Interest, Desire, Action): Fokus menarik perhatian, memicu minat, membangkitkan keinginan, dan mengakhiri dengan ajakan bertindak yang jelas.
2. Opsi PAS (Problem, Agitate, Solve): Fokus mengidentifikasi masalah utama pembaca, mengagitasi masalah tersebut agar terasa mendesak, kemudian menyajikan solusi Anda sebagai jalan keluar terbaik.
3. Opsi Storytelling / Punchy: Untuk LinkedIn/FB/IG gunakan storytelling naratif emosional yang engaging. Untuk platform X, gunakan gaya punchy/witty singkat yang langsung ke pokok permasalahan.

ATURAN KETAT:
- Teks caption utama tidak boleh mengandung hashtag. Semua hashtag harus diletakkan terpisah di dalam array "hashtags" di JSON output.
- Semua emoji harus disisipkan secara natural di dalam teks caption utama.
- Berikan penjelasan singkat tentang hook (taktik pembuka) yang kamu gunakan untuk masing-masing opsi pada field "hook".`;

function buildPrompt(topic, platform, tone) {
  const platformGuides = {
    Instagram: "Fokus pada estetika visual, gaya bahasa engaging dan kasual, storytelling visual singkat.",
    X: "Sangat singkat, padat, langsung ke inti pesan. Maksimal 280 karakter per opsi.",
    Facebook: "Gaya ramah, naratif, mengundang diskusi/interaksi dari audiens komunitas.",
    LinkedIn: "Profesional, bermutu tinggi, berorientasi pada wawasan (insight-driven), karir, dan industri.",
  };

  const toneGuides = {
    Santai: "Bahasa santai, akrab, seperti mengobrol dengan teman dekat, sering menggunakan kata ganti santai.",
    Formal: "Bahasa baku, sopan, tata bahasa baik dan benar (PUEBI/EBI), formal.",
    Lucu: "Humor ringan, permainan kata (puns), santai, menghibur, dan memancing tawa.",
    Profesional: "Berwibawa, objektif, kredibel, percaya diri, dan edukatif.",
  };

  return `Hasilkan caption untuk:
- Platform: ${platform} (${platformGuides[platform]})
- Gaya Bahasa/Tone: ${tone} (${toneGuides[tone]})
- Topik Utama: ${topic}`;
}

const responseSchema = {
  type: "OBJECT",
  properties: {
    captions: {
      type: "ARRAY",
      description: "Daftar 3 opsi caption alternatif dengan framework berbeda",
      items: {
        type: "OBJECT",
        properties: {
          text: {
            type: "STRING",
            description: "Isi caption lengkap beserta emoji terintegrasi secara natural. Jangan masukkan hashtag di sini."
          },
          framework: {
            type: "STRING",
            description: "Nama framework penulisan, contoh: 'AIDA', 'PAS', 'Storytelling'"
          },
          hook: {
            type: "STRING",
            description: "Penjelasan singkat mengenai formula hook pembuka yang digunakan pada caption ini"
          },
          hashtags: {
            type: "ARRAY",
            items: {
              type: "STRING"
            },
            description: "Daftar 3-5 hashtag relevan tanpa menyertakan karakter #"
          }
        },
        required: ["text", "framework", "hook", "hashtags"]
      }
    }
  },
  required: ["captions"]
};

// Helper penerjemah error spesifik
function handleSpecificErrors(error) {
  const errorMsg = error.message || "";
  if (errorMsg.includes("API_KEY_INVALID")) {
    return {
      success: false,
      error: "API Key tidak valid. Periksa GEMINI_API_KEY di file .env Anda.",
    };
  }
  if (errorMsg.includes("SAFETY")) {
    return {
      success: false,
      error: "Konten tidak dapat diproses karena kebijakan keamanan. Coba dengan topik lain.",
    };
  }
  if (errorMsg.includes("quota")) {
    return {
      success: false,
      error: "Kuota API habis. Tunggu beberapa saat atau hubungi administrator.",
    };
  }
  return {
    success: false,
    error: `Gagal menghasilkan caption: ${errorMsg}`,
  };
}

export async function generateCaption(topic, platform, tone) {
  const prompt = buildPrompt(topic, platform, tone);

  // Mencoba model satu per satu dari daftar cadangan
  for (const modelName of MODELS) {
    let retries = 0;
    
    while (retries <= MAX_RETRIES) {
      try {
        console.log(`[Gemini API] Mengirim permintaan ke model: ${modelName} (Percobaan ke-${retries + 1})...`);
        const response = await genAI.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            systemInstruction: systemInstruction,
            responseMimeType: "application/json",
            responseSchema: responseSchema,
            temperature: 0.85,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
        });

        const text = response.text;
        if (!text) {
          throw new Error("AI mengembalikan respons kosong.");
        }

        const parsedData = JSON.parse(text);
        console.log(`[Gemini API] Sukses mendapatkan respon menggunakan model: ${modelName}`);
        return { success: true, data: parsedData.captions };

      } catch (error) {
        const errorMsg = error.message || "";
        console.warn(`[Gemini API Warning] Error pada model ${modelName} (Percobaan ${retries + 1}/${MAX_RETRIES + 1}):`, errorMsg);

        // Jika error non-temporer (seperti api key tidak valid, quota habis, keamanan), langsung kembalikan error
        if (errorMsg.includes("API_KEY_INVALID") || errorMsg.includes("SAFETY") || errorMsg.includes("quota")) {
          return handleSpecificErrors(error);
        }

        // Cek apakah error temporer seperti High Demand (503), Unavailable, Network timeout dll.
        const isTemporaryError = 
          errorMsg.includes("503") || 
          errorMsg.includes("UNAVAILABLE") || 
          errorMsg.includes("demand") || 
          errorMsg.includes("fetch") || 
          errorMsg.includes("network");

        if (isTemporaryError && retries < MAX_RETRIES) {
          retries++;
          const waitTime = retries * 1500; // Jeda bertahap (1.5s, 3.0s) sebelum coba ulang
          console.log(`[Gemini API] Model sibuk/terjadi error temporer. Menunggu ${waitTime}ms sebelum mencoba ulang...`);
          await delay(waitTime);
          continue;
        }

        // Jika sudah melebihi batas retry untuk model ini, coba model cadangan berikutnya
        break;
      }
    }
  }

  // Jika semua model cadangan gagal
  return {
    success: false,
    error: "Semua model AI saat ini sedang sibuk (high demand). Silakan coba beberapa saat lagi.",
  };
}