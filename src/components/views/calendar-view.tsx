"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";
import { useStore } from "@/lib/store-context";
import { getTodayKey } from "@/lib/store";

function formatDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function isSameDay(a: string, b: string) {
  return a === b;
}

export function CalendarView() {
  const { data, addTask, deleteTask } = useStore();
  const today = getTodayKey();

  const [weekStart, setWeekStart] = useState(() => {
    const d = new Date();
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day; // Monday
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const [selectedDate, setSelectedDate] = useState(today);
  const [newTitle, setNewTitle] = useState("");
  const [newMinutes, setNewMinutes] = useState(25);
  const [newIsFrog, setNewIsFrog] = useState(false);

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = addDays(weekStart, i);
    return formatDateKey(d);
  });

  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const tasksForDay = (dateKey: string) =>
    data.tasks.filter((t) => (t.scheduledFor ?? t.createdAt.slice(0, 10)) === dateKey);

  const selectedTasks = tasksForDay(selectedDate);
  const activeTasks = selectedTasks.filter((t) => !t.completed);
  const completedTasks = selectedTasks.filter((t) => t.completed);

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    addTask(newTitle.trim(), null, newMinutes, "money", newIsFrog, selectedDate);
    setNewTitle("");
    setNewMinutes(25);
    setNewIsFrog(false);
  };

  const prevWeek = () => setWeekStart((d) => addDays(d, -7));
  const nextWeek = () => setWeekStart((d) => addDays(d, 7));

  const monthLabel = new Date(weekStart).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-heading font-bold tracking-tight">Calendar</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{monthLabel}</span>
          <button onClick={prevWeek} className="p-1.5 rounded-lg hover:bg-accent transition-colors">
            <ChevronLeft size={16} />
          </button>
          <button onClick={nextWeek} className="p-1.5 rounded-lg hover:bg-accent transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-6">
        Plan tasks for future days. Today&apos;s tasks live in Power List. Use calendar for anything scheduled ahead.
      </p>

      {/* Week strip */}
      <div className="grid grid-cols-7 gap-1.5 mb-6">
        {days.map((dateKey, i) => {
          const count = tasksForDay(dateKey).length;
          const isToday = isSameDay(dateKey, today);
          const isSelected = isSameDay(dateKey, selectedDate);
          const isPast = dateKey < today;
          const dayNum = new Date(dateKey).getDate();

          return (
            <button
              key={dateKey}
              onClick={() => setSelectedDate(dateKey)}
              className={`flex flex-col items-center gap-1 py-3 rounded-xl border transition-all duration-200 ${
                isSelected
                  ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                  : isToday
                  ? "border-emerald-500/30 text-emerald-400"
                  : isPast
                  ? "border-border opacity-50 hover:opacity-70"
                  : "border-border hover:border-emerald-500/20 hover:bg-accent/50"
              }`}
            >
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                {dayNames[i]}
              </span>
              <span className={`text-lg font-heading font-bold ${isToday ? "text-emerald-400" : ""}`}>
                {dayNum}
              </span>
              {count > 0 && (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full font-medium">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected day label */}
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">
          {isSameDay(selectedDate, today)
            ? "Today"
            : new Date(selectedDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </h3>
        <span className="text-xs text-muted-foreground/50">· {selectedTasks.length} tasks</span>
      </div>

      {/* Add task */}
      <div className="flex gap-2 mb-6">
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="Add a task..."
          className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:border-emerald-500/50 transition-colors"
        />
        <div className="flex items-center gap-1 px-3 py-2.5 rounded-xl border border-border bg-card">
          <input
            type="number"
            value={newMinutes}
            onChange={(e) => setNewMinutes(Math.max(1, parseInt(e.target.value) || 25))}
            className="w-8 text-sm text-center bg-transparent focus:outline-none"
          />
          <span className="text-xs text-muted-foreground">min</span>
        </div>
        <button
          onClick={() => setNewIsFrog((v) => !v)}
          title="Mark as heavy task (frog)"
          className={`px-3 py-2.5 rounded-xl border text-sm transition-all duration-200 ${
            newIsFrog
              ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
              : "border-border bg-card text-muted-foreground hover:border-emerald-500/20"
          }`}
        >
          🐸
        </button>
        <button
          onClick={handleAdd}
          disabled={!newTitle.trim()}
          className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white transition-all duration-200 disabled:opacity-40 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Task list */}
      {activeTasks.length === 0 && completedTasks.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground py-10">No tasks. Add some above.</p>
      ) : (
        <div className="space-y-2">
          {activeTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-card"
            >
              {task.isFrog && <span className="text-sm">🐸</span>}
              <span className="text-sm flex-1">{task.title}</span>
              <span className="text-xs text-muted-foreground">{task.timerMinutes}min</span>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-muted-foreground hover:text-red-400 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          {completedTasks.length > 0 && (
            <>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium pt-2 pb-1">Done</p>
              {completedTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-card opacity-50"
                >
                  <span className="text-sm flex-1 line-through">{task.title}</span>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-muted-foreground hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
