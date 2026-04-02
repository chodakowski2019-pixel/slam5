"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import {
  StoreData,
  Task,
  Project,
  FinanceEntry,
  Note,
  NoteFolder,
  Goal,
  Milestone,
  CrmPerson,
  CrmCohort,
  CrmCustomColumn,
  generateId,
} from "./store";

interface StoreContextType {
  data: StoreData;
  // Tasks
  addTask: (title: string, projectId: string | null, timerMinutes: number) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  updateTaskTimer: (id: string, secondsLeft: number | null, running: boolean) => void;
  // Projects
  addProject: (name: string, emoji: string, color: string, description: string) => void;
  deleteProject: (id: string) => void;
  // Finances
  addFinance: (entry: Omit<FinanceEntry, "id">) => void;
  deleteFinance: (id: string) => void;
  // Notes
  addNote: (folderId: string | null) => string;
  updateNote: (id: string, title: string, content: string) => void;
  deleteNote: (id: string) => void;
  addNoteFolder: (name: string, color: string) => void;
  deleteNoteFolder: (id: string) => void;
  // Goals
  addGoal: (goal: Omit<Goal, "id" | "createdAt" | "milestones" | "completed" | "progress">) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  addMilestone: (goalId: string, title: string) => void;
  toggleMilestone: (goalId: string, milestoneId: string) => void;
  deleteMilestone: (goalId: string, milestoneId: string) => void;
  // CRM
  addCrmPerson: (person: Omit<CrmPerson, "id" | "createdAt" | "payments" | "needsInvoice" | "notes" | "customFields">) => void;
  updateCrmPerson: (id: string, updates: Partial<CrmPerson>) => void;
  deleteCrmPerson: (id: string) => void;
  toggleCrmPayment: (personId: string, monthIndex: number) => void;
  addCrmCohort: (name: string, color: string) => void;
  deleteCrmCohort: (id: string) => void;
  addCrmColumn: (name: string) => void;
  deleteCrmColumn: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

const EMPTY: StoreData = { tasks: [], projects: [], finances: [], notes: [], noteFolders: [], goals: [], crmPersons: [], crmCohorts: [], crmColumns: [] };

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<StoreData>(EMPTY);
  const [loaded, setLoaded] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dataRef = useRef(data);
  dataRef.current = data;

  // Load from API on mount
  useEffect(() => {
    fetch("/api/data")
      .then((r) => r.json())
      .then((d) => {
        // Ensure new fields exist for old data files
        setData({
          ...d,
          notes: d.notes || [],
          noteFolders: d.noteFolders || [{ id: "notes", name: "Notes", color: "#6366f1" }],
          goals: d.goals || [],
          crmPersons: d.crmPersons || [],
          crmCohorts: d.crmCohorts || [],
          crmColumns: d.crmColumns || [],
        });
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  // Debounced save to API
  useEffect(() => {
    if (!loaded) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);

    const hasRunningTimer = data.tasks.some((t) => t.timerRunning);
    const delay = hasRunningTimer ? 2000 : 300;

    saveTimer.current = setTimeout(() => {
      fetch("/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).catch(() => {});
    }, delay);

    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [data, loaded]);

  // Tasks
  const addTask = useCallback(
    (title: string, projectId: string | null, timerMinutes: number) => {
      const task: Task = {
        id: generateId(),
        title,
        completed: false,
        projectId,
        timerMinutes,
        timerSecondsLeft: null,
        timerRunning: false,
        createdAt: new Date().toISOString(),
        completedAt: null,
      };
      setData((prev) => ({ ...prev, tasks: [task, ...prev.tasks] }));
    },
    []
  );

  const toggleTask = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) =>
        t.id === id
          ? {
              ...t,
              completed: !t.completed,
              completedAt: !t.completed ? new Date().toISOString() : null,
              timerRunning: false,
            }
          : t
      ),
    }));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setData((prev) => ({ ...prev, tasks: prev.tasks.filter((t) => t.id !== id) }));
  }, []);

  const updateTaskTimer = useCallback(
    (id: string, secondsLeft: number | null, running: boolean) => {
      setData((prev) => ({
        ...prev,
        tasks: prev.tasks.map((t) =>
          t.id === id ? { ...t, timerSecondsLeft: secondsLeft, timerRunning: running } : t
        ),
      }));
    },
    []
  );

  // Projects
  const addProject = useCallback(
    (name: string, emoji: string, color: string, description: string) => {
      const project: Project = {
        id: generateId(),
        name,
        emoji,
        color,
        description,
        createdAt: new Date().toISOString(),
      };
      setData((prev) => ({ ...prev, projects: [...prev.projects, project] }));
    },
    []
  );

  const deleteProject = useCallback((id: string) => {
    setData((prev) => ({ ...prev, projects: prev.projects.filter((p) => p.id !== id) }));
  }, []);

  // Finances
  const addFinance = useCallback((entry: Omit<FinanceEntry, "id">) => {
    const finance: FinanceEntry = { ...entry, id: generateId() };
    setData((prev) => ({ ...prev, finances: [finance, ...prev.finances] }));
  }, []);

  const deleteFinance = useCallback((id: string) => {
    setData((prev) => ({ ...prev, finances: prev.finances.filter((f) => f.id !== id) }));
  }, []);

  // Notes
  const addNote = useCallback((folderId: string | null): string => {
    const id = generateId();
    const note: Note = {
      id,
      title: "",
      content: "",
      folderId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setData((prev) => ({ ...prev, notes: [note, ...prev.notes] }));
    return id;
  }, []);

  const updateNote = useCallback((id: string, title: string, content: string) => {
    setData((prev) => ({
      ...prev,
      notes: prev.notes.map((n) =>
        n.id === id ? { ...n, title, content, updatedAt: new Date().toISOString() } : n
      ),
    }));
  }, []);

  const deleteNote = useCallback((id: string) => {
    setData((prev) => ({ ...prev, notes: prev.notes.filter((n) => n.id !== id) }));
  }, []);

  const addNoteFolder = useCallback((name: string, color: string) => {
    const folder: NoteFolder = { id: generateId(), name, color };
    setData((prev) => ({ ...prev, noteFolders: [...prev.noteFolders, folder] }));
  }, []);

  const deleteNoteFolder = useCallback((id: string) => {
    setData((prev) => ({ ...prev, noteFolders: prev.noteFolders.filter((f) => f.id !== id) }));
  }, []);

  // Goals
  const addGoal = useCallback(
    (goal: Omit<Goal, "id" | "createdAt" | "milestones" | "completed" | "progress">) => {
      const newGoal: Goal = {
        ...goal,
        id: generateId(),
        milestones: [],
        progress: 0,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      setData((prev) => ({ ...prev, goals: [newGoal, ...prev.goals] }));
    },
    []
  );

  const updateGoal = useCallback((id: string, updates: Partial<Goal>) => {
    setData((prev) => ({
      ...prev,
      goals: prev.goals.map((g) => (g.id === id ? { ...g, ...updates } : g)),
    }));
  }, []);

  const deleteGoal = useCallback((id: string) => {
    setData((prev) => ({ ...prev, goals: prev.goals.filter((g) => g.id !== id) }));
  }, []);

  const addMilestone = useCallback((goalId: string, title: string) => {
    const ms: Milestone = { id: generateId(), title, completed: false };
    setData((prev) => ({
      ...prev,
      goals: prev.goals.map((g) =>
        g.id === goalId ? { ...g, milestones: [...g.milestones, ms] } : g
      ),
    }));
  }, []);

  const toggleMilestone = useCallback((goalId: string, milestoneId: string) => {
    setData((prev) => ({
      ...prev,
      goals: prev.goals.map((g) => {
        if (g.id !== goalId) return g;
        const milestones = g.milestones.map((m) =>
          m.id === milestoneId ? { ...m, completed: !m.completed } : m
        );
        const done = milestones.filter((m) => m.completed).length;
        const progress = milestones.length > 0 ? Math.round((done / milestones.length) * 100) : g.progress;
        return { ...g, milestones, progress };
      }),
    }));
  }, []);

  const deleteMilestone = useCallback((goalId: string, milestoneId: string) => {
    setData((prev) => ({
      ...prev,
      goals: prev.goals.map((g) => {
        if (g.id !== goalId) return g;
        const milestones = g.milestones.filter((m) => m.id !== milestoneId);
        const done = milestones.filter((m) => m.completed).length;
        const progress = milestones.length > 0 ? Math.round((done / milestones.length) * 100) : 0;
        return { ...g, milestones, progress };
      }),
    }));
  }, []);

  // CRM
  const addCrmPerson = useCallback(
    (person: Omit<CrmPerson, "id" | "createdAt" | "payments" | "needsInvoice" | "notes" | "customFields">) => {
      const p: CrmPerson = {
        ...person,
        id: generateId(),
        payments: [false, false, false, false, false, false],
        needsInvoice: false,
        notes: "",
        customFields: {},
        createdAt: new Date().toISOString(),
      };
      setData((prev) => ({ ...prev, crmPersons: [...prev.crmPersons, p] }));
    },
    []
  );

  const updateCrmPerson = useCallback((id: string, updates: Partial<CrmPerson>) => {
    setData((prev) => ({
      ...prev,
      crmPersons: prev.crmPersons.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }));
  }, []);

  const deleteCrmPerson = useCallback((id: string) => {
    setData((prev) => ({ ...prev, crmPersons: prev.crmPersons.filter((p) => p.id !== id) }));
  }, []);

  const toggleCrmPayment = useCallback((personId: string, monthIndex: number) => {
    setData((prev) => ({
      ...prev,
      crmPersons: prev.crmPersons.map((p) => {
        if (p.id !== personId) return p;
        const payments = [...p.payments];
        payments[monthIndex] = !payments[monthIndex];
        return { ...p, payments };
      }),
    }));
  }, []);

  const addCrmCohort = useCallback((name: string, color: string) => {
    const cohort: CrmCohort = { id: generateId(), name, color, createdAt: new Date().toISOString() };
    setData((prev) => ({ ...prev, crmCohorts: [...prev.crmCohorts, cohort] }));
  }, []);

  const deleteCrmCohort = useCallback((id: string) => {
    setData((prev) => ({ ...prev, crmCohorts: prev.crmCohorts.filter((c) => c.id !== id) }));
  }, []);

  const addCrmColumn = useCallback((name: string) => {
    const col: CrmCustomColumn = { id: generateId(), name };
    setData((prev) => ({ ...prev, crmColumns: [...prev.crmColumns, col] }));
  }, []);

  const deleteCrmColumn = useCallback((id: string) => {
    setData((prev) => ({ ...prev, crmColumns: prev.crmColumns.filter((c) => c.id !== id) }));
  }, []);

  if (!loaded) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <StoreContext.Provider
      value={{
        data,
        addTask,
        toggleTask,
        deleteTask,
        updateTaskTimer,
        addProject,
        deleteProject,
        addFinance,
        deleteFinance,
        addNote,
        updateNote,
        deleteNote,
        addNoteFolder,
        deleteNoteFolder,
        addGoal,
        updateGoal,
        deleteGoal,
        addMilestone,
        toggleMilestone,
        deleteMilestone,
        addCrmPerson,
        updateCrmPerson,
        deleteCrmPerson,
        toggleCrmPayment,
        addCrmCohort,
        deleteCrmCohort,
        addCrmColumn,
        deleteCrmColumn,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
