"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";

interface OnboardingProps {
  onComplete: (data: OnboardingData) => void;
}

export interface OnboardingData {
  name: string;
  phoneNumber: string;
  bodyGoal: string;
  mindGoal: string;
  moneyGoal: string;
  planTime: "morning" | "evening";
  planHour: string;
}

const STEPS = 6;

export function OnboardingView({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bodyGoal, setBodyGoal] = useState("");
  const [mindGoal, setMindGoal] = useState("");
  const [moneyGoal, setMoneyGoal] = useState("");
  const [planTime, setPlanTime] = useState<"morning" | "evening">("morning");
  const [planHour, setPlanHour] = useState("08:00");

  const next = () => setStep((s) => Math.min(s + 1, STEPS));
  const prev = () => setStep((s) => Math.max(s - 1, 1));

  const canNext = () => {
    if (step === 1) return name.trim().length > 0;
    if (step === 3) return bodyGoal.trim() || mindGoal.trim() || moneyGoal.trim();
    return true;
  };

  const handleFinish = () => {
    onComplete({ name: name.trim(), phoneNumber: phoneNumber.trim(), bodyGoal, mindGoal, moneyGoal, planTime, planHour });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-8">
      <div className="w-full max-w-md">
        {/* Progress */}
        <div className="flex gap-1.5 mb-10">
          {Array.from({ length: STEPS }, (_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                i < step ? "bg-indigo-500" : "bg-border"
              }`}
            />
          ))}
        </div>

        {/* Step 1 — Name & Phone */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-heading font-bold mb-2">
                Let&apos;s go.
              </h1>
              <p className="text-muted-foreground">
                What&apos;s your name?
              </p>
            </div>
            <div className="space-y-4">
              <Input
                placeholder="Your first name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-lg py-6 bg-card"
                autoFocus
              />
              <div>
                <Input
                  placeholder="+1 555 123 4567"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && canNext() && next()}
                  className="text-lg py-6 bg-card"
                />
                <p className="text-xs text-muted-foreground mt-2">Optional. For text reminders.</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 2 — How it works */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-heading font-bold">How it works</h2>
            <div className="space-y-4">
              {[
                { icon: "🥊", title: "Pick 5 tasks", desc: "The stuff that moves your life forward." },
                { icon: "⏱", title: "Set a timer and do it", desc: "Focus on one thing at a time." },
                { icon: "🏆", title: "Win or lose", desc: "All 5 done = you won. That simple." },
              ].map((item) => (
                <div key={item.icon} className="flex items-start gap-4 p-4 rounded-2xl bg-card border border-border">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3 — Goals */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-heading font-bold">What do you want?</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Pick at least one.
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium flex items-center gap-2 mb-1.5">
                  🏋️ Body
                </label>
                <Input
                  placeholder="e.g. Lose 20 lbs, run a 5K"
                  value={bodyGoal}
                  onChange={(e) => setBodyGoal(e.target.value)}
                  className="bg-card"
                />
              </div>
              <div>
                <label className="text-sm font-medium flex items-center gap-2 mb-1.5">
                  🧠 Mind
                </label>
                <Input
                  placeholder="e.g. Read 1 book a month"
                  value={mindGoal}
                  onChange={(e) => setMindGoal(e.target.value)}
                  className="bg-card"
                />
              </div>
              <div>
                <label className="text-sm font-medium flex items-center gap-2 mb-1.5">
                  💰 Money
                </label>
                <Input
                  placeholder="e.g. Hit $10K/month"
                  value={moneyGoal}
                  onChange={(e) => setMoneyGoal(e.target.value)}
                  className="bg-card"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4 — When */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-heading font-bold">When do you plan?</h2>
              <p className="text-sm text-muted-foreground mt-1">
                We&apos;ll remind you.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setPlanTime("morning"); if (!planHour || planHour === "21:00") setPlanHour("08:00"); }}
                className={`flex-1 p-5 rounded-2xl border text-center transition-all duration-200 ${
                  planTime === "morning"
                    ? "border-indigo-500/30 bg-indigo-500/10"
                    : "border-border hover:bg-accent/50"
                }`}
              >
                <span className="text-3xl block mb-2">🌅</span>
                <span className="text-sm font-medium">Morning</span>
              </button>
              <button
                onClick={() => { setPlanTime("evening"); if (!planHour || planHour === "08:00") setPlanHour("21:00"); }}
                className={`flex-1 p-5 rounded-2xl border text-center transition-all duration-200 ${
                  planTime === "evening"
                    ? "border-indigo-500/30 bg-indigo-500/10"
                    : "border-border hover:bg-accent/50"
                }`}
              >
                <span className="text-3xl block mb-2">🌙</span>
                <span className="text-sm font-medium">Evening</span>
              </button>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">What time?</label>
              <Input
                type="time"
                value={planHour}
                onChange={(e) => setPlanHour(e.target.value)}
                className="text-lg py-6 bg-card w-40"
              />
            </div>
          </div>
        )}

        {/* Step 5 — Reminders */}
        {step === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-heading font-bold">We got you.</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Here&apos;s what you&apos;ll get.
              </p>
            </div>
            <div className="space-y-3">
              {[
                { icon: "🌅", title: "Morning push", desc: "Your tasks are waiting." },
                { icon: "⏰", title: "Mid-day check", desc: "How many did you do?" },
                { icon: "🏆", title: "Daily verdict", desc: "Win or lose. No excuses." },
              ].map((item) => (
                <div key={item.icon} className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border">
                  <span className="text-xl">{item.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 6 — Ready */}
        {step === 6 && (
          <div className="space-y-6 text-center">
            <span className="text-7xl block">🥊</span>
            <div>
              <h2 className="text-3xl font-heading font-bold">
                Ready, {name}?
              </h2>
              <p className="text-muted-foreground mt-3">
                3 days free. No card. Just show up and win.
              </p>
            </div>
          </div>
        )}

        {/* Nav */}
        <div className="flex gap-3 mt-10">
          {step > 1 && (
            <button
              onClick={prev}
              className="px-5 py-3 rounded-xl border border-border text-sm hover:bg-accent transition-all duration-200"
            >
              Back
            </button>
          )}
          <button
            onClick={step === STEPS ? handleFinish : next}
            disabled={!canNext()}
            className="flex-1 px-5 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-400 disabled:opacity-30 text-sm font-medium transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
          >
            {step === STEPS ? "Let's go" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
