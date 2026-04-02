"use client";

import { useState, useEffect, useCallback } from "react";
import { StoreProvider } from "@/lib/store-context";
import { Sidebar } from "@/components/sidebar";
import { DashboardView } from "@/components/views/dashboard-view";
import { TasksView } from "@/components/views/tasks-view";
import { ProjectsView } from "@/components/views/projects-view";
import { FinancesView } from "@/components/views/finances-view";
import { NotesView } from "@/components/views/notes-view";
import { GoalsView } from "@/components/views/goals-view";
import { CrmView } from "@/components/views/crm-view";
import { CommandPalette } from "@/components/command-palette";
import { FloatingTimer } from "@/components/floating-timer";

function AppContent() {
  const [view, setView] = useState("dashboard");
  const [cmdOpen, setCmdOpen] = useState(false);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      setCmdOpen((prev) => !prev);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const navigate = (v: string) => {
    setView(v);
    setCmdOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar activeView={view} onViewChange={navigate} />
      <main className="flex-1 overflow-y-auto p-8">
        {view === "dashboard" && <DashboardView onNavigate={navigate} />}
        {view === "tasks" && <TasksView />}
        {view === "projects" && <ProjectsView />}
        {view === "finances" && <FinancesView />}
        {view === "notes" && <NotesView />}
        {view === "goals" && <GoalsView />}
        {view === "crm" && <CrmView />}
      </main>
      <CommandPalette
        open={cmdOpen}
        onClose={() => setCmdOpen(false)}
        onNavigate={navigate}
      />
      <FloatingTimer />
    </div>
  );
}

export default function Home() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
