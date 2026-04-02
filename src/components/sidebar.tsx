"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  CheckSquare,
  FolderKanban,
  Trophy,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store-context";
import { NoisePlayer } from "@/components/noise-player";

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "tasks", label: "Power List", icon: CheckSquare },
  { id: "leaderboard", label: "Leaderboard", icon: Users },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "goals", label: "Goals", icon: Trophy },
];

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { data } = useStore();

  const activeTasks = data.tasks.filter((t) => !t.completed).length;
  const runningTimer = data.tasks.find((t) => t.timerRunning);

  return (
    <aside
      className={cn(
        "h-screen flex flex-col border-r border-border bg-[oklch(0.16_0_0)] transition-all duration-200",
        collapsed ? "w-[60px]" : "w-[240px]"
      )}
    >
      {/* Header */}
      <div className="h-14 flex items-center px-4 border-b border-border">
        {!collapsed && (
          <h1 className="text-sm font-semibold tracking-tight truncate">
            Slam5
          </h1>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "p-1 rounded hover:bg-accent transition-colors",
            collapsed ? "mx-auto" : "ml-auto"
          )}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-2 space-y-0.5 px-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              )}
            >
              <Icon size={18} />
              {!collapsed && (
                <>
                  <span className="truncate">{item.label}</span>
                  {item.id === "tasks" && activeTasks > 0 && (
                    <span className="ml-auto text-xs bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded-full">
                      {activeTasks}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* Running timer indicator */}
      {runningTimer && (
        <div className="px-3 py-3 border-t border-border">
          {!collapsed ? (
            <div className="text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
                </span>
                <span className="truncate">{runningTimer.title}</span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
              </span>
            </div>
          )}
        </div>
      )}

      {/* Noise player */}
      {!collapsed && (
        <div className="px-2 py-2 border-t border-border">
          <NoisePlayer />
        </div>
      )}

      {/* User */}
      <div className="h-14 flex items-center px-4 border-t border-border">
        <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-medium text-white">
          J
        </div>
        {!collapsed && (
          <span className="ml-3 text-sm truncate">Jakub</span>
        )}
      </div>
    </aside>
  );
}
