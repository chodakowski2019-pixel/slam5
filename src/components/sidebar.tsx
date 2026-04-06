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
  Zap,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store-context";
import { useAuth } from "@/lib/auth-context";
import { NoisePlayer } from "@/components/noise-player";

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const NAV_ITEMS = [
  { id: "tasks", label: "Power List", icon: CheckSquare },
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "goals", label: "Goals", icon: Trophy },
];

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const { data } = useStore();
  const { user } = useAuth();

  const activeTasks = data.tasks.filter((t) => !t.completed).length;
  const runningTimer = data.tasks.find((t) => t.timerRunning);
  const isPro = data.subscription?.status === "active" || data.subscription?.status === "trialing";

  const handleUpgrade = async () => {
    if (!user) return;
    setUpgrading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, email: user.email }),
      });
      const { url, error } = await res.json();
      if (url) window.location.href = url;
      else alert(error || "Something went wrong");
    } catch {
      alert("Failed to start checkout");
    } finally {
      setUpgrading(false);
    }
  };

  return (
    <aside
      className={cn(
        "h-screen flex flex-col border-r border-border bg-sidebar transition-all duration-300 ease-out",
        collapsed ? "w-[64px]" : "w-[240px]"
      )}
    >
      {/* Header */}
      <div className="h-14 flex items-center px-4 border-b border-border">
        {!collapsed && (
          <h1 className="text-base font-heading font-bold tracking-tight">
            Slam<span className="text-emerald-400">5</span>
          </h1>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "p-1.5 rounded-lg hover:bg-accent transition-all duration-200",
            collapsed ? "mx-auto" : "ml-auto"
          )}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 space-y-0.5 px-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200",
                isActive
                  ? "bg-emerald-500/15 text-emerald-400 font-medium ring-1 ring-emerald-500/25"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <Icon size={18} className={isActive ? "text-emerald-400" : ""} />
              {!collapsed && (
                <>
                  <span className="truncate">{item.label}</span>
                  {item.id === "tasks" && activeTasks > 0 && (
                    <span className="ml-auto text-[11px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-medium">
                      {activeTasks}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* Running timer */}
      {runningTimer && (
        <div className="mx-2 mb-2 px-3 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          {!collapsed ? (
            <div className="flex items-center gap-2 text-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="truncate text-emerald-300">{runningTimer.title}</span>
            </div>
          ) : (
            <div className="flex justify-center">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
            </div>
          )}
        </div>
      )}


      {/* Upgrade */}
      {!isPro && (
        <div className="px-2 py-2">
          {!collapsed ? (
            <button
              onClick={handleUpgrade}
              disabled={upgrading}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 transition-all duration-200 disabled:opacity-50 shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Zap size={14} />
              {upgrading ? "Loading..." : "Go Pro"}
            </button>
          ) : (
            <button
              onClick={handleUpgrade}
              disabled={upgrading}
              className="w-full flex justify-center p-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 transition-all duration-200 disabled:opacity-50"
            >
              <Zap size={14} />
            </button>
          )}
        </div>
      )}

      {/* User + Settings */}
      <button
        onClick={() => onViewChange("settings")}
        className={cn(
          "h-14 flex items-center px-4 border-t border-border w-full hover:bg-accent/50 transition-all duration-200",
          activeView === "settings" && "bg-accent"
        )}
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
          {data.profile?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "?"}
        </div>
        {!collapsed && (
          <>
            <div className="ml-3 flex-1 min-w-0 text-left">
              <span className="text-sm truncate block font-medium">{data.profile?.name || user?.email?.split("@")[0] || "User"}</span>
              {isPro && <span className="text-[10px] text-emerald-400 font-medium">PRO</span>}
            </div>
            <Settings size={14} className="text-muted-foreground flex-shrink-0" />
          </>
        )}
      </button>
    </aside>
  );
}
