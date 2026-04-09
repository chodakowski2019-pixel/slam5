"use client";

import { useState } from "react";
import { useStore } from "@/lib/store-context";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";

const MORNING_HOURS = ["06:00","07:00","08:00","09:00","10:00","11:00"];
const EVENING_HOURS = ["19:00","20:00","21:00","22:00","23:00","00:00"];

function formatHour(h: string) {
  const n = parseInt(h);
  if (n === 0) return "12am";
  if (n < 12) return `${n}am`;
  if (n === 12) return "12pm";
  return `${n - 12}pm`;
}

export function SettingsView() {
  const { data, updateProfile } = useStore();
  const { user, signOut } = useAuth();
  const profile = data.profile;

  const [name, setName] = useState(profile?.name || "");
  const [planTime, setPlanTime] = useState(profile?.planTime || "morning");
  const [planHour, setPlanHour] = useState(profile?.planHour || "08:00");
  const [saved, setSaved] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const isPro = data.subscription?.status === "active" || data.subscription?.status === "trialing";

  const handleSave = () => {
    updateProfile({ name, planTime, planHour, onboardingCompleted: true });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleManageSubscription = async () => {
    setPortalLoading(true);
    const { data: session } = await supabase.auth.getSession();
    const token = session.session?.access_token;
    if (!token) { setPortalLoading(false); return; }
    const res = await fetch("/api/stripe/portal", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    const { url, error } = await res.json();
    if (url) {
      window.location.href = url;
    } else {
      console.error(error);
      setPortalLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure? This deletes everything. Can't be undone.")) return;
    setDeleteLoading(true);
    const { data: session } = await supabase.auth.getSession();
    const token = session.session?.access_token;
    if (!token) { setDeleteLoading(false); return; }
    const res = await fetch("/api/delete-account", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      await supabase.auth.signOut();
      window.location.href = "/login?deleted=true";
    } else {
      alert("Something went wrong. Please try again.");
      setDeleteLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-heading font-bold tracking-tight mb-8">Settings</h2>

      {/* Account */}
      <section className="mb-8">
        <h3 className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-4">Account</h3>
        <div className="space-y-4 p-5 rounded-2xl border border-border bg-card">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Email</label>
            <p className="text-sm text-muted-foreground">{user?.email || "—"}</p>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Plan</label>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${isPro ? "text-emerald-400" : "text-muted-foreground"}`}>
                {isPro ? "Pro" : "Free"}
              </span>
              {isPro && data.subscription?.status === "trialing" && (
                <span className="text-xs bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full">Trial</span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Reminders */}
      <section className="mb-8">
        <h3 className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-4">Reminders</h3>
        <div className="p-5 rounded-2xl border border-border bg-card space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">Morning</p>
            <div className="grid grid-cols-6 gap-2">
              {MORNING_HOURS.map((h) => (
                <button
                  key={h}
                  onClick={() => { setPlanHour(h); setPlanTime("morning"); }}
                  className={`py-2.5 rounded-xl text-sm font-medium border transition-all duration-150 ${
                    planHour === h
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : "bg-background border-border text-muted-foreground hover:border-emerald-500/50"
                  }`}
                >
                  {formatHour(h)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Evening</p>
            <div className="grid grid-cols-6 gap-2">
              {EVENING_HOURS.map((h) => (
                <button
                  key={h}
                  onClick={() => { setPlanHour(h); setPlanTime("evening"); }}
                  className={`py-2.5 rounded-xl text-sm font-medium border transition-all duration-150 ${
                    planHour === h
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : "bg-background border-border text-muted-foreground hover:border-emerald-500/50"
                  }`}
                >
                  {formatHour(h)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Save */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={handleSave}
          className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          {saved ? "Saved!" : "Save"}
        </button>
      </div>

      {/* Support */}
      <section className="mb-8">
        <h3 className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-4">Support</h3>
        <div className="p-5 rounded-2xl border border-border bg-card space-y-3">
          <a
            href="mailto:support@slam5.app"
            className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            💬 Contact support
          </a>
          <a
            href="/privacy"
            target="_blank"
            className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            📄 Privacy Policy
          </a>
        </div>
      </section>

      {/* Danger zone */}
      <section>
        <h3 className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-4">Account</h3>
        <div className="space-y-3">
          {isPro && (
            <button
              onClick={handleManageSubscription}
              disabled={portalLoading}
              className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl border border-border bg-card text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200 disabled:opacity-50"
            >
              💳 {portalLoading ? "Loading..." : "Manage subscription"}
            </button>
          )}
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl border border-border bg-card text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200"
          >
            🚪 Sign out
          </button>
          <button
            onClick={handleDeleteAccount}
            disabled={deleteLoading}
            className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl border border-red-500/20 bg-card text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all duration-200 disabled:opacity-50"
          >
            🗑️ {deleteLoading ? "Deleting..." : "Delete account"}
          </button>
        </div>
      </section>
    </div>
  );
}
