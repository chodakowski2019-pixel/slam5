"use client";

import { useState } from "react";
import {
  Plus,
  Trash2,
  Trophy,
  Calendar,
  ChevronDown,
  ChevronRight,
  Check,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store-context";
import { Goal } from "@/lib/store";

const HORIZONS = [
  { value: "6m" as const, label: "6 months", color: "#6366f1" },
  { value: "1y" as const, label: "1 year", color: "#10b981" },
  { value: "3y" as const, label: "3 years", color: "#f59e0b" },
  { value: "5y" as const, label: "5 years", color: "#ec4899" },
];

function GoalCard({ goal }: { goal: Goal }) {
  const { updateGoal, deleteGoal, addMilestone, toggleMilestone, deleteMilestone, data } =
    useStore();
  const [expanded, setExpanded] = useState(false);
  const [newMs, setNewMs] = useState("");

  const horizon = HORIZONS.find((h) => h.value === goal.horizon);
  const project = goal.projectId ? data.projects.find((p) => p.id === goal.projectId) : null;

  const daysLeft = Math.max(
    0,
    Math.ceil(
      (new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    )
  );

  const handleAddMs = () => {
    if (!newMs.trim()) return;
    addMilestone(goal.id, newMs.trim());
    setNewMs("");
  };

  return (
    <div
      className={cn(
        "rounded-2xl border bg-card transition-all",
        goal.completed ? "border-emerald-500/30 opacity-60" : "border-border"
      )}
    >
      {/* Header */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-1 p-0.5 rounded hover:bg-accent transition-colors text-muted-foreground"
          >
            {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-[10px] uppercase tracking-wider font-medium px-1.5 py-0.5 rounded"
                style={{
                  backgroundColor: (horizon?.color || "#6366f1") + "20",
                  color: horizon?.color || "#6366f1",
                }}
              >
                {horizon?.label}
              </span>
              {project && (
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded"
                  style={{
                    backgroundColor: project.color + "20",
                    color: project.color,
                  }}
                >
                  {project.emoji} {project.name}
                </span>
              )}
              {goal.completed && (
                <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <Check size={10} /> Completed
                </span>
              )}
            </div>

            <h3 className="font-heading font-semibold text-base">{goal.title}</h3>

            {goal.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {goal.description}
              </p>
            )}

            {/* Progress bar */}
            <div className="mt-3 flex items-center gap-3">
              <div className="flex-1 h-2 rounded-full bg-border overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${goal.progress}%`,
                    backgroundColor: horizon?.color || "#6366f1",
                  }}
                />
              </div>
              <span className="text-xs font-mono tabular-nums text-muted-foreground w-10 text-right">
                {goal.progress}%
              </span>
            </div>

            {/* Meta */}
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar size={11} />
                <span>
                  {new Date(goal.deadline).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <span
                className={cn(
                  daysLeft <= 30 && !goal.completed ? "text-amber-400" : ""
                )}
              >
                {daysLeft} days left
              </span>
              <span>
                {goal.milestones.filter((m) => m.completed).length}/{goal.milestones.length} milestones
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {!goal.completed && (
              <button
                onClick={() => updateGoal(goal.id, { completed: true, progress: 100 })}
                className="p-1.5 rounded-xl hover:bg-emerald-500/20 hover:text-emerald-400 transition-colors text-muted-foreground"
                title="Mark complete"
              >
                <Trophy size={14} />
              </button>
            )}
            <button
              onClick={() => deleteGoal(goal.id)}
              className="p-1.5 rounded-xl hover:bg-destructive/20 hover:text-destructive transition-colors text-muted-foreground"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Milestones (expanded) */}
      {expanded && (
        <div className="px-4 pb-4 pt-0 border-t border-border mt-0">
          <div className="pt-3 space-y-1.5">
            {goal.milestones.map((ms) => (
              <div
                key={ms.id}
                className="group flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-accent/30 transition-colors"
              >
                <Checkbox
                  checked={ms.completed}
                  onCheckedChange={() => toggleMilestone(goal.id, ms.id)}
                  className="border-muted-foreground/40"
                />
                <span
                  className={cn(
                    "flex-1 text-sm",
                    ms.completed && "line-through text-muted-foreground"
                  )}
                >
                  {ms.title}
                </span>
                <button
                  onClick={() => deleteMilestone(goal.id, ms.id)}
                  className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:text-destructive transition-all"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}

            {/* Add milestone */}
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="Add milestone..."
                value={newMs}
                onChange={(e) => setNewMs(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddMs()}
                className="flex-1 h-8 text-xs bg-background"
              />
              <button
                onClick={handleAddMs}
                disabled={!newMs.trim()}
                className="px-2 h-8 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:opacity-30 transition-colors"
              >
                <Plus size={12} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function GoalsView() {
  const { data, addGoal } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [horizon, setHorizon] = useState<"6m" | "1y" | "3y" | "5y">("1y");
  const [deadline, setDeadline] = useState("");
  const [projectId, setProjectId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const handleAdd = () => {
    if (!title.trim() || !deadline) return;
    addGoal({ title: title.trim(), description: description.trim(), deadline, horizon, projectId });
    setTitle("");
    setDescription("");
    setDeadline("");
    setShowForm(false);
  };

  const activeGoals = data.goals.filter((g) => !g.completed);
  const completedGoals = data.goals.filter((g) => g.completed);

  const filteredActive =
    filter === "all"
      ? activeGoals
      : activeGoals.filter((g) => g.horizon === filter);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-bold">Goals</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 transition-colors text-sm"
        >
          <Plus size={14} />
          New goal
        </button>
      </div>

      {/* Horizon filter */}
      <div className="flex gap-1.5 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={cn(
            "px-3 py-1 rounded-xl text-xs transition-colors",
            filter === "all"
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          All ({activeGoals.length})
        </button>
        {HORIZONS.map((h) => {
          const count = activeGoals.filter((g) => g.horizon === h.value).length;
          return (
            <button
              key={h.value}
              onClick={() => setFilter(h.value)}
              className={cn(
                "px-3 py-1 rounded-xl text-xs transition-colors",
                filter === h.value
                  ? "text-white"
                  : "text-muted-foreground hover:text-foreground"
              )}
              style={
                filter === h.value
                  ? { backgroundColor: h.color + "30", color: h.color }
                  : {}
              }
            >
              {h.label} ({count})
            </button>
          );
        })}
      </div>

      {/* New goal form */}
      {showForm && (
        <div className="p-4 rounded-2xl border border-border bg-card mb-6 space-y-3">
          <Input
            placeholder="Goal title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-background font-medium"
          />
          <Input
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-background"
          />
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 block">
                Horizon
              </label>
              <div className="flex gap-1">
                {HORIZONS.map((h) => (
                  <button
                    key={h.value}
                    onClick={() => setHorizon(h.value)}
                    className={cn(
                      "px-2.5 py-1 rounded-xl text-xs transition-colors",
                      horizon === h.value ? "text-white" : "text-muted-foreground"
                    )}
                    style={
                      horizon === h.value
                        ? { backgroundColor: h.color, color: "white" }
                        : {}
                    }
                  >
                    {h.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 block">
                Deadline
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="bg-background border border-border rounded-xl px-2 py-1 text-sm outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 block">
                Project
              </label>
              <select
                value={projectId || ""}
                onChange={(e) => setProjectId(e.target.value || null)}
                className="bg-background border border-border rounded-xl px-2 py-1 text-sm outline-none h-[34px]"
              >
                <option value="">None</option>
                {data.projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.emoji} {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setShowForm(false)}
              className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={!title.trim() || !deadline}
              className="px-3 py-1.5 text-sm rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:opacity-30 transition-colors"
            >
              Create
            </button>
          </div>
        </div>
      )}

      {/* Active goals */}
      <div className="space-y-3">
        {filteredActive.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Trophy size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-sm">No goals yet. Add one.</p>
          </div>
        )}
        {filteredActive.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </div>

      {/* Completed goals */}
      {completedGoals.length > 0 && (
        <div className="mt-10">
          <h3 className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-3">
            Completed ({completedGoals.length})
          </h3>
          <div className="space-y-3">
            {completedGoals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
