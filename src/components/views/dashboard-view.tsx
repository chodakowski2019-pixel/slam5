"use client";

import { useMemo } from "react";
import { ArrowRight, Flame, Trophy, Zap } from "lucide-react";
import { useStore } from "@/lib/store-context";
import { TaskTimer } from "@/components/task-timer";
import { Checkbox } from "@/components/ui/checkbox";
import { getTodayKey } from "@/lib/store";

interface DashboardProps {
  onNavigate: (view: string) => void;
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

  const quote = useMemo(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    return QUOTES[dayOfYear % QUOTES.length];
  }, []);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Morning";
    if (h < 18) return "Afternoon";
    return "Evening";
  })();

  const todayFormatted = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const completionPct = totalToday > 0 ? Math.round((completedToday.length / totalToday) * 100) : 0;
  const noTasks = totalToday === 0;

  return (
    <div className="max-w-2xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <p className="text-sm text-muted-foreground mb-1">{todayFormatted}</p>
        <h2 className="text-3xl font-heading font-bold tracking-tight">
          {greeting}{data.profile?.name ? `, ${data.profile.name}` : ""}
        </h2>
        <p className="text-xs text-muted-foreground/60 mt-2 italic">&ldquo;{quote}&rdquo;</p>
      </div>

      {/* Running timer — hero */}
      {runningTask && (
        <div className="mb-6 p-6 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl" />
          <div className="flex items-center gap-2 mb-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-xs text-emerald-400 uppercase tracking-wider font-medium">Focus mode</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xl font-heading font-semibold">{runningTask.title}</span>
            <TaskTimer task={runningTask} />
          </div>
        </div>
      )}

      {/* TODAY'S HERO — big task counter or CTA */}
      {noTasks ? (
        <button
          onClick={() => onNavigate("tasks")}
          className="w-full mb-6 p-8 rounded-2xl border-2 border-dashed border-emerald-500/30 hover:border-emerald-500/60 bg-emerald-500/[0.03] hover:bg-emerald-500/[0.06] transition-all duration-300 group text-center"
        >
          <div className="text-5xl mb-3">+</div>
          <p className="text-xl font-heading font-bold text-emerald-400">Pick your 5 tasks</p>
          <p className="text-sm text-muted-foreground mt-1">Your day doesn&apos;t start until you do.</p>
        </button>
      ) : (
        <div className="mb-6 p-6 rounded-2xl border border-border bg-card relative overflow-hidden">
          {todayWon && (
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent" />
          )}
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">Today</p>
              <div className="flex items-end gap-2">
                <span className="text-7xl font-heading font-bold leading-none tracking-tighter">
                  {completedToday.length}
                </span>
                <span className="text-2xl text-muted-foreground font-medium mb-2">/ {totalToday}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {todayWon ? "Day won. 🏆" : completedToday.length === 0 ? "Get started." : `${5 - completedToday.length} more to win.`}
              </p>
            </div>
            {/* Ring progress */}
            <div className="relative w-24 h-24 flex-shrink-0">
              <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
                <circle cx="48" cy="48" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-border" />
                <circle
                  cx="48" cy="48" r="40" fill="none"
                  stroke={todayWon ? "#34d399" : "#10b981"}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - completionPct / 100)}`}
                  className="transition-all duration-700"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold">{completionPct}%</span>
              </div>
            </div>
          </div>
          {/* Progress bar */}
          <div className="relative mt-4 h-1.5 rounded-full bg-border overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-400 transition-all duration-700"
              style={{ width: `${completionPct}%` }}
            />
          </div>
        </div>
      )}

      {/* Frog */}
      {frogTask && !runningTask && (
        <div className="mb-6 p-5 rounded-2xl border border-amber-500/20 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">🐸</span>
            <span className="text-xs text-amber-400 uppercase tracking-wider font-medium">Eat the frog first</span>
          </div>
          <span className="text-lg font-heading font-semibold">{frogTask.title}</span>
        </div>
      )}

      {/* Today's tasks */}
      {totalToday > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Today&apos;s battles</h3>
            <button
              onClick={() => onNavigate("tasks")}
              className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
            >
              View all <ArrowRight size={10} />
            </button>
          </div>
          <div className="space-y-1">
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
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-accent/30 transition-all duration-200 ${task.completed ? "opacity-40" : ""}`}
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
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: project.color }} />
                        {project.name}
                      </span>
                    )}
                    {!task.completed && <TaskTimer task={task} compact />}
                    {task.completed && <span className="text-xs text-emerald-400 font-medium">+10</span>}
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Not enough tasks */}
      {totalToday > 0 && totalToday < 5 && activeTasks.length === 0 && !todayWon && (
        <div className="mb-6 p-5 rounded-2xl border border-amber-500/20 bg-amber-500/5 text-center">
          <p className="text-lg font-heading font-bold text-amber-400">Not enough tasks</p>
          <p className="text-sm text-muted-foreground mt-1">
            You need at least <span className="text-foreground font-medium">5 tasks</span> to win the day.
          </p>
        </div>
      )}

      {/* Streak — big if active */}
      {streak > 0 && (
        <div className="mb-6 p-6 rounded-2xl border border-orange-500/20 bg-gradient-to-r from-orange-500/10 to-transparent">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-orange-400/70 uppercase tracking-wider font-medium mb-1">Current streak</p>
              <div className="flex items-end gap-2">
                <span className="text-5xl font-heading font-bold leading-none">{streak}</span>
                <span className="text-lg text-muted-foreground mb-1">days</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Don&apos;t break it.</p>
            </div>
            <Flame size={48} className="text-orange-400 opacity-80" />
          </div>
        </div>
      )}

      {/* Stats row — smaller, secondary */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="p-4 rounded-2xl border border-border bg-card">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Zap size={13} className="text-teal-400" />
            <span className="text-xs font-medium">Points</span>
          </div>
          <span className="text-3xl font-heading font-bold">{data.totalPoints}</span>
          {completedToday.length > 0 && (
            <p className="text-xs text-teal-400 mt-1">+{completedToday.length * 10} today</p>
          )}
        </div>
        <div className="p-4 rounded-2xl border border-border bg-card">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Trophy size={13} className="text-emerald-400" />
            <span className="text-xs font-medium">This week</span>
          </div>
          <span className="text-3xl font-heading font-bold">{weekWins}</span>
          <p className="text-xs text-muted-foreground mt-1">of 35 tasks</p>
        </div>
      </div>

      {/* Focus music */}
      <div className="mb-6">
        <h3 className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-3">Focus music</h3>
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
        <div>
          <h3 className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-2">Parking lot</h3>
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
