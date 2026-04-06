"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { StoreProvider } from "@/lib/store-context";
import { Sidebar } from "@/components/sidebar";
import { DashboardView } from "@/components/views/dashboard-view";
import { TasksView } from "@/components/views/tasks-view";
import { ProjectsView } from "@/components/views/projects-view";
import { GoalsView } from "@/components/views/goals-view";
import { LeaderboardView } from "@/components/views/leaderboard-view";
import { SettingsView } from "@/components/views/settings-view";
import { OnboardingView } from "@/components/views/onboarding-view";
import type { OnboardingData } from "@/components/views/onboarding-view";
import { CommandPalette } from "@/components/command-palette";
import { FloatingTimer } from "@/components/floating-timer";
import { WinToast } from "@/components/win-toast";
import { useStore } from "@/lib/store-context";
import { celebrate, celebrateWin } from "@/lib/celebrate";
import { getTodayKey } from "@/lib/store";
import { supabase } from "@/lib/supabase";

function AppContent() {
  const [view, setView] = useState("dashboard");
  const [cmdOpen, setCmdOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const { data, updateProfile } = useStore();
  const prevCompletedRef = useRef<number>(0);
  const needsOnboarding = !data.profile?.onboardingCompleted;

  const handleOnboardingComplete = async (onboardingData: OnboardingData) => {
    const profile = {
      name: onboardingData.name,
      phoneNumber: onboardingData.phoneNumber,
      bodyGoal: onboardingData.bodyGoal,
      mindGoal: onboardingData.mindGoal,
      moneyGoal: onboardingData.moneyGoal,
      planTime: onboardingData.planTime,
      planHour: onboardingData.planHour,
      onboardingCompleted: true,
    };
    updateProfile(profile);
    // Immediately persist onboardingCompleted so it survives page reloads
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;
    if (token) {
      await fetch("/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ profile, tasks: [], projects: [], goals: [], parkingLot: [], dayRecords: [], totalPoints: 0 }),
      });
    }
  };

  // Watch for task completions to fire celebrations
  useEffect(() => {
    const today = getTodayKey();
    const todayTasks = data.tasks.filter((t) => t.createdAt.startsWith(today));
    const completed = todayTasks.filter((t) => t.completed).length;
    const total = todayTasks.length;

    if (completed > prevCompletedRef.current && prevCompletedRef.current >= 0) {
      if (total > 0 && completed === total) {
        // All tasks done — big celebration
        celebrateWin();
        setToastMsg("ALL TASKS SLAMMED! YOU WON TODAY! 🏆");
      } else {
        // Single task completed
        const msg = celebrate();
        setToastMsg(msg);
      }
    }
    prevCompletedRef.current = completed;
  }, [data.tasks]);

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

  if (needsOnboarding) {
    return <OnboardingView onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar activeView={view} onViewChange={navigate} />
      <main className="flex-1 overflow-y-auto p-8">
        {view === "dashboard" && <DashboardView onNavigate={navigate} />}
        {view === "tasks" && <TasksView />}
        {view === "projects" && <ProjectsView />}
        {view === "goals" && <GoalsView />}
        {view === "leaderboard" && <LeaderboardView />}
        {view === "settings" && <SettingsView />}
      </main>
      <CommandPalette
        open={cmdOpen}
        onClose={() => setCmdOpen(false)}
        onNavigate={navigate}
      />
      <FloatingTimer />
      <WinToast
        message={toastMsg}
        points={10}
        onDone={() => setToastMsg(null)}
      />
    </div>
  );
}

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
