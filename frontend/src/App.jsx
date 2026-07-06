import { useState, useEffect, useCallback, useRef } from "react";
import { 
  Sparkles, 
  Copy, 
  Check, 
  Trash2, 
  Clock, 
  RotateCcw, 
  Lightbulb, 
  AlertCircle,
  BookOpen
} from "lucide-react";

// Import modular components
import { Toast } from "./components/Toast";
import { LoadingSkeleton } from "./components/LoadingSkeleton";
import { PlatformMockup } from "./components/PlatformMockup";
import { PlatformIcon, XIcon, InstagramIcon, FacebookIcon, LinkedInIcon } from "./components/SocialIcons";

// — Data opsi dropdown —
const PLATFORMS = ["Instagram", "X", "Facebook", "LinkedIn"];
const TONES = ["Santai", "Formal", "Lucu", "Profesional"];

// Batas karakter per platform
const CHAR_LIMITS = {
  Instagram: null, // Tidak ada batas ketat
  X: 280,
  Facebook: 63206,
  LinkedIn: 3000,
};

// Ide topik saran
const TOPIC_SUGGESTIONS = [
  "Tips produktivitas kerja",
  "Kegiatan akhir pekan",
  "Review buku terbaru",
  "Motivasi hari Senin",
  "Wisata kuliner lokal",
  "Tips belajar efektif",
  "Pengalaman traveling",
  "Inspirasi bisnis kecil",
];

// Nama key localStorage
const HISTORY_KEY = "caption_history";

// — Load riwayat dari localStorage —
function loadHistory() {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// Helper to format copyable text with hashtags
const getFullCaptionText = (captionObj) => {
  if (!captionObj) return "";
  const hashtags = captionObj.hashtags || [];
  const hashtagStr = hashtags.length > 0 
    ? "\n\n" + hashtags.map(h => `#${h.replace(/#/g, "").trim()}`).join(" ")
    : "";
  return `${captionObj.text}${hashtagStr}`;
};

/* ===== Komponen Utama ===== */
export default function App() {
  const [form, setForm] = useState({
    topic: "",
    platform: "Instagram",
    tone: "Santai",
  });
  const [captions, setCaptions] = useState([]);
  const [activeOption, setActiveOption] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState(() => loadHistory());
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });
  const [showSuggestions, setShowSuggestions] = useState(true);
  const textareaRef = useRef(null);
  const resultRef = useRef(null);

  // Simpan riwayat ke localStorage setiap berubah
  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  // Current active caption data
  const currentCaption = captions[activeOption];
  const fullTextToCopy = currentCaption ? getFullCaptionText(currentCaption) : "";
  const captionLength = fullTextToCopy.length;
  const charLimit = CHAR_LIMITS[form.platform];

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = Math.min(ta.scrollHeight, 200) + "px";
    }
  }, [form.topic]);

  // Scroll ke hasil saat caption muncul
  useEffect(() => {
    if (captions.length > 0 && resultRef.current) {
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [captions]);

  // Toast helper
  const showToast = useCallback((message, type = "success") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ visible: false, message: "", type: "success" }), 3000);
  }, []);

  // Handler input
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  // Custom Platform Change handler
  const handlePlatformChange = (platform) => {
    setForm((prev) => ({ ...prev, platform }));
    setError("");
  };

  // Custom Tone Change handler
  const handleToneChange = (tone) => {
    setForm((prev) => ({ ...prev, tone }));
    setError("");
  };

  // Pilih saran topik
  const handleSuggestionClick = (suggestion) => {
    setForm((prev) => ({ ...prev, topic: suggestion }));
    setShowSuggestions(false);
    setError("");
  };

  // Submit ke backend
  const handleGenerate = async (e) => {
    e?.preventDefault();
    if (!form.topic.trim()) {
      setError("Silakan masukkan topik konten terlebih dahulu.");
      textareaRef.current?.focus();
      return;
    }

    setLoading(true);
    setError("");
    setCaptions([]);
    setActiveOption(0);
    setCopied(false);
    setShowSuggestions(false);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || "Gagal menghasilkan caption.");
      } else {
        setCaptions(data.captions);
        setActiveOption(0);
        
        // Tambahkan ke riwayat (paling baru di atas)
        setHistory((prev) => {
          const newEntry = {
            id: Date.now(),
            captions: data.captions, // Store full array of captions
            topic: form.topic,
            platform: form.platform,
            tone: form.tone,
            timestamp: new Date().toLocaleString("id-ID"),
          };
          return [newEntry, ...prev].slice(0, 20); // Simpan max 20
        });
      }
    } catch {
      setError("Gagal terhubung ke server. Pastikan backend sudah berjalan.");
    } finally {
      setLoading(false);
    }
  };

  // Copy ke clipboard
  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      showToast("Caption & Hashtags tersalin ke clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      showToast("Caption & Hashtags tersalin ke clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Hapus satu riwayat
  const handleDeleteHistory = (id) => {
    setHistory((prev) => prev.filter((h) => h.id !== id));
    showToast("Riwayat berhasil dihapus.", "info");
  };

  // Hapus semua riwayat
  const handleClearHistory = () => {
    if (window.confirm("Hapus semua riwayat caption?")) {
      setHistory([]);
      showToast("Semua riwayat berhasil dihapus.", "info");
    }
  };

  // Muat ulang caption dari riwayat
  const handleReuse = (entry) => {
    // Backwards compatibility if old history exists
    const entryCaptions = entry.captions || [
      { text: entry.caption, framework: "Legacy", hook: "Formula Bawaan", hashtags: [] }
    ];
    
    setCaptions(entryCaptions);
    setActiveOption(0);
    setForm({ topic: entry.topic, platform: entry.platform, tone: entry.tone });
    setShowSuggestions(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Keyboard shortcut: Ctrl+Enter untuk generate
  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === "Enter") {
      handleGenerate();
    }
  };

  return (
    <div 
      className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200 relative overflow-x-hidden pb-16" 
      onKeyDown={handleKeyDown}
    >
      {/* Background Decorative Radial Glows */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-teal-600/5 rounded-full blur-[90px] pointer-events-none" />

      {/* Toast Notification */}
      <Toast message={toast.message} type={toast.type} visible={toast.visible} />

      <main className="container mx-auto px-4 max-w-5xl pt-12">
        {/* ===== Header ===== */}
        <header className="text-center mb-10 space-y-4">
          <div className="inline-flex p-3.5 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl shadow-inner relative group hover:border-indigo-500/40 transition-colors duration-300">
            <Sparkles className="w-8 h-8 text-indigo-400 group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute inset-0 bg-indigo-500/5 blur-md rounded-2xl -z-10" />
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-indigo-300 leading-tight">
            Smart Social Media Caption Generator
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto font-light leading-relaxed">
            Hasilkan 3 opsi caption pemasaran persuasif dengan bantuan AI terstruktur (AIDA, PAS, & Storytelling) untuk berbagai platform sosial media.
          </p>
        </header>

        {/* ===== Main Dashboard Layout (Grid) ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Generator Controls & Form (7 columns on desktop) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Form Container */}
            <form onSubmit={handleGenerate} className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 transition-all duration-300 focus-within:border-slate-700/80">
              
              {/* Form Input Group */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-semibold text-slate-400 tracking-wider uppercase">
                  <label htmlFor="topic" className="flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-indigo-400" />
                    Topik / Ide Konten
                  </label>
                  <span className="text-[10px] text-slate-500 normal-case font-normal">Tekan Ctrl+Enter untuk kirim</span>
                </div>
                
                <textarea
                  ref={textareaRef}
                  id="topic"
                  name="topic"
                  value={form.topic}
                  onChange={handleChange}
                  placeholder="Contoh: Tips produktivitas kerja di era digital..."
                  rows={3}
                  className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 resize-none min-h-[90px] overflow-hidden leading-relaxed"
                  required
                />
              </div>

              {/* Topic Suggestions Pills */}
              {showSuggestions && (
                <div className="space-y-2.5">
                  <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                    💡 Rekomendasi topik:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {TOPIC_SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white hover:bg-indigo-950/40 hover:border-indigo-500/40 active:scale-95 transition-all duration-200"
                        onClick={() => handleSuggestionClick(s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Platform Selector Cards */}
              <div className="space-y-3">
                <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase block">
                  Pilih Platform Sosial Media
                </span>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {PLATFORMS.map((p) => {
                    const isSelected = form.platform === p;
                    const borderColors = {
                      Instagram: "hover:border-pink-500/50 hover:bg-pink-500/5 border-pink-500/50 bg-pink-500/5 text-pink-400",
                      X: "hover:border-white/50 hover:bg-white/5 border-white/50 bg-white/5 text-white",
                      Facebook: "hover:border-blue-500/50 hover:bg-blue-500/5 border-blue-500/50 bg-blue-500/5 text-blue-400",
                      LinkedIn: "hover:border-sky-500/50 hover:bg-sky-500/5 border-sky-500/5 bg-sky-500/5 text-sky-400",
                    };
                    
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => handlePlatformChange(p)}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold tracking-wide transition-all duration-200 gap-2 ${
                          isSelected 
                            ? borderColors[p] + " ring-1 ring-offset-2 ring-offset-slate-950 ring-indigo-500/20" 
                            : "border-slate-800 bg-slate-950/40 text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        <PlatformIcon platform={p} className="w-5 h-5" />
                        <span>{p}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tone Selection Group */}
              <div className="space-y-3">
                <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase block">
                  Gaya Bahasa (Tone)
                </span>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {TONES.map((t) => {
                    const isSelected = form.tone === t;
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => handleToneChange(t)}
                        className={`px-4 py-2.5 rounded-lg border text-xs font-medium transition-all duration-200 ${
                          isSelected 
                            ? "border-indigo-500 bg-indigo-500/10 text-indigo-300 font-semibold" 
                            : "border-slate-850 bg-slate-950/40 text-slate-400 hover:border-slate-800 hover:text-slate-200"
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                className="w-full py-3.5 px-6 rounded-xl font-bold text-sm tracking-wide text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 active:scale-[0.99] disabled:opacity-75 disabled:cursor-not-allowed hover:shadow-[0_0_24px_rgba(99,102,241,0.4)] transition-all duration-300 flex items-center justify-center gap-2 group relative overflow-hidden" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Memproses Opsi Caption...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-indigo-200 group-hover:rotate-12 transition-transform" />
                    <span>Hasilkan Caption AI</span>
                    <kbd className="hidden sm:inline-block text-[10px] bg-white/10 px-2 py-0.5 rounded border border-white/10 font-normal opacity-80 ml-2">
                      Ctrl + ↵
                    </kbd>
                  </>
                )}
              </button>
            </form>

            {/* Error Message Panel */}
            {error && (
              <div className="bg-rose-950/30 border border-rose-500/30 rounded-xl p-4 text-rose-300 text-sm flex items-center gap-3 animate-fadeInUp">
                <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Loading Skeleton */}
            {loading && <LoadingSkeleton />}
          </div>

          {/* RIGHT: Live Preview Mockup & Generated Output (5 columns on desktop) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Live Mockup Post Card */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400 tracking-wider uppercase">
                <span>Pratinjau Live Post</span>
                <span className="text-[10px] text-slate-500 normal-case font-normal flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Sinkron
                </span>
              </div>
              
              <PlatformMockup 
                platform={form.platform} 
                tone={form.tone} 
                captionObj={currentCaption} 
              />
            </div>

            {/* Generated Caption Options Selector & Content */}
            {captions.length > 0 && !loading && (
              <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-fadeInUp space-y-4 p-5">
                
                {/* Visual Option Selector Tabs */}
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Pilih Alternatif Penulisan</span>
                  <div className="flex gap-2 p-1 bg-slate-950 rounded-xl border border-slate-850">
                    {captions.map((cap, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setActiveOption(idx);
                          setCopied(false);
                        }}
                        className={`flex-1 py-2 px-1 text-center rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 ${
                          activeOption === idx
                            ? "bg-indigo-600 text-white shadow-lg"
                            : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                        }`}
                      >
                        {cap.framework}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Analysis/Hook Banner */}
                {currentCaption?.hook && (
                  <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-xl p-3.5 text-xs text-indigo-300/90 leading-relaxed flex gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-indigo-200 block mb-0.5 font-bold">Hook Strategi ({currentCaption.framework}):</strong>
                      {currentCaption.hook}
                    </div>
                  </div>
                )}

                {/* Output Box Header */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Konten & Tag</span>
                  <button
                    onClick={() => handleCopy(fullTextToCopy)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 ${
                      copied 
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-300" 
                        : "border-slate-850 bg-slate-950 text-slate-400 hover:text-slate-200 hover:border-slate-850"
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Teks Lengkap</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Character Counter Progress Bar */}
                {charLimit ? (
                  <div className="bg-slate-950/40 rounded-xl p-3 text-xs border border-slate-850">
                    <div className="flex justify-between text-slate-400 font-semibold mb-1 text-[10px]">
                      <span>Karakter Terpakai:</span>
                      <span className={`${
                        captionLength > charLimit 
                          ? "text-rose-400" 
                          : captionLength > charLimit * 0.9 
                          ? "text-amber-400" 
                          : "text-emerald-400"
                      }`}>
                        {captionLength} / {charLimit.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${
                          captionLength > charLimit 
                            ? "bg-rose-500" 
                            : captionLength > charLimit * 0.9 
                            ? "bg-amber-500" 
                            : "bg-gradient-to-r from-emerald-500 to-indigo-500"
                        }`}
                        style={{ width: `${Math.min((captionLength / charLimit) * 100, 100)}%` }}
                      />
                    </div>
                    {captionLength > charLimit && (
                      <p className="text-[10px] text-rose-400 mt-1.5 font-medium flex items-center gap-1 animate-pulse">
                        ⚠️ Melebihi batas ketat platform {form.platform}!
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="bg-slate-950/40 rounded-xl px-3 py-2 text-[10px] text-slate-400 font-semibold border border-slate-850">
                    Total Karakter: <span className="text-slate-200 font-bold">{captionLength}</span> (Tanpa batas ketat Instagram)
                  </div>
                )}

                {/* Actual Generated Text Box */}
                <div className="bg-slate-950/70 border border-slate-850/60 rounded-xl p-4 text-sm leading-relaxed text-slate-200 font-light whitespace-pre-wrap max-h-[220px] overflow-y-auto selection:bg-indigo-500/30">
                  {currentCaption?.text}
                </div>

                {/* Interactive Hashtag Chips */}
                {currentCaption?.hashtags?.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Tagar Terkait</span>
                    <div className="flex flex-wrap gap-1.5">
                      {currentCaption.hashtags.map((tag, tIdx) => (
                        <span 
                          key={tIdx} 
                          className="px-2 py-1 bg-slate-950 text-indigo-300 rounded border border-slate-850 text-xs font-medium cursor-default"
                        >
                          #{tag.replace(/#/g, "")}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Direct Share Options */}
                <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-850/60 flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-[11px]">Buka Platform:</span>
                  <div className="flex gap-2">
                    <a 
                      href="https://www.instagram.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-pink-500/10 hover:border-pink-500/30 hover:text-pink-400 transition-colors"
                      title="Buka Instagram"
                    >
                      <InstagramIcon className="w-4 h-4" />
                    </a>
                    <a 
                      href="https://www.facebook.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-blue-500/10 hover:border-blue-500/30 hover:text-blue-400 transition-colors"
                      title="Buka Facebook"
                    >
                      <FacebookIcon className="w-4 h-4" />
                    </a>
                    <a 
                      href="https://x.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800 hover:border-slate-600 hover:text-white transition-colors"
                      title="Buka X (Twitter)"
                    >
                      <XIcon className="w-4 h-4" />
                    </a>
                    <a 
                      href="https://www.linkedin.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-sky-500/10 hover:border-sky-500/30 hover:text-sky-400 transition-colors"
                      title="Buka LinkedIn"
                    >
                      <LinkedInIcon className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ===== Riwayat Section (Historical Generated Captions) ===== */}
        <section className="mt-12">
          {history.length > 0 ? (
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl shadow-2xl overflow-hidden animate-fadeInUp">
              {/* History Header */}
              <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800/80 bg-slate-950/20">
                <h2 className="text-sm sm:text-base font-bold text-slate-200 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-400" />
                  Riwayat Caption
                  <span className="px-2 py-0.5 text-[10px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-full font-bold">
                    {history.length}
                  </span>
                </h2>
                <button 
                  className="px-3 py-1.5 rounded-lg border border-rose-500/20 hover:border-rose-500 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 active:scale-95 transition-all duration-200 flex items-center gap-1"
                  onClick={handleClearHistory}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus Semua</span>
                </button>
              </div>

              {/* History List */}
              <div className="divide-y divide-slate-800/60 max-h-[480px] overflow-y-auto">
                {history.map((entry, index) => {
                  // Graceful handle of backward compatibility
                  const entryCaptions = entry.captions || [
                    { text: entry.caption, framework: "Standar", hook: "Formula Bawaan", hashtags: [] }
                  ];
                  const primaryCaption = entryCaptions[0];
                  const primaryFullText = getFullCaptionText(primaryCaption);

                  return (
                    <div 
                      key={entry.id} 
                      className="p-4 sm:p-5 hover:bg-slate-800/20 transition-colors duration-200 flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                    >
                      <div className="space-y-2 max-w-3xl">
                        {/* Meta Tags */}
                        <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold tracking-wide">
                          <span className="px-2.5 py-0.5 rounded-md bg-slate-950 border border-slate-850 text-slate-300 flex items-center gap-1">
                            <PlatformIcon platform={entry.platform} className="w-3 h-3 text-indigo-400" />
                            {entry.platform}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-md bg-slate-950 border border-slate-850 text-emerald-400">
                            {entry.tone}
                          </span>
                          <span className="text-slate-500 font-normal">{entry.timestamp}</span>
                        </div>
                        
                        {/* Topic Title */}
                        <p className="text-xs text-slate-400 italic">
                          Topik: "{entry.topic}"
                        </p>

                        {/* Snippet Content */}
                        <p className="text-sm text-slate-300 font-light leading-relaxed whitespace-pre-wrap max-h-[80px] overflow-hidden mask-gradient">
                          {primaryCaption?.text?.substring(0, 180)}
                          {primaryCaption?.text?.length > 180 ? "..." : ""}
                        </p>
                      </div>

                      {/* Action buttons */}
                      <div className="flex sm:flex-col items-center justify-end gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleReuse(entry)}
                          className="flex-1 sm:w-full px-3 py-1.5 rounded-lg border border-slate-800 hover:border-indigo-500 hover:text-indigo-300 bg-slate-950 text-slate-400 hover:bg-indigo-900/10 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Pakai Lagi</span>
                        </button>
                        
                        <div className="flex items-center gap-2 w-full">
                          <button
                            onClick={() => handleCopy(primaryFullText)}
                            className="w-1/2 p-2 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-slate-200 text-xs font-semibold flex items-center justify-center transition-colors"
                            title="Copy Opsi Pertama"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          
                          <button
                            onClick={() => handleDeleteHistory(entry.id)}
                            className="w-1/2 p-2 rounded-lg border border-slate-800 hover:border-rose-500 bg-slate-950 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 text-xs font-semibold flex items-center justify-center transition-colors"
                            title="Hapus"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : captions.length > 0 ? (
            <div className="bg-slate-900/30 border border-slate-800 border-dashed rounded-2xl p-8 text-center max-w-md mx-auto space-y-2">
              <span className="text-3xl block">📭</span>
              <h3 className="text-sm font-bold text-slate-300">Belum ada riwayat caption.</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Generate caption baru dan riwayat akan muncul di sini untuk memudahkan penggunaan ulang di masa mendatang!
              </p>
            </div>
          ) : null}
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-500 mt-16 space-y-1">
        <p>Made with ❤️ · Smart Caption Generator v1.0</p>
        <p className="font-light opacity-60">Ditenagai oleh Gemini API & Tailwind CSS</p>
      </footer>
    </div>
  );
}
