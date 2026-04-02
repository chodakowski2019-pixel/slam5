"use client";

import { useState } from "react";
import { Plus, Trash2, Clock } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store-context";
import { TaskTimer } from "@/components/task-timer";

export function TasksView() {
  const { data, addTask, toggleTask, deleteTask } = useStore();
  const [newTitle, setNewTitle] = useState("");
  const [newMinutes, setNewMinutes] = useState(25);
  const [newProjectId, setNewProjectId] = useState<string | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);

  const activeTasks = data.tasks.filter((t) => !t.completed);
  const completedTasks = data.tasks.filter((t) => t.completed);

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    addTask(newTitle.trim(), newProjectId, newMinutes);
    setNewTitle("");
    setNewMinutes(25);
    setNewProjectId(null);
  };

  const getProject = (id: string | null) =>
    id ? data.projects.find((p) => p.id === id) : null;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Tasks</h2>
        <span className="text-sm text-muted-foreground">
          {activeTasks.length} active
        </span>
      </div>

      {/* New task form */}
      <div className="flex gap-2 mb-6">
        <Input
          placeholder="New task..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
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
        <select
          value={newProjectId || ""}
          onChange={(e) => setNewProjectId(e.target.value || null)}
          className="bg-card border border-border rounded-md px-2 text-sm outline-none"
        >
          <option value="">No project</option>
          {data.projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.emoji} {p.name}
            </option>
          ))}
        </select>
        <button
          onClick={handleAdd}
          disabled={!newTitle.trim()}
          className="px-3 py-2 rounded-md bg-indigo-500 hover:bg-indigo-600 disabled:opacity-30 transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Active tasks */}
      <div className="space-y-1">
        {activeTasks.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">
            No tasks yet. Add one above.
          </div>
        )}
        {activeTasks.map((task) => {
          const project = getProject(task.projectId);
          return (
            <div
              key={task.id}
              className={cn(
                "group flex items-center gap-3 px-3 py-3 rounded-lg border transition-colors",
                task.timerRunning
                  ? "border-indigo-500/30 bg-indigo-500/5"
                  : "border-transparent hover:bg-card"
              )}
            >
              <Checkbox
                checked={false}
                onCheckedChange={() => toggleTask(task.id)}
                className="border-muted-foreground/40"
              />
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

      {/* Completed */}
      {completedTasks.length > 0 && (
        <div className="mt-8">
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
          >
            {showCompleted ? "Hide" : "Show"} completed ({completedTasks.length})
          </button>
          {showCompleted && (
            <div className="space-y-1">
              {completedTasks.map((task) => (
                <div
                  key={task.id}
                  className="group flex items-center gap-3 px-3 py-2 rounded-lg"
                >
                  <Checkbox
                    checked={true}
                    onCheckedChange={() => toggleTask(task.id)}
                  />
                  <span className="flex-1 text-sm line-through text-muted-foreground">
                    {task.title}
                  </span>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/20 hover:text-destructive transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
