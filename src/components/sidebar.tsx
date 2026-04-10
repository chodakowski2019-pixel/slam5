"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  CheckSquare,
  Trophy,
  Settings,
  CalendarDays,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store-context";
import { useAuth } from "@/lib/auth-context";

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "tasks", label: "Power List", icon: CheckSquare },
  { id: "goals", label: "Goals", icon: Trophy },
  { id: "calendar", label: "Calendar", icon: CalendarDays },
];

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { data } = useStore();
  const { user } = useAuth();

  const today = new Date().toISOString().split("T")[0];
  const activeTasks = data.tasks.filter((t) => !t.completed && t.createdAt.startsWith(today)).length;
  const runningTimer = data.tasks.find((t) => t.timerRunning);
  const isPro = data.subscription?.status === "active" || data.subscription?.status === "trialing";

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden md:flex h-screen flex-col border-r border-border bg-sidebar transition-all duration-300 ease-out",
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
            {collapsed ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
            )}
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

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-border bg-sidebar/95 backdrop-blur-xl h-16 px-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 relative",
                isActive ? "text-emerald-400" : "text-muted-foreground"
              )}
            >
              <Icon size={22} />
              <span className="text-[10px] font-medium">{item.label}</span>
              {item.id === "tasks" && activeTasks > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 text-[9px] bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold">
                  {activeTasks}
                </span>
              )}
            </button>
          );
        })}
        <button
          onClick={() => onViewChange("settings")}
          className={cn(
            "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200",
            activeView === "settings" ? "text-emerald-400" : "text-muted-foreground"
          )}
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-[10px] font-bold text-white">
            {data.profile?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "?"}
          </div>
          <span className="text-[10px] font-medium">Settings</span>
        </button>
      </nav>
    </>
  );
}
