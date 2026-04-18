"use client";

import { useState } from "react";
import Link from "next/link";

const SPOTIFY_URL = "https://open.spotify.com/playlist/6Cf1qYa6QwYB70TVDBIaE3";

export default function PlaylistPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [agreed, setAgreed] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    setError("");
    await fetch("/api/playlist-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setSubmitting(false);
    setDone(true);
  }

  if (done) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-6">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-emerald-500/8 rounded-full blur-[120px]" />
        <div className="max-w-md mx-auto text-center relative">
          <div className="text-5xl mb-6">🎧</div>
          <h2 className="text-3xl font-bold font-heading tracking-tight mb-3">
            Check your inbox.
          </h2>
          <p className="text-neutral-400 leading-relaxed">
            The playlist is on its way. Hit play and get to work.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-6">
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-emerald-500/8 rounded-full blur-[120px]" />
      <div className="max-w-md mx-auto text-center relative">
        <h1 className="text-4xl md:text-5xl font-bold font-heading tracking-tight mb-4 bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-transparent">
          The ADHD <br />Focus Playlist
        </h1>
        <p className="text-neutral-400 mb-3 leading-relaxed">
          Music your brain actually responds to.
        </p>
        <p className="text-neutral-300 mb-10 leading-relaxed">
          No lyrics. No distractions. Just the{" "}
          <span className="text-white font-medium">right dopamine signal</span>{" "}
          to get you started.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            required
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-5 py-4 rounded-2xl bg-white/[0.05] border border-white/[0.10] text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500/50 text-base"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <label className="flex items-start gap-3 text-left cursor-pointer">
            <input
              type="checkbox"
              required
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border border-white/20 bg-white/5 accent-emerald-500 flex-shrink-0"
            />
            <span className="text-xs text-neutral-500 leading-relaxed">
              I agree to the{" "}
              <Link href="/privacy" className="text-neutral-400 underline hover:text-white transition-colors">
                Privacy Policy
              </Link>
              {" "}and consent to receiving emails from Slam5.
            </span>
          </label>
          <button
            type="submit"
            disabled={submitting || !agreed}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#10b981] to-[#14b8a6] text-white font-semibold text-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-emerald-500/20 disabled:opacity-60 disabled:scale-100"
          >
            {submitting ? "Sending..." : "Send me the playlist →"}
          </button>
        </form>
        <p className="mt-4 text-xs text-neutral-600">
          No spam. Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
}
