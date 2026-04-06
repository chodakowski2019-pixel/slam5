"use client";

import { useState, useRef } from "react";
import { Plus, Trash2, Clock, ParkingSquare, GripVertical } from "lucide-react";
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
  const { data, addTask, toggleTask, deleteTask, setFrog, reorderTasks, addParkingLotItem, deleteParkingLotItem, clearParkingLot } = useStore();
  const dragId = useRef<string | null>(null);
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
        <h2 className="text-xl font-heading font-bold">Power List</h2>
        <div className="flex items-center gap-3">
          <span className={`text-sm font-medium ${atLimit ? "text-amber-400" : "text-muted-foreground"}`}>
            {todayTasks.length}/{MAX_DAILY_TASKS}
          </span>
          <button
            onClick={() => setShowParkingLot(!showParkingLot)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-all duration-200",
              showParkingLot ? "bg-emerald-500/15 text-emerald-400" : "text-muted-foreground hover:bg-accent"
            )}
          >
            <ParkingSquare size={14} />
            {!showParkingLot && data.parkingLot.length > 0 && `(${data.parkingLot.length})`}
          </button>
        </div>
      </div>

      {/* Add task */}
      <div className="space-y-2 mb-8">
        <div className="flex gap-2">
          <Input
            placeholder={atLimit ? `Max ${MAX_DAILY_TASKS} tasks` : "What needs to get done?"}
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            disabled={atLimit}
            className="flex-1 bg-card border-border h-10"
          />
          <div className="flex items-center gap-1 bg-card border border-border rounded-xl px-3">
            <Clock size={13} className="text-muted-foreground" />
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
            className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus size={16} />
          </button>
        </div>
        <div className="flex gap-2 items-center flex-wrap">
          {data.projects.length > 0 && (
            <>
              <div className="flex gap-1">
                {data.projects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setNewProjectId(newProjectId === p.id ? null : p.id)}
                    className={cn(
                      "px-3 py-1.5 rounded-xl text-xs transition-all duration-200",
                      newProjectId === p.id
                        ? "font-medium"
                        : "text-muted-foreground hover:bg-accent"
                    )}
                    style={newProjectId === p.id ? { backgroundColor: p.color + "20", color: p.color } : {}}
                  >
                    {p.emoji} {p.name}
                  </button>
                ))}
              </div>
              <div className="w-px h-4 bg-border" />
            </>
          )}
          <button
            onClick={() => setNewIsFrog(!newIsFrog)}
            className={cn(
              "px-3 py-1.5 rounded-xl text-xs transition-all duration-200",
              newIsFrog
                ? "bg-amber-500/15 text-amber-400 font-medium"
                : "text-muted-foreground hover:bg-accent"
            )}
          >
            🐸 Heavy task
          </button>
        </div>
      </div>

      {/* Active tasks */}
      <div className="space-y-1">
        {activeTasks.length === 0 && todayTasks.length === 0 && (
          <div className="text-center py-16 text-muted-foreground text-sm">
            No tasks yet. Add your 5.
          </div>
        )}
        {activeTasks
          .map((task) => {
            const project = getProject(task.projectId);
            return (
              <div
                key={task.id}
                draggable
                onDragStart={(e) => {
                  dragId.current = task.id;
                  const ghost = document.createElement("div");
                  ghost.textContent = task.title;
                  ghost.style.cssText = "position:fixed;top:-100px;background:#1a1a1a;color:white;padding:8px 14px;border-radius:10px;font-size:13px;white-space:nowrap;";
                  document.body.appendChild(ghost);
                  e.dataTransfer.setDragImage(ghost, 0, 0);
                  setTimeout(() => document.body.removeChild(ghost), 0);
                }}
                onDragOver={(e) => { e.preventDefault(); }}
                onDrop={() => {
                  if (dragId.current && dragId.current !== task.id) {
                    reorderTasks(dragId.current, task.id);
                  }
                  dragId.current = null;
                }}
                className={cn(
                  "group flex items-center gap-3 px-4 py-3.5 rounded-2xl border transition-all duration-200 cursor-grab active:cursor-grabbing",
                  task.timerRunning
                    ? "border-emerald-500/20 bg-emerald-500/5"
                    : task.isFrog
                    ? "border-amber-500/15 bg-amber-500/5"
                    : "border-transparent hover:bg-card"
                )}
              >
                <GripVertical size={14} className="text-muted-foreground/40 group-hover:text-muted-foreground transition-colors flex-shrink-0" />
                <Checkbox
                  checked={false}
                  onCheckedChange={() => toggleTask(task.id)}
                  className="border-muted-foreground/40"
                />
                {task.isFrog && <span className="text-sm">🐸</span>}
                <span className="flex-1 text-sm">{task.title}</span>
                {project && (
                  <Badge
                    variant="secondary"
                    className="text-xs"
                    style={{ borderColor: project.color + "30", color: project.color }}
                  >
                    {project.emoji} {project.name}
                  </Badge>
                )}
                <TaskTimer task={task} />
                <button
                  onClick={() => deleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-destructive/20 hover:text-destructive transition-all duration-200"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })}
      </div>

      {/* Done */}
      {completedTasks.length > 0 && (
        <div className="mt-8">
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors mb-3"
          >
            Done ({completedTasks.length}) — +{completedTasks.length * 10} pts
          </button>
          {showCompleted && (
            <div className="space-y-1">
              {completedTasks.map((task) => {
                return (
                  <div
                    key={task.id}
                    className="group flex items-center gap-3 px-4 py-2.5 rounded-2xl opacity-40"
                  >
                    <Checkbox checked={true} onCheckedChange={() => toggleTask(task.id)} />
                    <span className="flex-1 text-sm line-through text-muted-foreground">
                      {task.title}
                    </span>
                    <span className="text-xs text-emerald-400">+10</span>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-destructive/20 hover:text-destructive transition-all duration-200"
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

      {/* Parking Lot */}
      {showParkingLot && (
        <div className="mt-8 p-5 rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium">Parking Lot</h3>
            {data.parkingLot.length > 0 && (
              <button
                onClick={clearParkingLot}
                className="text-xs text-muted-foreground hover:text-destructive transition-colors"
              >
                Clear
              </button>
            )}
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Random thought? Park it here. Stay focused.
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
              className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-30 transition-all duration-200"
            >
              <Plus size={14} />
            </button>
          </div>
          <div className="space-y-1">
            {data.parkingLot.map((item) => (
              <div key={item.id} className="group flex items-center gap-2 px-3 py-2 rounded-xl text-sm hover:bg-accent/30 transition-colors">
                <span className="flex-1 text-muted-foreground">{item.text}</span>
                <button
                  onClick={() => deleteParkingLotItem(item.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-destructive/20 hover:text-destructive transition-all"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
            {data.parkingLot.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-3">Empty. Stay focused.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
