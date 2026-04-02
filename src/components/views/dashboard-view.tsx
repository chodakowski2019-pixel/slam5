"use client";

import { useMemo } from "react";
import {
  CheckSquare,
  Target,
  Flame,
  Trophy,
  Frown,
  Zap,
} from "lucide-react";
import { useStore } from "@/lib/store-context";
import { TaskTimer } from "@/components/task-timer";
import { Checkbox } from "@/components/ui/checkbox";
import { getTodayKey } from "@/lib/store";

interface DashboardProps {
  onNavigate: (view: string) => void;
}

function MiniBarChart({
  data,
  color,
  height = 64,
}: {
  data: number[];
  color: string;
  height?: number;
}) {
  const max = Math.max(...data, 1);
  const barWidth = 100 / data.length;
  return (
    <svg width="100%" height={height} viewBox={`0 0 100 ${height}`} preserveAspectRatio="none">
      {data.map((val, i) => {
        const barH = (val / max) * (height - 4);
        return (
          <rect
            key={i}
            x={i * barWidth + barWidth * 0.15}
            y={height - barH}
            width={barWidth * 0.7}
            height={barH}
            rx={3}
            fill={i === data.length - 1 ? color : color + "40"}
          />
        );
      })}
    </svg>
  );
}

export function DashboardView({ onNavigate }: DashboardProps) {
  const { data, toggleTask, getTodayRecord, getWeekWins, getCurrentStreak } = useStore();

  const today = getTodayKey();
  const todayTasks = data.tasks.filter((t) => t.createdAt.startsWith(today));
  const activeTasks = todayTasks.filter((t) => !t.completed);
  const completedToday = todayTasks.filter((t) => t.completed);
  const totalToday = todayTasks.length;
  const frogTask = todayTasks.find((t) => t.isFrog && !t.completed);
  const runningTask = data.tasks.find((t) => t.timerRunning);
  const streak = getCurrentStreak();
  const weekWins = getWeekWins();
  const todayRecord = getTodayRecord();
  const todayWon = todayRecord?.won ?? false;

  const weeklyData = useMemo(() => {
    const days: number[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toDateString();
      const count = data.tasks.filter(
        (t) => t.completedAt && new Date(t.completedAt).toDateString() === dateStr
      ).length;
      days.push(count);
    }
    return days;
  }, [data.tasks]);

  const weekHistory = useMemo(() => {
    const results: { day: string; won: boolean | null }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const record = data.dayRecords.find((r) => r.date === key);
      results.push({
        day: dayNames[d.getDay()],
        won: record ? record.won : null,
      });
    }
    return results;
  }, [data.dayRecords]);

  const weekLabels = weekHistory.map((h) => h.day);

  const todayFormatted = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Morning";
    if (h < 18) return "Afternoon";
    return "Evening";
  })();

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-heading font-bold tracking-tight">
          {greeting}{data.profile?.name ? `, ${data.profile.name}` : ""}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">{todayFormatted}</p>
      </div>

      {/* Running timer */}
      {runningTask && (
        <div className="mb-6 p-5 rounded-2xl border border-indigo-500/20 bg-indigo-500/5">
          <div className="flex items-center gap-2 mb-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
            </span>
            <span className="text-xs text-indigo-400 uppercase tracking-wider font-medium">
              Timer running
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-lg font-heading font-semibold">{runningTask.title}</span>
            <TaskTimer task={runningTask} />
          </div>
        </div>
      )}

      {/* Frog */}
      {frogTask && !runningTask && (
        <div className="mb-6 p-5 rounded-2xl border border-amber-500/20 bg-amber-500/5">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">🐸</span>
            <span className="text-xs text-amber-400 uppercase tracking-wider font-medium">
              Do this first
            </span>
          </div>
          <span className="text-lg font-heading font-semibold">{frogTask.title}</span>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <button
          onClick={() => onNavigate("tasks")}
          className="p-4 rounded-2xl border border-border bg-card hover:bg-accent/50 transition-all duration-200 text-left group"
        >
          <div className="flex items-center gap-2 text-muted-foreground mb-3">
            <CheckSquare size={14} />
            <span className="text-xs">Active</span>
          </div>
          <span className="text-3xl font-heading font-bold">{activeTasks.length}</span>
        </button>

        <button
          onClick={() => onNavigate("tasks")}
          className="p-4 rounded-2xl border border-border bg-card hover:bg-accent/50 transition-all duration-200 text-left"
        >
          <div className="flex items-center gap-2 text-muted-foreground mb-3">
            <Target size={14} />
            <span className="text-xs">Done</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-heading font-bold">{completedToday.length}</span>
            <span className="text-sm text-muted-foreground">/ {totalToday}</span>
          </div>
        </button>

        <div className="p-4 rounded-2xl border border-border bg-card text-left">
          <div className="flex items-center gap-2 text-muted-foreground mb-3">
            <Flame size={14} className={streak > 0 ? "text-orange-400" : ""} />
            <span className="text-xs">Streak</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-heading font-bold">{streak}</span>
            <span className="text-sm text-muted-foreground">d</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-border bg-card text-left">
          <div className="flex items-center gap-2 text-muted-foreground mb-3">
            <Zap size={14} className="text-indigo-400" />
            <span className="text-xs">Points</span>
          </div>
          <span className="text-3xl font-heading font-bold">{data.totalPoints}</span>
        </div>
      </div>

      {/* Week + chart */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="p-5 rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
              This week
            </h3>
            <span className="text-xs font-medium">
              {weekWins >= 5 ? (
                <span className="text-emerald-400">Week won</span>
              ) : (
                <span className="text-muted-foreground">{weekWins}/7 wins</span>
              )}
            </span>
          </div>
          <div className="flex gap-2 justify-between">
            {weekHistory.map((h, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-colors ${
                    h.won === true
                      ? "bg-emerald-500/15 text-emerald-400"
                      : h.won === false
                      ? "bg-red-500/15 text-red-400"
                      : "bg-accent text-muted-foreground"
                  }`}
                >
                  {h.won === true ? "W" : h.won === false ? "L" : "-"}
                </div>
                <span className="text-[10px] text-muted-foreground">{h.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-card">
          <h3 className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-4">
            Last 7 days
          </h3>
          <MiniBarChart data={weeklyData} color="#818cf8" height={56} />
          <div className="flex justify-between mt-2">
            {weekLabels.map((d, i) => (
              <span key={i} className="text-[10px] text-muted-foreground">{d}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Verdict */}
      {totalToday > 0 && activeTasks.length === 0 && (
        <div className={`mb-6 p-6 rounded-2xl border text-center ${
          todayWon
            ? "border-emerald-500/20 bg-emerald-500/5"
            : "border-red-500/20 bg-red-500/5"
        }`}>
          {todayWon ? (
            <>
              <Trophy size={32} className="text-emerald-400 mx-auto mb-3" />
              <h3 className="text-xl font-heading font-bold text-emerald-400">YOU WON TODAY</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {completedToday.length}/{totalToday} done. +{completedToday.length * 10} pts
              </p>
            </>
          ) : (
            <>
              <Frown size={32} className="text-red-400 mx-auto mb-3" />
              <h3 className="text-xl font-heading font-bold text-red-400">DAY LOST</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {completedToday.length}/{totalToday} done. Tomorrow is a new fight.
              </p>
            </>
          )}
        </div>
      )}

      {/* Today's tasks */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
            Today&apos;s list
          </h3>
          <button
            onClick={() => onNavigate("tasks")}
            className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            View all
          </button>
        </div>
        <div className="space-y-1">
          {todayTasks.length === 0 && (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No tasks yet. Add your 5 wins.
            </p>
          )}
          {todayTasks
            .sort((a, b) => {
              if (a.completed !== b.completed) return a.completed ? 1 : -1;
              if (a.isFrog !== b.isFrog) return a.isFrog ? -1 : 1;
              return 0;
            })
            .map((task) => {
              const project = data.projects.find((p) => p.id === task.projectId);
              const categoryEmoji = task.category === "body" ? "🏋️" : task.category === "mind" ? "🧠" : "💰";
              return (
                <div
                  key={task.id}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-accent/30 transition-all duration-200 ${
                    task.completed ? "opacity-40" : ""
                  }`}
                >
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleTask(task.id)}
                    className="border-muted-foreground/40"
                  />
                  {task.isFrog && <span className="text-sm">🐸</span>}
                  <span className="text-xs">{categoryEmoji}</span>
                  <span className={`flex-1 text-sm truncate ${task.completed ? "line-through" : ""}`}>
                    {task.title}
                  </span>
                  {project && (
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: project.color }}
                    />
                  )}
                  {!task.completed && <TaskTimer task={task} compact />}
                  {task.completed && (
                    <span className="text-xs text-emerald-400 font-medium">+10</span>
                  )}
                </div>
              );
            })}
        </div>
      </div>

      {/* Parking Lot */}
      {data.parkingLot.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-2">
            Parking Lot
          </h3>
          <div className="space-y-1">
            {data.parkingLot.map((item) => (
              <div key={item.id} className="text-sm px-3 py-2 rounded-xl bg-accent/30 text-muted-foreground">
                {item.text}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
