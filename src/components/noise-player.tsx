"use client";

import { useState } from "react";
import { Volume2, VolumeX, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const TRACKS = [
  { id: "brown", label: "Brown Noise", url: "https://www.youtube.com/embed/RqzGzwTY-6w?autoplay=1&loop=1&playlist=RqzGzwTY-6w" },
  { id: "rain", label: "Rain", url: "https://www.youtube.com/embed/mPZkdNFkNps?autoplay=1&loop=1&playlist=mPZkdNFkNps" },
  { id: "lofi", label: "Lo-fi", url: "https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1" },
  { id: "white", label: "White Noise", url: "https://www.youtube.com/embed/nMfPqeZjc2c?autoplay=1&loop=1&playlist=nMfPqeZjc2c" },
  { id: "forest", label: "Forest", url: "https://www.youtube.com/embed/xNN7iTA57jM?autoplay=1&loop=1&playlist=xNN7iTA57jM" },
];

export function NoisePlayer() {
  const [playing, setPlaying] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  const currentTrack = TRACKS.find((t) => t.id === playing);

  return (
    <div className="relative">
      {/* Toggle button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className={cn(
          "w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
          playing
            ? "text-indigo-400 bg-indigo-500/10"
            : "text-muted-foreground hover:bg-accent/50"
        )}
      >
        {playing ? <Volume2 size={16} /> : <VolumeX size={16} />}
        <span className="truncate text-xs">
          {currentTrack ? currentTrack.label : "Focus sounds"}
        </span>
        <ChevronDown size={12} className={cn("ml-auto transition-transform", expanded && "rotate-180")} />
      </button>

      {/* Dropdown */}
      {expanded && (
        <div className="absolute bottom-full left-0 right-0 mb-1 bg-card border border-border rounded-lg shadow-xl overflow-hidden z-50">
          {TRACKS.map((track) => (
            <button
              key={track.id}
              onClick={() => {
                if (playing === track.id) {
                  setPlaying(null);
                } else {
                  setPlaying(track.id);
                }
                setExpanded(false);
              }}
              className={cn(
                "w-full text-left px-3 py-2 text-xs transition-colors",
                playing === track.id
                  ? "bg-indigo-500/20 text-indigo-400"
                  : "text-muted-foreground hover:bg-accent/50"
              )}
            >
              {playing === track.id ? "⏸ " : "▶ "}{track.label}
            </button>
          ))}
          {playing && (
            <button
              onClick={() => { setPlaying(null); setExpanded(false); }}
              className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
            >
              ⏹ Stop
            </button>
          )}
        </div>
      )}

      {/* Hidden YouTube iframe for audio */}
      {playing && currentTrack && (
        <iframe
          src={currentTrack.url}
          className="hidden"
          allow="autoplay"
          title="Focus sound"
        />
      )}
    </div>
  );
}
