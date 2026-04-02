"use client";

import { useState } from "react";
import { Plus, Trash2, CheckSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/store-context";

const COLORS = [
  "#6366f1", "#ec4899", "#10b981", "#f59e0b", "#ef4444",
  "#8b5cf6", "#06b6d4", "#f97316",
];

export function ProjectsView() {
  const { data, addProject, deleteProject } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("P");
  const [color, setColor] = useState(COLORS[0]);
  const [description, setDescription] = useState("");

  const handleAdd = () => {
    if (!name.trim()) return;
    addProject(name.trim(), emoji, color, description.trim());
    setName("");
    setEmoji("P");
    setColor(COLORS[0]);
    setDescription("");
    setShowForm(false);
  };

  const getProjectTasks = (projectId: string) =>
    data.tasks.filter((t) => t.projectId === projectId);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Projects</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-indigo-500 hover:bg-indigo-600 transition-colors text-sm"
        >
          <Plus size={14} />
          New project
        </button>
      </div>

      {/* New project form */}
      {showForm && (
        <div className="p-4 rounded-xl border border-border bg-card mb-6 space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Emoji (1 char)"
              value={emoji}
              onChange={(e) => setEmoji(e.target.value.slice(0, 2))}
              className="w-20 bg-background"
            />
            <Input
              placeholder="Project name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 bg-background"
            />
          </div>
          <Input
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-background"
          />
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground mr-1">Color:</span>
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className="w-6 h-6 rounded-full transition-transform"
                style={{
                  backgroundColor: c,
                  transform: color === c ? "scale(1.3)" : "scale(1)",
                  outline: color === c ? "2px solid white" : "none",
                  outlineOffset: "2px",
                }}
              />
            ))}
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
              disabled={!name.trim()}
              className="px-3 py-1.5 text-sm rounded-md bg-indigo-500 hover:bg-indigo-600 disabled:opacity-30 transition-colors"
            >
              Create
            </button>
          </div>
        </div>
      )}

      {/* Project cards */}
      <div className="grid grid-cols-2 gap-4">
        {data.projects.map((project) => {
          const tasks = getProjectTasks(project.id);
          const active = tasks.filter((t) => !t.completed).length;
          const completed = tasks.filter((t) => t.completed).length;

          return (
            <div
              key={project.id}
              className="group p-4 rounded-xl border border-border bg-card hover:bg-accent/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-medium"
                    style={{ backgroundColor: project.color + "20", color: project.color }}
                  >
                    {project.emoji}
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">{project.name}</h3>
                    {project.description && (
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                        {project.description}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => deleteProject(project.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/20 hover:text-destructive transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <CheckSquare size={12} />
                  <span>{active} active</span>
                </div>
                <span>{completed} done</span>
              </div>

              {tasks.length > 0 && (
                <div className="mt-3 h-1.5 rounded-full bg-border overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${tasks.length > 0 ? (completed / tasks.length) * 100 : 0}%`,
                      backgroundColor: project.color,
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
