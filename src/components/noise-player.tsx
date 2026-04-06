"use client";

import { useState } from "react";
import { Music, ChevronDown, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

const PLAYLISTS = [
  { id: "slam5", label: "Slam5 Focus", uri: "14KtkIpsvzDSCXR24EqHCL" },
];

export function NoisePlayer() {
  const [activePlaylist, setActivePlaylist] = useState<string | null>("slam5");
  const [expanded, setExpanded] = useState(false);

  const current = PLAYLISTS.find((p) => p.id === activePlaylist);

  return (
    <div className="relative">
      {/* Toggle button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className={cn(
          "w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
          activePlaylist
            ? "text-emerald-400 bg-emerald-500/10"
            : "text-muted-foreground hover:bg-accent/50"
        )}
      >
        <Music size={16} />
        <span className="truncate text-xs">
          {current ? current.label : "Spotify"}
        </span>
        <ChevronDown size={12} className={cn("ml-auto transition-transform", expanded && "rotate-180")} />
      </button>

      {/* Dropdown */}
      {expanded && (
        <div className="absolute bottom-full left-0 right-0 mb-1 bg-card border border-border rounded-lg shadow-xl overflow-hidden z-50">
          {PLAYLISTS.map((playlist) => (
            <button
              key={playlist.id}
              onClick={() => {
                setActivePlaylist(activePlaylist === playlist.id ? null : playlist.id);
                setExpanded(false);
              }}
              className={cn(
                "w-full text-left px-3 py-2 text-xs transition-colors flex items-center gap-2",
                activePlaylist === playlist.id
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "text-muted-foreground hover:bg-accent/50"
              )}
            >
              <span>{activePlaylist === playlist.id ? "⏸" : "▶"}</span>
              <span className="flex-1">{playlist.label}</span>
              <a
                href={`https://open.spotify.com/playlist/${playlist.uri}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="opacity-50 hover:opacity-100 transition-opacity"
              >
                <ExternalLink size={10} />
              </a>
            </button>
          ))}
          {activePlaylist && (
            <button
              onClick={() => { setActivePlaylist(null); setExpanded(false); }}
              className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
            >
              ⏹ Stop
            </button>
          )}
        </div>
      )}

      {/* YouTube embed */}
      {activePlaylist && current && (
        <div className="mt-2 rounded-lg overflow-hidden">
          <iframe
            width="100%"
            height="80"
            src="https://www.youtube.com/embed/J-BKM2ig744?si=ja01uNlFfgl4XXbT"
            title="Focus music"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="rounded-lg"
          />
        </div>
      )}
    </div>
  );
}
