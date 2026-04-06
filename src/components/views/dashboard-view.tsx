"use client";

import { useMemo } from "react";
import {
  CheckSquare,
  Target,
  Flame,
  Trophy,
  Frown,
  Zap,
  ArrowRight,
  TrendingUp,
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
  labels,
  height = 64,
}: {
  data: number[];
  labels: string[];
  height?: number;
}) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-1 w-full">
      {data.map((val, i) => {
        const isLast = i === data.length - 1;
        const barH = Math.max((val / max) * height, val > 0 ? 4 : 0);
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
            <div className="w-full flex items-end justify-center" style={{ height }}>
              <div
                style={{
                  height: barH,
                  width: "55%",
                  borderRadius: 4,
                  background: isLast
                    ? "linear-gradient(to bottom, #34d399, #10b981aa)"
                    : "#34d39920",
                }}
              />
            </div>
            <span className="text-[10px] text-muted-foreground">{labels[i]}</span>
          </div>
        );
      })}
    </div>
  );
}

const QUOTES = [
  "Discipline is choosing between what you want now and what you want most.",
  "The 5 you pick today define who you become tomorrow.",
  "Win the morning, win the day.",
  "Small daily improvements are the key to staggering long-term results.",
  "You don't rise to the level of your goals. You fall to the level of your systems.",
  "Hard choices, easy life. Easy choices, hard life.",
  "Action cures fear. Inaction creates terror.",
];

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

  const quote = useMemo(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    return QUOTES[dayOfYear % QUOTES.length];
  }, []);

  const completionPct = totalToday > 0 ? Math.round((completedToday.length / totalToday) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header with quote */}
      <div className="mb-8">
        <h2 className="text-3xl font-heading font-bold tracking-tight">
          {greeting}{data.profile?.name ? `, ${data.profile.name}` : ""}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">{todayFormatted}</p>
        <p className="text-xs text-muted-foreground/60 mt-3 italic max-w-lg">&ldquo;{quote}&rdquo;</p>
      </div>

      {/* Running timer — hero card */}
      {runningTask && (
        <div className="mb-6 p-6 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl" />
          <div className="flex items-center gap-2 mb-2 relative">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-xs text-emerald-400 uppercase tracking-wider font-medium">
              Focus mode
            </span>
          </div>
          <div className="flex items-center justify-between relative">
            <span className="text-xl font-heading font-semibold">{runningTask.title}</span>
            <TaskTimer task={runningTask} />
          </div>
        </div>
      )}

      {/* Frog */}
      {frogTask && !runningTask && (
        <div className="mb-6 p-5 rounded-2xl border border-amber-500/20 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">🐸</span>
            <span className="text-xs text-amber-400 uppercase tracking-wider font-medium">
              Eat the frog
            </span>
          </div>
          <span className="text-lg font-heading font-semibold">{frogTask.title}</span>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <button
          onClick={() => onNavigate("tasks")}
          className="group p-5 rounded-2xl border border-border bg-card hover:border-emerald-500/30 transition-all duration-300 text-left relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative">
            <div className="flex items-center gap-2 text-muted-foreground mb-3">
              <CheckSquare size={14} className="text-emerald-400" />
              <span className="text-xs font-medium">Active</span>
            </div>
            <span className="text-4xl font-heading font-bold tracking-tight">{activeTasks.length}</span>
            <div className="mt-2 flex items-center gap-1 text-xs text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
              <span>View tasks</span>
              <ArrowRight size={10} />
            </div>
          </div>
        </button>

        <button
          onClick={() => onNavigate("tasks")}
          className="group p-5 rounded-2xl border border-border bg-card hover:border-emerald-500/30 transition-all duration-300 text-left relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative">
            <div className="flex items-center gap-2 text-muted-foreground mb-3">
              <Target size={14} className="text-emerald-400" />
              <span className="text-xs font-medium">Completed</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-4xl font-heading font-bold tracking-tight">{completedToday.length}</span>
              <span className="text-sm text-muted-foreground font-medium">/ {totalToday}</span>
            </div>
            {totalToday > 0 && (
              <div className="mt-2 h-1 rounded-full bg-border overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-400 transition-all duration-700"
                  style={{ width: `${completionPct}%` }}
                />
              </div>
            )}
          </div>
        </button>

        <div className="p-5 rounded-2xl border border-border bg-card text-left relative overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-br to-transparent transition-opacity duration-300 ${streak > 0 ? "from-orange-500/5 opacity-100" : "from-orange-500/5 opacity-0"}`} />
          <div className="relative">
            <div className="flex items-center gap-2 text-muted-foreground mb-3">
              <Flame size={14} className={streak > 0 ? "text-orange-400" : ""} />
              <span className="text-xs font-medium">Streak</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-heading font-bold tracking-tight">{streak}</span>
              <span className="text-sm text-muted-foreground font-medium">days</span>
            </div>
            {streak > 0 && (
              <div className="mt-2 flex items-center gap-1 text-xs text-orange-400">
                <TrendingUp size={10} />
                <span>Keep going</span>
              </div>
            )}
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-card text-left relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent" />
          <div className="relative">
            <div className="flex items-center gap-2 text-muted-foreground mb-3">
              <Zap size={14} className="text-teal-400" />
              <span className="text-xs font-medium">Points</span>
            </div>
            <span className="text-4xl font-heading font-bold tracking-tight">{data.totalPoints}</span>
            {completedToday.length > 0 && (
              <div className="mt-2 text-xs text-teal-400">
                +{completedToday.length * 10} today
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Week + chart */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="p-5 rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
              This week
            </h3>
            <span className="text-xs font-medium">
              {weekWins >= 30 ? (
                <span className="text-emerald-400 flex items-center gap-1"><Trophy size={12} /> Week won!</span>
              ) : (
                <span className="text-muted-foreground">{weekWins}/35 tasks</span>
              )}
            </span>
          </div>
          <div className="flex gap-2 justify-between">
            {weekHistory.map((h, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    h.won === true
                      ? "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/20"
                      : h.won === false
                      ? "bg-red-500/15 text-red-400 ring-1 ring-red-500/20"
                      : "bg-accent/50 text-muted-foreground/50"
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
            Activity
          </h3>
          <MiniBarChart data={weeklyData} labels={weekLabels} height={56} />
        </div>
      </div>

      {/* Verdict */}
      {totalToday > 0 && activeTasks.length === 0 && (
        <div className={`mb-6 p-8 rounded-2xl border text-center relative overflow-hidden ${
          todayWon
            ? "border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent"
            : "border-red-500/20 bg-gradient-to-br from-red-500/10 via-red-500/5 to-transparent"
        }`}>
          {todayWon ? (
            <>
              <Trophy size={36} className="text-emerald-400 mx-auto mb-3" />
              <h3 className="text-2xl font-heading font-bold text-emerald-400">YOU WON TODAY</h3>
              <p className="text-sm text-muted-foreground mt-2">
                {completedToday.length}/{totalToday} crushed. +{completedToday.length * 10} pts earned.
              </p>
            </>
          ) : (
            <>
              <Frown size={36} className="text-red-400 mx-auto mb-3" />
              <h3 className="text-2xl font-heading font-bold text-red-400">DAY LOST</h3>
              <p className="text-sm text-muted-foreground mt-2">
                {completedToday.length}/{totalToday} done. Tomorrow is a new fight.
              </p>
            </>
          )}
        </div>
      )}

      {/* Today's tasks */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
            Today&apos;s battles
          </h3>
          <button
            onClick={() => onNavigate("tasks")}
            className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
          >
            View all <ArrowRight size={10} />
          </button>
        </div>
        <div className="space-y-1">
          {todayTasks.length === 0 && (
            <button
              onClick={() => onNavigate("tasks")}
              className="w-full text-center py-12 text-muted-foreground hover:text-foreground transition-colors rounded-2xl border border-dashed border-border hover:border-emerald-500/30 group"
            >
              <div className="text-3xl mb-3">+</div>
              <p className="text-sm">Add your 5 wins for today</p>
            </button>
          )}
          {todayTasks
            .sort((a, b) => {
              if (a.completed !== b.completed) return a.completed ? 1 : -1;
              if (a.isFrog !== b.isFrog) return a.isFrog ? -1 : 1;
              return 0;
            })
            .map((task) => {
              const project = data.projects.find((p) => p.id === task.projectId);
              return (
                <div
                  key={task.id}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-accent/30 transition-all duration-200 ${
                    task.completed ? "opacity-40" : ""
                  }`}
                >
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleTask(task.id)}
                    className="border-muted-foreground/40"
                  />
                  {task.isFrog && <span className="text-sm">🐸</span>}
                  <span className={`flex-1 text-sm truncate ${task.completed ? "line-through" : ""}`}>
                    {task.title}
                  </span>
                  {project && (
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: project.color }}
                      />
                      {project.name}
                    </span>
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

      {/* Spotify */}
      <div className="mt-8">
        <h3 className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-3">
          Focus music
        </h3>
        <div className="rounded-2xl overflow-hidden border border-border relative w-full" style={{ paddingBottom: "56.25%" }}>
          <iframe
            src="https://www.youtube.com/embed/J-BKM2ig744?si=ja01uNlFfgl4XXbT&autoplay=0"
            title="Focus music"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
      </div>

      {/* Parking Lot */}
      {data.parkingLot.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-2">
            Parking lot
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
