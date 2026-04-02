"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/store-context";
import { useAuth } from "@/lib/auth-context";

export function SettingsView() {
  const { data, updateProfile } = useStore();
  const { user, signOut } = useAuth();
  const profile = data.profile;

  const [name, setName] = useState(profile?.name || "");
  const [phone, setPhone] = useState(profile?.phoneNumber || "");
  const [bodyGoal, setBodyGoal] = useState(profile?.bodyGoal || "");
  const [mindGoal, setMindGoal] = useState(profile?.mindGoal || "");
  const [moneyGoal, setMoneyGoal] = useState(profile?.moneyGoal || "");
  const [planTime, setPlanTime] = useState(profile?.planTime || "morning");
  const [planHour, setPlanHour] = useState(profile?.planHour || "08:00");
  const [saved, setSaved] = useState(false);

  const isPro = data.subscription?.status === "active" || data.subscription?.status === "trialing";

  const handleSave = () => {
    updateProfile({
      name: name.trim(),
      phoneNumber: phone.trim(),
      bodyGoal,
      mindGoal,
      moneyGoal,
      planTime,
      planHour,
      onboardingCompleted: true,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-heading font-bold tracking-tight mb-8">Settings</h2>

      {/* Account */}
      <section className="mb-8">
        <h3 className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-4">Account</h3>
        <div className="space-y-4 p-4 rounded-xl border border-border bg-card">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Email</label>
            <p className="text-sm text-muted-foreground">{user?.email || "—"}</p>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Plan</label>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${isPro ? "text-indigo-400" : "text-muted-foreground"}`}>
                {isPro ? "Pro" : "Free"}
              </span>
              {isPro && data.subscription?.status === "trialing" && (
                <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full">Trial</span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Profile */}
      <section className="mb-8">
        <h3 className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-4">Profile</h3>
        <div className="space-y-4 p-4 rounded-xl border border-border bg-card">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="bg-background" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Phone number</label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 555 123 4567" type="tel" className="bg-background" />
            <p className="text-xs text-muted-foreground mt-1">For SMS reminders (morning tasks + evening verdict)</p>
          </div>
        </div>
      </section>

      {/* Goals */}
      <section className="mb-8">
        <h3 className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-4">Goals</h3>
        <div className="space-y-4 p-4 rounded-xl border border-border bg-card">
          <div>
            <label className="text-sm font-medium flex items-center gap-2 mb-1.5">
              🏋️ Body
            </label>
            <Input value={bodyGoal} onChange={(e) => setBodyGoal(e.target.value)} placeholder="e.g. Lose 20 lbs" className="bg-background" />
          </div>
          <div>
            <label className="text-sm font-medium flex items-center gap-2 mb-1.5">
              🧠 Mind
            </label>
            <Input value={mindGoal} onChange={(e) => setMindGoal(e.target.value)} placeholder="e.g. Meditate daily" className="bg-background" />
          </div>
          <div>
            <label className="text-sm font-medium flex items-center gap-2 mb-1.5">
              💰 Money
            </label>
            <Input value={moneyGoal} onChange={(e) => setMoneyGoal(e.target.value)} placeholder="e.g. Hit $10K/month" className="bg-background" />
          </div>
        </div>
      </section>

      {/* Reminders */}
      <section className="mb-8">
        <h3 className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-4">Reminders</h3>
        <div className="space-y-4 p-4 rounded-xl border border-border bg-card">
          <div>
            <label className="text-sm font-medium mb-2 block">When do you plan your day?</label>
            <div className="flex gap-3">
              <button
                onClick={() => { setPlanTime("morning"); setPlanHour("08:00"); }}
                className={`flex-1 p-3 rounded-lg border text-center text-sm transition-colors ${
                  planTime === "morning" ? "border-indigo-500 bg-indigo-500/10" : "border-border hover:bg-accent/50"
                }`}
              >
                🌅 Morning
              </button>
              <button
                onClick={() => { setPlanTime("evening"); setPlanHour("21:00"); }}
                className={`flex-1 p-3 rounded-lg border text-center text-sm transition-colors ${
                  planTime === "evening" ? "border-indigo-500 bg-indigo-500/10" : "border-border hover:bg-accent/50"
                }`}
              >
                🌙 Evening
              </button>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Reminder time</label>
            <input
              type="time"
              value={planHour}
              onChange={(e) => setPlanHour(e.target.value)}
              className="bg-background border border-border rounded-md px-3 py-2 text-sm outline-none"
            />
          </div>
        </div>
      </section>

      {/* Save */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          className="px-6 py-2.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-sm font-medium transition-colors"
        >
          {saved ? "Saved!" : "Save changes"}
        </button>
        <button
          onClick={signOut}
          className="px-4 py-2.5 rounded-lg border border-border text-sm text-muted-foreground hover:bg-accent/50 transition-colors"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
