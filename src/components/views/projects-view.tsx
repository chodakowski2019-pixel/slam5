"use client";

import { useState } from "react";
import { Plus, Trash2, CheckSquare, Pencil, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/store-context";

const COLORS = [
  "#10b981", "#f472b6", "#14b8a6", "#fbbf24", "#f87171",
  "#34d399", "#22d3ee", "#fb923c",
];

function EditableProject({ project, onDone }: { project: { id: string; name: string; emoji: string; color: string; description: string }; onDone: () => void }) {
  const { updateProject } = useStore();
  const [name, setName] = useState(project.name);
  const [emoji, setEmoji] = useState(project.emoji);
  const [color, setColor] = useState(project.color);
  const [description, setDescription] = useState(project.description);

  const handleSave = () => {
    if (!name.trim()) return;
    updateProject(project.id, { name: name.trim(), emoji, color, description: description.trim() });
    onDone();
  };

  return (
    <div className="p-5 rounded-2xl border border-emerald-500/30 bg-card space-y-3">
      <div className="flex gap-2">
        <Input
          value={emoji}
          onChange={(e) => setEmoji(e.target.value.slice(0, 2))}
          className="w-16 bg-background text-center"
        />
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 bg-background"
          autoFocus
        />
      </div>
      <Input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        className="bg-background"
      />
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground mr-1">Color:</span>
        {COLORS.map((c) => (
          <button
            key={c}
            onClick={() => setColor(c)}
            className="w-6 h-6 rounded-full transition-all duration-200"
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
        <button onClick={onDone} className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <X size={14} />
        </button>
        <button onClick={handleSave} className="px-4 py-1.5 text-sm rounded-xl bg-emerald-500 hover:bg-emerald-400 transition-all duration-200 flex items-center gap-1">
          <Check size={14} /> Save
        </button>
      </div>
    </div>
  );
}

export function ProjectsView() {
  const { data, addProject, deleteProject } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("📁");
  const [color, setColor] = useState(COLORS[0]);
  const [description, setDescription] = useState("");

  const handleAdd = () => {
    if (!name.trim()) return;
    addProject(name.trim(), emoji, color, description.trim());
    setName("");
    setEmoji("📁");
    setColor(COLORS[0]);
    setDescription("");
    setShowForm(false);
  };

  const getProjectTasks = (projectId: string) =>
    data.tasks.filter((t) => t.projectId === projectId);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-bold">Projects</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 transition-all duration-200 text-sm font-medium hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus size={14} />
          New
        </button>
      </div>

      {showForm && (
        <div className="p-5 rounded-2xl border border-border bg-card mb-6 space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Emoji"
              value={emoji}
              onChange={(e) => setEmoji(e.target.value.slice(0, 2))}
              className="w-16 bg-background text-center"
            />
            <Input
              placeholder="Project name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 bg-background"
              autoFocus
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
                className="w-6 h-6 rounded-full transition-all duration-200"
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
            <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={!name.trim()}
              className="px-4 py-2 text-sm rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-30 transition-all duration-200"
            >
              Create
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {data.projects.map((project) => {
          const tasks = getProjectTasks(project.id);
          const active = tasks.filter((t) => !t.completed).length;
          const completed = tasks.filter((t) => t.completed).length;

          if (editingId === project.id) {
            return <EditableProject key={project.id} project={project} onDone={() => setEditingId(null)} />;
          }

          return (
            <div
              key={project.id}
              className="group p-5 rounded-2xl border border-border bg-card hover:bg-accent/30 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                    style={{ backgroundColor: project.color + "15", color: project.color }}
                  >
                    {project.emoji}
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">{project.name}</h3>
                    {project.description && (
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{project.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingId(project.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-accent transition-all duration-200 text-muted-foreground"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => deleteProject(project.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-destructive/20 hover:text-destructive transition-all duration-200"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
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
                    className="h-full rounded-full transition-all duration-500"
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
