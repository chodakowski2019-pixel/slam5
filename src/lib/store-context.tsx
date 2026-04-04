"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "./supabase";
import {
  StoreData,
  Task,
  TaskCategory,
  Project,
  Goal,
  Milestone,
  ParkingLotItem,
  DayRecord,
  UserProfile,
  generateId,
  getTodayKey,
} from "./store";

interface StoreContextType {
  data: StoreData;
  addTask: (title: string, projectId: string | null, timerMinutes: number, category: TaskCategory, isFrog: boolean) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  updateTaskTimer: (id: string, secondsLeft: number | null, running: boolean) => void;
  setFrog: (id: string) => void;
  reorderTasks: (fromId: string, toId: string) => void;
  addProject: (name: string, emoji: string, color: string, description: string) => void;
  updateProject: (id: string, updates: Partial<{name: string; emoji: string; color: string; description: string}>) => void;
  deleteProject: (id: string) => void;
  addGoal: (goal: Omit<Goal, "id" | "createdAt" | "milestones" | "completed" | "progress">) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  addMilestone: (goalId: string, title: string) => void;
  toggleMilestone: (goalId: string, milestoneId: string) => void;
  deleteMilestone: (goalId: string, milestoneId: string) => void;
  addParkingLotItem: (text: string) => void;
  deleteParkingLotItem: (id: string) => void;
  clearParkingLot: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  getTodayRecord: () => DayRecord | undefined;
  getWeekWins: () => number;
  getMonthWins: () => number;
  getCurrentStreak: () => number;
}

const StoreContext = createContext<StoreContextType | null>(null);

const EMPTY: StoreData = { tasks: [], projects: [], goals: [], parkingLot: [], dayRecords: [], totalPoints: 0 };

async function getAuthHeaders(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token
    ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
    : { "Content-Type": "application/json" };
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<StoreData>(EMPTY);
  const [loaded, setLoaded] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const headers = await getAuthHeaders();
        const r = await fetch("/api/data", { headers });
        const d = await r.json();
        setData({
          tasks: d.tasks || [],
          projects: d.projects || [],
          goals: d.goals || [],
          parkingLot: d.parkingLot || [],
          dayRecords: d.dayRecords || [],
          totalPoints: d.totalPoints || 0,
          profile: d.profile,
          subscription: d.subscription,
        });
      } catch {}
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    const hasRunningTimer = data.tasks.some((t) => t.timerRunning);
    const delay = hasRunningTimer ? 2000 : 300;
    saveTimer.current = setTimeout(async () => {
      try {
        const headers = await getAuthHeaders();
        await fetch("/api/data", {
          method: "POST",
          headers,
          body: JSON.stringify(data),
        });
      } catch {}
    }, delay);
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [data, loaded]);

  // Update day record when tasks change
  useEffect(() => {
    if (!loaded) return;
    const today = getTodayKey();
    const todayTasks = data.tasks.filter((t) => t.createdAt.startsWith(today));
    const completed = todayTasks.filter((t) => t.completed).length;
    const total = todayTasks.length;
    if (total === 0) return;

    setData((prev) => {
      const existing = prev.dayRecords.find((r) => r.date === today);
      const record: DayRecord = {
        date: today,
        tasksTotal: total,
        tasksCompleted: completed,
        won: total > 0 && completed === total,
        points: completed * 10,
      };
      const dayRecords = existing
        ? prev.dayRecords.map((r) => (r.date === today ? record : r))
        : [...prev.dayRecords, record];
      return { ...prev, dayRecords };
    });
  }, [data.tasks, loaded]);

  const addTask = useCallback(
    (title: string, projectId: string | null, timerMinutes: number, category: TaskCategory, isFrog: boolean) => {
      const task: Task = {
        id: generateId(),
        title,
        completed: false,
        projectId,
        category,
        isFrog,
        timerMinutes,
        timerSecondsLeft: null,
        timerRunning: false,
        createdAt: new Date().toISOString(),
        completedAt: null,
        points: 0,
      };
      setData((prev) => ({ ...prev, tasks: [task, ...prev.tasks] }));
    },
    []
  );

  const toggleTask = useCallback((id: string) => {
    setData((prev) => {
      const task = prev.tasks.find((t) => t.id === id);
      if (!task) return prev;
      const completing = !task.completed;
      const pointsDelta = completing ? 10 : -10;
      return {
        ...prev,
        totalPoints: prev.totalPoints + pointsDelta,
        tasks: prev.tasks.map((t) =>
          t.id === id
            ? { ...t, completed: completing, completedAt: completing ? new Date().toISOString() : null, timerRunning: false, points: completing ? 10 : 0 }
            : t
        ),
      };
    });
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

  const setFrog = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => ({ ...t, isFrog: t.id === id })),
    }));
  }, []);

  const reorderTasks = useCallback((fromId: string, toId: string) => {
    setData((prev) => {
      const tasks = [...prev.tasks];
      const fromIdx = tasks.findIndex((t) => t.id === fromId);
      const toIdx = tasks.findIndex((t) => t.id === toId);
      if (fromIdx === -1 || toIdx === -1) return prev;
      const [moved] = tasks.splice(fromIdx, 1);
      tasks.splice(toIdx, 0, moved);
      return { ...prev, tasks };
    });
  }, []);

  const addProject = useCallback(
    (name: string, emoji: string, color: string, description: string) => {
      const project: Project = { id: generateId(), name, emoji, color, description, createdAt: new Date().toISOString() };
      setData((prev) => ({ ...prev, projects: [...prev.projects, project] }));
    },
    []
  );

  const updateProject = useCallback((id: string, updates: Partial<{name: string; emoji: string; color: string; description: string}>) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => p.id === id ? { ...p, ...updates } : p),
    }));
  }, []);

  const deleteProject = useCallback((id: string) => {
    setData((prev) => ({ ...prev, projects: prev.projects.filter((p) => p.id !== id) }));
  }, []);

  const addGoal = useCallback(
    (goal: Omit<Goal, "id" | "createdAt" | "milestones" | "completed" | "progress">) => {
      const newGoal: Goal = { ...goal, id: generateId(), milestones: [], progress: 0, completed: false, createdAt: new Date().toISOString() };
      setData((prev) => ({ ...prev, goals: [newGoal, ...prev.goals] }));
    },
    []
  );

  const updateGoal = useCallback((id: string, updates: Partial<Goal>) => {
    setData((prev) => ({ ...prev, goals: prev.goals.map((g) => (g.id === id ? { ...g, ...updates } : g)) }));
  }, []);

  const deleteGoal = useCallback((id: string) => {
    setData((prev) => ({ ...prev, goals: prev.goals.filter((g) => g.id !== id) }));
  }, []);

  const addMilestone = useCallback((goalId: string, title: string) => {
    const ms: Milestone = { id: generateId(), title, completed: false };
    setData((prev) => ({
      ...prev,
      goals: prev.goals.map((g) => g.id === goalId ? { ...g, milestones: [...g.milestones, ms] } : g),
    }));
  }, []);

  const toggleMilestone = useCallback((goalId: string, milestoneId: string) => {
    setData((prev) => ({
      ...prev,
      goals: prev.goals.map((g) => {
        if (g.id !== goalId) return g;
        const milestones = g.milestones.map((m) => m.id === milestoneId ? { ...m, completed: !m.completed } : m);
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

  const addParkingLotItem = useCallback((text: string) => {
    const item: ParkingLotItem = { id: generateId(), text, createdAt: new Date().toISOString() };
    setData((prev) => ({ ...prev, parkingLot: [item, ...prev.parkingLot] }));
  }, []);

  const deleteParkingLotItem = useCallback((id: string) => {
    setData((prev) => ({ ...prev, parkingLot: prev.parkingLot.filter((i) => i.id !== id) }));
  }, []);

  const clearParkingLot = useCallback(() => {
    setData((prev) => ({ ...prev, parkingLot: [] }));
  }, []);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setData((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...updates } as UserProfile,
      phoneNumber: updates.phoneNumber ?? prev.profile?.phoneNumber ?? prev.phoneNumber,
    }));
  }, []);

  const getTodayRecord = useCallback(() => {
    return data.dayRecords.find((r) => r.date === getTodayKey());
  }, [data.dayRecords]);

  const getWeekWins = useCallback(() => {
    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);
    return data.dayRecords.filter((r) => {
      const d = new Date(r.date);
      return d >= weekAgo && d <= now && r.won;
    }).length;
  }, [data.dayRecords]);

  const getMonthWins = useCallback(() => {
    const now = new Date();
    const monthAgo = new Date(now);
    monthAgo.setDate(monthAgo.getDate() - 28);
    let weekWins = 0;
    for (let w = 0; w < 4; w++) {
      const weekStart = new Date(monthAgo);
      weekStart.setDate(weekStart.getDate() + w * 7);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);
      const totalCompleted = data.dayRecords
        .filter((r) => { const d = new Date(r.date); return d >= weekStart && d < weekEnd; })
        .reduce((sum, r) => sum + r.tasksCompleted, 0);
      if (totalCompleted >= 30) weekWins++;
    }
    return weekWins;
  }, [data.dayRecords]);

  const getCurrentStreak = useCallback(() => {
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      const record = data.dayRecords.find((r) => r.date === key);
      if (record && record.won) { streak++; }
      else if (i === 0) { continue; }
      else { break; }
    }
    return streak;
  }, [data.dayRecords]);

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
        data, addTask, toggleTask, deleteTask, updateTaskTimer, setFrog, reorderTasks,
        addProject, updateProject, deleteProject,
        addGoal, updateGoal, deleteGoal, addMilestone, toggleMilestone, deleteMilestone,
        addParkingLotItem, deleteParkingLotItem, clearParkingLot,
        updateProfile, getTodayRecord, getWeekWins, getMonthWins, getCurrentStreak,
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
