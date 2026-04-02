"use client";

import { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  CheckSquare,
  FolderKanban,
  Trophy,
  Users,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (view: string) => void;
}

const COMMANDS = [
  { id: "dashboard", label: "Go to Dashboard", icon: LayoutDashboard, keywords: "home overview" },
  { id: "tasks", label: "Go to Power List", icon: CheckSquare, keywords: "todo list timer tasks slam" },
  { id: "leaderboard", label: "Go to Leaderboard", icon: Users, keywords: "friends rank score compete" },
  { id: "projects", label: "Go to Projects", icon: FolderKanban, keywords: "project business" },
  { id: "goals", label: "Go to Goals", icon: Trophy, keywords: "goal vision mission long-term body mind money" },
];

export function CommandPalette({ open, onClose, onNavigate }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = COMMANDS.filter(
    (c) =>
      c.label.toLowerCase().includes(query.toLowerCase()) ||
      c.keywords.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    setSelected(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((s) => Math.min(s + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((s) => Math.max(s - 1, 0));
    } else if (e.key === "Enter" && filtered[selected]) {
      onNavigate(filtered[selected].id);
    }
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Palette */}
      <div className="fixed top-[20%] left-1/2 -translate-x-1/2 w-[520px] bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search size={16} className="text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command..."
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
          />
          <kbd className="text-[10px] text-muted-foreground bg-background px-1.5 py-0.5 rounded border border-border">
            ESC
          </kbd>
        </div>
        <div className="py-1 max-h-64 overflow-y-auto">
          {filtered.length === 0 && (
            <div className="px-4 py-6 text-sm text-muted-foreground text-center">
              No results found.
            </div>
          )}
          {filtered.map((cmd, i) => {
            const Icon = cmd.icon;
            return (
              <button
                key={cmd.id}
                onClick={() => onNavigate(cmd.id)}
                onMouseEnter={() => setSelected(i)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                  i === selected
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground"
                )}
              >
                <Icon size={16} />
                <span>{cmd.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
