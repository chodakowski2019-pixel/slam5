"use client";

import { useMemo } from "react";
import {
  CheckSquare,
  FolderKanban,
  DollarSign,
  Clock,
  TrendingUp,
  TrendingDown,
  Flame,
  Target,
} from "lucide-react";
import { useStore } from "@/lib/store-context";
import { TaskTimer } from "@/components/task-timer";
import { Checkbox } from "@/components/ui/checkbox";

interface DashboardProps {
  onNavigate: (view: string) => void;
}

// Mini bar chart component (pure SVG, no deps)
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
            rx={2}
            fill={i === data.length - 1 ? color : color + "60"}
          />
        );
      })}
    </svg>
  );
}

// Donut chart component
function DonutChart({
  segments,
  size = 120,
  strokeWidth = 14,
}: {
  segments: { value: number; color: string; label: string }[];
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;

  let offset = 0;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-border"
        />
        {/* Segments */}
        {segments.map((seg, i) => {
          const segLength = (seg.value / total) * circumference;
          const dash = `${segLength} ${circumference - segLength}`;
          const currentOffset = offset;
          offset += segLength;
          return (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeDasharray={dash}
              strokeDashoffset={-currentOffset}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-heading font-bold">{total}</span>
        <span className="text-[10px] text-muted-foreground">total</span>
      </div>
    </div>
  );
}

// Progress bar with label
function ProgressStat({
  label,
  value,
  max,
  color,
  suffix = "",
}: {
  label: string;
  value: number;
  max: number;
  color: string;
  suffix?: string;
}) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">
          {value}{suffix} <span className="text-muted-foreground">/ {max}{suffix}</span>
        </span>
      </div>
      <div className="h-2 rounded-full bg-border overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export function DashboardView({ onNavigate }: DashboardProps) {
  const { data, toggleTask } = useStore();

  const activeTasks = data.tasks.filter((t) => !t.completed);
  const completedToday = data.tasks.filter((t) => {
    if (!t.completedAt) return false;
    const d = new Date(t.completedAt);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  });

  const runningTask = data.tasks.find((t) => t.timerRunning);

  const totalIncome = data.finances
    .filter((f) => f.type === "income")
    .reduce((sum, f) => sum + f.amount, 0);
  const totalExpenses = data.finances
    .filter((f) => f.type === "expense")
    .reduce((sum, f) => sum + f.amount, 0);

  // Compute weekly task completion (last 7 days)
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

  // Compute weekly spending (last 7 days)
  const weeklySpending = useMemo(() => {
    const days: number[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toDateString();
      const sum = data.finances
        .filter((f) => f.type === "expense" && new Date(f.date).toDateString() === dateStr)
        .reduce((s, f) => s + f.amount, 0);
      days.push(sum);
    }
    return days;
  }, [data.finances]);

  // Tasks per project for donut
  const projectSegments = useMemo(() => {
    return data.projects
      .map((p) => ({
        value: data.tasks.filter((t) => t.projectId === p.id && !t.completed).length,
        color: p.color,
        label: p.name,
      }))
      .filter((s) => s.value > 0);
  }, [data.projects, data.tasks]);

  // Add "No project" segment
  const noProjectTasks = activeTasks.filter((t) => !t.projectId).length;
  const allSegments = useMemo(() => {
    const segs = [...projectSegments];
    if (noProjectTasks > 0) {
      segs.push({ value: noProjectTasks, color: "#71717a", label: "No project" });
    }
    return segs;
  }, [projectSegments, noProjectTasks]);

  // Streak (consecutive days with at least 1 completion)
  const streak = useMemo(() => {
    let count = 0;
    for (let i = 0; i <= 365; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toDateString();
      const hasCompletion = data.tasks.some(
        (t) => t.completedAt && new Date(t.completedAt).toDateString() === dateStr
      );
      if (hasCompletion) count++;
      else if (i > 0) break; // day 0 (today) can be 0 without breaking streak
    }
    return count;
  }, [data.tasks]);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const todayIdx = new Date().getDay();
  const weekLabels = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return dayNames[d.getDay() === 0 ? 6 : d.getDay() - 1];
  });

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-heading font-bold tracking-tight">
          Good morning, Jakub
        </h2>
        <p className="text-sm text-muted-foreground mt-1">{today}</p>
      </div>

      {/* Running timer */}
      {runningTask && (
        <div className="mb-6 p-4 rounded-xl border border-indigo-500/30 bg-indigo-500/5">
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

      {/* Stats grid — row 1 */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <button
          onClick={() => onNavigate("tasks")}
          className="p-4 rounded-xl border border-border bg-card hover:bg-accent/50 transition-colors text-left"
        >
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <CheckSquare size={16} />
            <span className="text-xs">Active tasks</span>
          </div>
          <span className="text-2xl font-heading font-bold">{activeTasks.length}</span>
        </button>

        <button
          onClick={() => onNavigate("tasks")}
          className="p-4 rounded-xl border border-border bg-card hover:bg-accent/50 transition-colors text-left"
        >
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Target size={16} />
            <span className="text-xs">Done today</span>
          </div>
          <span className="text-2xl font-heading font-bold">{completedToday.length}</span>
        </button>

        <button
          onClick={() => onNavigate("tasks")}
          className="p-4 rounded-xl border border-border bg-card hover:bg-accent/50 transition-colors text-left"
        >
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Flame size={16} className={streak > 0 ? "text-orange-400" : ""} />
            <span className="text-xs">Streak</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-heading font-bold">{streak}</span>
            <span className="text-xs text-muted-foreground">days</span>
          </div>
        </button>

        <button
          onClick={() => onNavigate("finances")}
          className="p-4 rounded-xl border border-border bg-card hover:bg-accent/50 transition-colors text-left"
        >
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <DollarSign size={16} />
            <span className="text-xs">Balance</span>
          </div>
          <span
            className={`text-2xl font-heading font-bold ${
              totalIncome - totalExpenses >= 0 ? "text-emerald-400" : "text-red-400"
            }`}
          >
            ${(totalIncome - totalExpenses).toLocaleString()}
          </span>
        </button>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Weekly task completions */}
        <div className="p-4 rounded-xl border border-border bg-card">
          <h3 className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-3">
            Tasks completed (7d)
          </h3>
          <MiniBarChart data={weeklyData} color="#6366f1" height={56} />
          <div className="flex justify-between mt-2">
            {weekLabels.map((d, i) => (
              <span key={i} className="text-[9px] text-muted-foreground">{d}</span>
            ))}
          </div>
        </div>

        {/* Weekly spending */}
        <div className="p-4 rounded-xl border border-border bg-card">
          <h3 className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-3">
            Spending (7d)
          </h3>
          <MiniBarChart data={weeklySpending} color="#ef4444" height={56} />
          <div className="flex justify-between mt-2">
            {weekLabels.map((d, i) => (
              <span key={i} className="text-[9px] text-muted-foreground">{d}</span>
            ))}
          </div>
        </div>

        {/* Tasks by project donut */}
        <div className="p-4 rounded-xl border border-border bg-card flex items-center gap-4">
          <DonutChart segments={allSegments.length > 0 ? allSegments : [{ value: 1, color: "#27272a", label: "None" }]} size={100} strokeWidth={12} />
          <div className="flex-1 space-y-1.5">
            <h3 className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-2">
              Tasks by project
            </h3>
            {allSegments.map((seg, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: seg.color }} />
                <span className="text-muted-foreground truncate">{seg.label}</span>
                <span className="ml-auto font-medium">{seg.value}</span>
              </div>
            ))}
            {allSegments.length === 0 && (
              <span className="text-xs text-muted-foreground">No active tasks</span>
            )}
          </div>
        </div>
      </div>

      {/* Project progress bars */}
      {data.projects.length > 0 && (
        <div className="p-4 rounded-xl border border-border bg-card mb-6">
          <h3 className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-4">
            Project progress
          </h3>
          <div className="space-y-3">
            {data.projects.map((project) => {
              const total = data.tasks.filter((t) => t.projectId === project.id).length;
              const done = data.tasks.filter(
                (t) => t.projectId === project.id && t.completed
              ).length;
              return (
                <ProgressStat
                  key={project.id}
                  label={`${project.emoji} ${project.name}`}
                  value={done}
                  max={total}
                  color={project.color}
                  suffix=" tasks"
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Two column layout */}
      <div className="grid grid-cols-2 gap-6">
        {/* Today's tasks */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
              Today&apos;s tasks
            </h3>
            <button
              onClick={() => onNavigate("tasks")}
              className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              View all
            </button>
          </div>
          <div className="space-y-1">
            {activeTasks.length === 0 && (
              <p className="text-sm text-muted-foreground py-4">
                No active tasks. Add one in Tasks.
              </p>
            )}
            {activeTasks.slice(0, 8).map((task) => {
              const project = data.projects.find((p) => p.id === task.projectId);
              return (
                <div
                  key={task.id}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent/30 transition-colors"
                >
                  <Checkbox
                    checked={false}
                    onCheckedChange={() => toggleTask(task.id)}
                    className="border-muted-foreground/40"
                  />
                  <span className="flex-1 text-sm truncate">{task.title}</span>
                  {project && (
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: project.color }}
                    />
                  )}
                  <TaskTimer task={task} compact />
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick finances */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
              Recent transactions
            </h3>
            <button
              onClick={() => onNavigate("finances")}
              className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              View all
            </button>
          </div>
          <div className="space-y-1">
            {data.finances.length === 0 && (
              <p className="text-sm text-muted-foreground py-4">
                No transactions yet. Add one in Finances.
              </p>
            )}
            {data.finances.slice(0, 8).map((entry) => (
              <div
                key={entry.id}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent/30 transition-colors"
              >
                <div
                  className={`p-1 rounded ${
                    entry.type === "income"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-red-500/10 text-red-400"
                  }`}
                >
                  {entry.type === "income" ? (
                    <TrendingUp size={14} />
                  ) : (
                    <TrendingDown size={14} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm truncate block">{entry.description}</span>
                  <span className="text-xs text-muted-foreground">{entry.category}</span>
                </div>
                <span
                  className={`text-sm font-mono tabular-nums ${
                    entry.type === "income" ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {entry.type === "income" ? "+" : "-"}
                  {entry.currency === "USD" ? "$" : entry.currency === "PLN" ? "zl" : "E"}
                  {entry.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
