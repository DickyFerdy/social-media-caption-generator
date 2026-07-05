import { useState } from "react";

// — Data opsi dropdown —
const PLATFORMS = ["Instagram", "X", "Facebook", "LinkedIn"];
const TONES = ["Santai", "Formal", "Lucu", "Profesional"];

/* Ikon SVG sederhana untuk sosial media */
const SocialIcon = ({ type }) => {
  const icons = {
    instagram: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
    facebook: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    x: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  };
  return <span className="social-icon">{icons[type] || null}</span>;
};

export default function App() {
  const [form, setForm] = useState({
    topic: "",
    platform: "Instagram",
    tone: "Santai",
  });
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // — Handler input —
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  // — Submit ke backend —
  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!form.topic.trim()) {
      setError("Silakan masukkan topik konten terlebih dahulu.");
      return;
    }

    setLoading(true);
    setError("");
    setCaption("");
    setCopied(false);

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
        setCaption(data.caption);
      }
    } catch (err) {
      setError("Gagal terhubung ke server. Pastikan backend sudah berjalan.");
    } finally {
      setLoading(false);
    }
  };

  // — Copy ke clipboard —
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(caption);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback untuk environment non-HTTPS
      const textarea = document.createElement("textarea");
      textarea.value = caption;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="app">
      <main className="container">
        {/* Header */}
        <header className="header">
          <div className="logo">✨</div>
          <h1>Smart Social Media Caption Generator</h1>
          <p className="subtitle">
            Hasilkan caption menarik dengan bantuan AI untuk berbagai platform
            sosial media
          </p>
        </header>

        {/* Form */}
        <form onSubmit={handleGenerate} className="form-card">
          <div className="form-group">
            <label htmlFor="topic">Topik / Ide Konten</label>
            <textarea
              id="topic"
              name="topic"
              value={form.topic}
              onChange={handleChange}
              placeholder="Contoh: Tips produktivitas kerja di era digital..."
              rows={3}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="platform">Platform</label>
              <select
                id="platform"
                name="platform"
                value={form.platform}
                onChange={handleChange}
              >
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="tone">Gaya Bahasa</label>
              <select
                id="tone"
                name="tone"
                value={form.tone}
                onChange={handleChange}
              >
                {TONES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="btn-generate"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner" />
                Memproses...
              </>
            ) : (
              "🚀 Generate Caption"
            )}
          </button>
        </form>

        {/* Error */}
        {error && <div className="error-message">⚠️ {error}</div>}

        {/* Result */}
        {caption && (
          <div className="result-card">
            <div className="result-header">
              <h2>📝 Hasil Caption</h2>
              <button
                className={`btn-copy ${copied ? "copied" : ""}`}
                onClick={handleCopy}
              >
                {copied ? "✅ Tersalin!" : "📋 Copy to Clipboard"}
              </button>
            </div>

            <div className="result-content">
              {caption.split("\n").map((line, i) => (
                <p key={i}>{line || <br />}</p>
              ))}
            </div>

            {/* Social Media Links */}
            <div className="social-links">
              <span className="social-links-label">Bagikan ke:</span>
              <div className="social-icons-row">
                <a
                  href="https://www.instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Buka Instagram"
                >
                  <SocialIcon type="instagram" />
                </a>
                <a
                  href="https://www.facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Buka Facebook"
                >
                  <SocialIcon type="facebook" />
                </a>
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Buka X (Twitter)"
                >
                  <SocialIcon type="x" />
                </a>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
