"use client";

import { useState } from "react";
import { Plus, Trash2, Clock, ParkingSquare } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store-context";
import { TaskTimer } from "@/components/task-timer";
import { TaskCategory, getTodayKey } from "@/lib/store";

const CATEGORY_OPTIONS: { value: TaskCategory; label: string; emoji: string }[] = [
  { value: "body", label: "Body", emoji: "🏋️" },
  { value: "mind", label: "Mind", emoji: "🧠" },
  { value: "money", label: "Money", emoji: "💰" },
];

const MAX_DAILY_TASKS = 7;

export function TasksView() {
  const { data, addTask, toggleTask, deleteTask, setFrog, addParkingLotItem, deleteParkingLotItem, clearParkingLot } = useStore();
  const [newTitle, setNewTitle] = useState("");
  const [newMinutes, setNewMinutes] = useState(25);
  const [newProjectId, setNewProjectId] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState<TaskCategory>("money");
  const [newIsFrog, setNewIsFrog] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const [parkingInput, setParkingInput] = useState("");
  const [showParkingLot, setShowParkingLot] = useState(false);

  const today = getTodayKey();
  const todayTasks = data.tasks.filter((t) => t.createdAt.startsWith(today));
  const activeTasks = todayTasks.filter((t) => !t.completed);
  const completedTasks = todayTasks.filter((t) => t.completed);
  const atLimit = todayTasks.length >= MAX_DAILY_TASKS;

  const handleAdd = () => {
    if (!newTitle.trim() || atLimit) return;
    addTask(newTitle.trim(), newProjectId, newMinutes, newCategory, newIsFrog);
    setNewTitle("");
    setNewMinutes(25);
    setNewProjectId(null);
    setNewIsFrog(false);
  };

  const handleParkingAdd = () => {
    if (!parkingInput.trim()) return;
    addParkingLotItem(parkingInput.trim());
    setParkingInput("");
  };

  const getProject = (id: string | null) =>
    id ? data.projects.find((p) => p.id === id) : null;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-semibold">Power List</h2>
        <div className="flex items-center gap-3">
          <span className={`text-sm font-medium ${atLimit ? "text-amber-400" : "text-muted-foreground"}`}>
            {todayTasks.length}/{MAX_DAILY_TASKS} tasks
          </span>
          <button
            onClick={() => setShowParkingLot(!showParkingLot)}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs transition-colors",
              showParkingLot ? "bg-indigo-500/20 text-indigo-400" : "text-muted-foreground hover:bg-accent"
            )}
          >
            <ParkingSquare size={14} />
            Parking Lot {data.parkingLot.length > 0 && `(${data.parkingLot.length})`}
          </button>
        </div>
      </div>

      {/* New task form */}
      <div className="space-y-2 mb-6">
        <div className="flex gap-2">
          <Input
            placeholder={atLimit ? `Max ${MAX_DAILY_TASKS} tasks per day` : "What needs to get done?"}
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            disabled={atLimit}
            className="flex-1 bg-card border-border"
          />
          <div className="flex items-center gap-1 bg-card border border-border rounded-md px-2">
            <Clock size={14} className="text-muted-foreground" />
            <input
              type="number"
              min={1}
              max={240}
              value={newMinutes}
              onChange={(e) => setNewMinutes(Number(e.target.value))}
              className="w-10 bg-transparent text-sm text-center outline-none"
            />
            <span className="text-xs text-muted-foreground">min</span>
          </div>
          <button
            onClick={handleAdd}
            disabled={!newTitle.trim() || atLimit}
            className="px-3 py-2 rounded-md bg-indigo-500 hover:bg-indigo-600 disabled:opacity-30 transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
        <div className="flex gap-2 items-center">
          {/* Category selector */}
          <div className="flex gap-1">
            {CATEGORY_OPTIONS.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setNewCategory(cat.value)}
                className={cn(
                  "px-2.5 py-1 rounded-md text-xs transition-colors",
                  newCategory === cat.value
                    ? "bg-indigo-500/20 text-indigo-400"
                    : "text-muted-foreground hover:bg-accent"
                )}
              >
                {cat.emoji} {cat.label}
              </button>
            ))}
          </div>
          <div className="w-px h-4 bg-border" />
          {/* Frog toggle */}
          <button
            onClick={() => setNewIsFrog(!newIsFrog)}
            className={cn(
              "px-2.5 py-1 rounded-md text-xs transition-colors",
              newIsFrog
                ? "bg-amber-500/20 text-amber-400"
                : "text-muted-foreground hover:bg-accent"
            )}
          >
            🐸 Frog
          </button>
          <div className="w-px h-4 bg-border" />
          {/* Project selector */}
          <select
            value={newProjectId || ""}
            onChange={(e) => setNewProjectId(e.target.value || null)}
            className="bg-card border border-border rounded-md px-2 py-1 text-xs outline-none"
          >
            <option value="">No project</option>
            {data.projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.emoji} {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active tasks — frog first */}
      <div className="space-y-1">
        {activeTasks.length === 0 && todayTasks.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">
            No tasks yet. Add your 5 wins for today.
          </div>
        )}
        {activeTasks
          .sort((a, b) => (a.isFrog === b.isFrog ? 0 : a.isFrog ? -1 : 1))
          .map((task) => {
            const project = getProject(task.projectId);
            const catEmoji = task.category === "body" ? "🏋️" : task.category === "mind" ? "🧠" : "💰";
            return (
              <div
                key={task.id}
                className={cn(
                  "group flex items-center gap-3 px-3 py-3 rounded-lg border transition-colors",
                  task.timerRunning
                    ? "border-indigo-500/30 bg-indigo-500/5"
                    : task.isFrog
                    ? "border-amber-500/20 bg-amber-500/5"
                    : "border-transparent hover:bg-card"
                )}
              >
                <Checkbox
                  checked={false}
                  onCheckedChange={() => toggleTask(task.id)}
                  className="border-muted-foreground/40"
                />
                {task.isFrog && <span className="text-sm">🐸</span>}
                <span className="text-xs">{catEmoji}</span>
                <span className="flex-1 text-sm">{task.title}</span>
                {project && (
                  <Badge
                    variant="secondary"
                    className="text-xs"
                    style={{ borderColor: project.color + "40", color: project.color }}
                  >
                    {project.emoji} {project.name}
                  </Badge>
                )}
                <button
                  onClick={() => setFrog(task.id)}
                  className={cn(
                    "text-xs px-1.5 py-0.5 rounded transition-colors",
                    task.isFrog ? "text-amber-400" : "opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-amber-400"
                  )}
                  title="Set as frog (hardest task)"
                >
                  🐸
                </button>
                <TaskTimer task={task} />
                <button
                  onClick={() => deleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/20 hover:text-destructive transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })}
      </div>

      {/* Completed — Wins today */}
      {completedTasks.length > 0 && (
        <div className="mt-8">
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors mb-2"
          >
            🏆 Wins today ({completedTasks.length}) — +{completedTasks.length * 10} pts
          </button>
          {showCompleted && (
            <div className="space-y-1">
              {completedTasks.map((task) => {
                const catEmoji = task.category === "body" ? "🏋️" : task.category === "mind" ? "🧠" : "💰";
                return (
                  <div
                    key={task.id}
                    className="group flex items-center gap-3 px-3 py-2 rounded-lg"
                  >
                    <Checkbox checked={true} onCheckedChange={() => toggleTask(task.id)} />
                    <span className="text-xs">{catEmoji}</span>
                    <span className="flex-1 text-sm line-through text-muted-foreground">
                      {task.title}
                    </span>
                    <span className="text-xs text-emerald-400">+10</span>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/20 hover:text-destructive transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Parking Lot panel */}
      {showParkingLot && (
        <div className="mt-8 p-4 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium">🅿️ Parking Lot</h3>
            {data.parkingLot.length > 0 && (
              <button
                onClick={clearParkingLot}
                className="text-xs text-muted-foreground hover:text-destructive transition-colors"
              >
                Clear all
              </button>
            )}
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Got a thought? Park it here. Don&apos;t lose focus.
          </p>
          <div className="flex gap-2 mb-3">
            <Input
              placeholder="Quick thought..."
              value={parkingInput}
              onChange={(e) => setParkingInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleParkingAdd()}
              className="flex-1 bg-background border-border text-sm"
            />
            <button
              onClick={handleParkingAdd}
              disabled={!parkingInput.trim()}
              className="px-3 py-2 rounded-md bg-indigo-500 hover:bg-indigo-600 disabled:opacity-30 transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
          <div className="space-y-1">
            {data.parkingLot.map((item) => (
              <div key={item.id} className="group flex items-center gap-2 px-2 py-1.5 rounded text-sm">
                <span className="flex-1 text-muted-foreground">{item.text}</span>
                <button
                  onClick={() => deleteParkingLotItem(item.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/20 hover:text-destructive transition-all"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
            {data.parkingLot.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-2">Empty. Good — stay focused.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
