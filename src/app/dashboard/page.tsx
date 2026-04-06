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
import { getTodayKey, generateId } from "@/lib/store";
import { supabase } from "@/lib/supabase";

function AppContent() {
  const [view, setView] = useState("dashboard");
  const [cmdOpen, setCmdOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [showCheckoutGate, setShowCheckoutGate] = useState(false);
  const { data, updateProfile, addGoal } = useStore();
  const { user } = useAuth();
  const prevCompletedRef = useRef<number>(-1);
  const localDone = typeof window !== "undefined" && user?.id
    ? localStorage.getItem(`onboardingCompleted_${user.id}`) === "true"
    : false;
  const needsOnboarding = !localDone && !data.profile?.onboardingCompleted;
  const isPro = data.subscription?.status === "active" || data.subscription?.status === "trialing";

  // Check URL params on mount — handle payment=cancelled
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("payment") === "cancelled") {
      setShowCheckoutGate(true);
      window.history.replaceState({}, "", "/dashboard");
    } else if (params.get("payment") === "success") {
      window.history.replaceState({}, "", "/dashboard");
    }
  }, []);

  const startCheckout = async () => {
    if (!user) return;
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, email: user.email }),
      });
      const { url, error } = await res.json();
      if (url) {
        window.location.href = url;
      } else {
        console.error(error);
        setCheckoutLoading(false);
      }
    } catch {
      setCheckoutLoading(false);
    }
  };

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
    if (user?.id) localStorage.setItem(`onboardingCompleted_${user.id}`, "true");
    updateProfile(profile);
    // Create goals from onboarding answers
    const goalMap = [
      { text: onboardingData.bodyGoal, emoji: "🏋️", label: "Body" },
      { text: onboardingData.mindGoal, emoji: "🧠", label: "Mind" },
      { text: onboardingData.moneyGoal, emoji: "💰", label: "Money" },
    ];
    goalMap.forEach(({ text, emoji, label }) => {
      if (text?.trim()) {
        addGoal({ title: `${emoji} ${text.trim()}`, description: label, horizon: "1y", deadline: "", projectId: null });
      }
    });
    // Persist onboardingCompleted
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;
    if (token) {
      await fetch("/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ profile, tasks: [], projects: [], goals: [], parkingLot: [], dayRecords: [], totalPoints: 0 }),
      });
    }
    // Redirect to Stripe checkout
    await startCheckout();
  };

  // Watch for task completions to fire celebrations
  useEffect(() => {
    const today = getTodayKey();
    const todayTasks = data.tasks.filter((t) => t.createdAt.startsWith(today));
    const completed = todayTasks.filter((t) => t.completed).length;
    const total = todayTasks.length;

    if (completed > prevCompletedRef.current && prevCompletedRef.current >= 0) {
      if (completed >= 5 && prevCompletedRef.current < 5) {
        // Hit 5 completed — win the day
        celebrateWin();
        setToastMsg("5 TASKS SLAMMED! YOU WON TODAY! 🏆");
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

  if (checkoutLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-background gap-4">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">Setting up your free trial...</p>
      </div>
    );
  }

  if (showCheckoutGate && !isPro) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background p-6">
        <div className="max-w-sm w-full text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 flex items-center justify-center mx-auto text-3xl">
            🏆
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold mb-2">Start your free trial</h1>
            <p className="text-muted-foreground text-sm">
              3 days free, then $9.99/month.<br />Cancel anytime.
            </p>
          </div>
          <ul className="text-sm text-left space-y-2 text-muted-foreground">
            <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Full access to Power List</li>
            <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Goals, streaks & scoring</li>
            <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> No charge for 3 days</li>
          </ul>
          <button
            onClick={startCheckout}
            disabled={checkoutLoading}
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 font-medium transition-all duration-200 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
          >
            {checkoutLoading ? "Loading..." : "Start free trial →"}
          </button>
          <p className="text-xs text-muted-foreground">
            You won&apos;t be charged until {new Date(Date.now() + 3 * 86400000).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar activeView={view} onViewChange={navigate} />
      <main className="flex-1 overflow-y-auto p-8">
        {view === "dashboard" && <DashboardView onNavigate={navigate} />}
        {view === "tasks" && <TasksView />}
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
