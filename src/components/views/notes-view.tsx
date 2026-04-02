"use client";

import { useState, useRef, useEffect } from "react";
import {
  Plus,
  Trash2,
  FolderPlus,
  FileText,
  Search,
  ChevronRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store-context";

export function NotesView() {
  const { data, addNote, updateNote, deleteNote, addNoteFolder, deleteNoteFolder } =
    useStore();
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const selectedNote = data.notes.find((n) => n.id === selectedNoteId);

  // Filter notes by folder and search
  const filteredNotes = data.notes
    .filter((n) => (selectedFolderId ? n.folderId === selectedFolderId : true))
    .filter(
      (n) =>
        !search ||
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.content.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const handleNewNote = () => {
    const id = addNote(selectedFolderId);
    setSelectedNoteId(id);
    setTimeout(() => titleRef.current?.focus(), 50);
  };

  const handleNewFolder = () => {
    if (!newFolderName.trim()) return;
    addNoteFolder(newFolderName.trim(), "#6366f1");
    setNewFolderName("");
    setShowNewFolder(false);
  };

  const handleTitleChange = (title: string) => {
    if (!selectedNote) return;
    updateNote(selectedNote.id, title, selectedNote.content);
  };

  const handleContentChange = (content: string) => {
    if (!selectedNote) return;
    updateNote(selectedNote.id, selectedNote.title, content);
  };

  const handleDeleteNote = (id: string) => {
    deleteNote(id);
    if (selectedNoteId === id) setSelectedNoteId(null);
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    if (d.toDateString() === now.toDateString()) {
      return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    }
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getPreview = (content: string) => {
    const line = content.split("\n").find((l) => l.trim()) || "";
    return line.slice(0, 80) || "No content";
  };

  // Auto-select first note if none selected
  useEffect(() => {
    if (!selectedNoteId && filteredNotes.length > 0) {
      setSelectedNoteId(filteredNotes[0].id);
    }
  }, [filteredNotes, selectedNoteId]);

  return (
    <div className="flex h-[calc(100vh-4rem)] -m-8">
      {/* Folders sidebar */}
      <div className="w-[180px] border-r border-border bg-[oklch(0.16_0_0)] flex flex-col">
        <div className="p-3 border-b border-border">
          <h3 className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
            Folders
          </h3>
        </div>
        <div className="flex-1 py-1 space-y-0.5 px-1.5 overflow-y-auto">
          {/* All notes */}
          <button
            onClick={() => setSelectedFolderId(null)}
            className={cn(
              "w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-sm transition-colors",
              !selectedFolderId
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
            )}
          >
            <FileText size={14} />
            <span>All Notes</span>
            <span className="ml-auto text-xs opacity-60">{data.notes.length}</span>
          </button>

          {data.noteFolders.map((folder) => {
            const count = data.notes.filter((n) => n.folderId === folder.id).length;
            return (
              <div key={folder.id} className="group flex items-center">
                <button
                  onClick={() => setSelectedFolderId(folder.id)}
                  className={cn(
                    "flex-1 flex items-center gap-2 px-2.5 py-1.5 rounded-md text-sm transition-colors",
                    selectedFolderId === folder.id
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                  )}
                >
                  <FolderPlus size={14} style={{ color: folder.color }} />
                  <span className="truncate">{folder.name}</span>
                  <span className="ml-auto text-xs opacity-60">{count}</span>
                </button>
                <button
                  onClick={() => deleteNoteFolder(folder.id)}
                  className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:text-destructive transition-all mr-1"
                >
                  <Trash2 size={10} />
                </button>
              </div>
            );
          })}

          {/* New folder */}
          {showNewFolder ? (
            <div className="px-1 py-1">
              <Input
                placeholder="Folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleNewFolder();
                  if (e.key === "Escape") setShowNewFolder(false);
                }}
                autoFocus
                className="h-7 text-xs bg-background"
              />
            </div>
          ) : (
            <button
              onClick={() => setShowNewFolder(true)}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <Plus size={12} />
              <span>New folder</span>
            </button>
          )}
        </div>
      </div>

      {/* Notes list */}
      <div className="w-[280px] border-r border-border flex flex-col">
        <div className="p-3 border-b border-border flex items-center gap-2">
          <div className="flex-1 relative">
            <Search
              size={14}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              placeholder="Search notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 pl-8 text-xs bg-background"
            />
          </div>
          <button
            onClick={handleNewNote}
            className="p-1.5 rounded-md bg-indigo-500 hover:bg-indigo-600 transition-colors"
          >
            <Plus size={14} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredNotes.length === 0 && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No notes yet.
              <br />
              <button
                onClick={handleNewNote}
                className="text-indigo-400 hover:text-indigo-300 mt-2 inline-block"
              >
                Create one
              </button>
            </div>
          )}
          {filteredNotes.map((note) => (
            <button
              key={note.id}
              onClick={() => setSelectedNoteId(note.id)}
              className={cn(
                "w-full text-left px-3 py-2.5 border-b border-border transition-colors group",
                selectedNoteId === note.id
                  ? "bg-indigo-500/10"
                  : "hover:bg-accent/30"
              )}
            >
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">
                    {note.title || "Untitled"}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-muted-foreground">
                      {formatDate(note.updatedAt)}
                    </span>
                    <span className="text-xs text-muted-foreground truncate">
                      {getPreview(note.content)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteNote(note.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:text-destructive transition-all mt-0.5"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col">
        {selectedNote ? (
          <>
            <div className="px-8 pt-6 pb-2 border-b border-border">
              <input
                ref={titleRef}
                value={selectedNote.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Note title"
                className="w-full bg-transparent text-xl font-heading font-bold outline-none placeholder:text-muted-foreground/40"
              />
              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                <span>{formatDate(selectedNote.updatedAt)}</span>
                {selectedNote.folderId && (
                  <>
                    <ChevronRight size={10} />
                    <span>
                      {data.noteFolders.find((f) => f.id === selectedNote.folderId)?.name ||
                        "Unknown"}
                    </span>
                  </>
                )}
                <span className="ml-auto">
                  {selectedNote.content.length} chars
                </span>
              </div>
            </div>
            <textarea
              ref={contentRef}
              value={selectedNote.content}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder="Start writing..."
              className="flex-1 px-8 py-4 bg-transparent outline-none resize-none text-sm leading-relaxed placeholder:text-muted-foreground/30"
              spellCheck={false}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <FileText size={48} className="mx-auto mb-4 opacity-20" />
              <p className="text-sm">Select a note or create a new one</p>
              <button
                onClick={handleNewNote}
                className="mt-3 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                New note
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
