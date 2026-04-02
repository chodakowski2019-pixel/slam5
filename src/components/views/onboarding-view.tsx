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
        <div className="flex gap-1.5 mb-8">
          {Array.from({ length: STEPS }, (_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors ${
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
                Slam your 5. Win the day.
              </h1>
              <p className="text-muted-foreground">
                Let&apos;s set you up.
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Your first name</label>
                <Input
                  placeholder="e.g. Jake"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-lg py-6 bg-card"
                  autoFocus
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Phone number <span className="text-xs text-muted-foreground">(for SMS reminders)</span></label>
                <Input
                  placeholder="+1 555 123 4567"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && canNext() && next()}
                  className="text-lg py-6 bg-card"
                />
                <p className="text-xs text-muted-foreground mt-1">Optional. We&apos;ll text you your tasks and daily verdict.</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 2 — How it works */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-heading font-bold">How Slam5 works</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🥊</span>
                <div>
                  <p className="font-medium">Add 5 tasks for the day</p>
                  <p className="text-sm text-muted-foreground">Only the stuff that actually moves your life forward.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">⏱</span>
                <div>
                  <p className="font-medium">Set a timer and fight</p>
                  <p className="text-sm text-muted-foreground">Focus. No distractions. Just do the thing.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🏆</span>
                <div>
                  <p className="font-medium">Win or lose the day</p>
                  <p className="text-sm text-muted-foreground">All 5 done = you won. Miss one = you lost. Simple.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3 — Goals (3 states) */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-heading font-bold">Your goals</h2>
              <p className="text-sm text-muted-foreground mt-1">
                What do you want to change in these 3 areas?
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium flex items-center gap-2 mb-1.5">
                  🏋️ Body
                  <span className="text-xs text-muted-foreground">health, fitness, energy</span>
                </label>
                <Input
                  placeholder="e.g. Lose 20 lbs, run a 5K, eat clean"
                  value={bodyGoal}
                  onChange={(e) => setBodyGoal(e.target.value)}
                  className="bg-card"
                />
              </div>
              <div>
                <label className="text-sm font-medium flex items-center gap-2 mb-1.5">
                  🧠 Mind
                  <span className="text-xs text-muted-foreground">mental health, relationships, learning</span>
                </label>
                <Input
                  placeholder="e.g. Meditate daily, read 1 book/month"
                  value={mindGoal}
                  onChange={(e) => setMindGoal(e.target.value)}
                  className="bg-card"
                />
              </div>
              <div>
                <label className="text-sm font-medium flex items-center gap-2 mb-1.5">
                  💰 Money
                  <span className="text-xs text-muted-foreground">business, career, finances</span>
                </label>
                <Input
                  placeholder="e.g. Hit $10K/month, launch my product"
                  value={moneyGoal}
                  onChange={(e) => setMoneyGoal(e.target.value)}
                  className="bg-card"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4 — Planning time */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-heading font-bold">When do you plan?</h2>
              <p className="text-sm text-muted-foreground mt-1">
                We&apos;ll remind you to write your Power List.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setPlanTime("morning"); if (!planHour || planHour === "21:00") setPlanHour("08:00"); }}
                className={`flex-1 p-4 rounded-xl border text-center transition-colors ${
                  planTime === "morning"
                    ? "border-indigo-500 bg-indigo-500/10"
                    : "border-border hover:bg-accent/50"
                }`}
              >
                <span className="text-2xl block mb-1">🌅</span>
                <span className="text-sm font-medium">Morning</span>
              </button>
              <button
                onClick={() => { setPlanTime("evening"); if (!planHour || planHour === "08:00") setPlanHour("21:00"); }}
                className={`flex-1 p-4 rounded-xl border text-center transition-colors ${
                  planTime === "evening"
                    ? "border-indigo-500 bg-indigo-500/10"
                    : "border-border hover:bg-accent/50"
                }`}
              >
                <span className="text-2xl block mb-1">🌙</span>
                <span className="text-sm font-medium">Evening</span>
              </button>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">What time exactly?</label>
              <Input
                type="time"
                value={planHour}
                onChange={(e) => setPlanHour(e.target.value)}
                className="text-lg py-6 bg-card w-40"
              />
              <p className="text-xs text-muted-foreground mt-1">Pick any time that works for you.</p>
            </div>
          </div>
        )}

        {/* Step 5 — Notifications */}
        {step === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-heading font-bold">Stay on track</h2>
              <p className="text-sm text-muted-foreground mt-1">
                We&apos;ll text you so you don&apos;t forget.
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border">
                <span>🌅</span>
                <div className="flex-1">
                  <p className="text-sm font-medium">Morning reminder</p>
                  <p className="text-xs text-muted-foreground">Your 5 tasks are waiting.</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border">
                <span>⏰</span>
                <div className="flex-1">
                  <p className="text-sm font-medium">Mid-day check</p>
                  <p className="text-xs text-muted-foreground">How many did you slam?</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border">
                <span>🏆</span>
                <div className="flex-1">
                  <p className="text-sm font-medium">Daily verdict</p>
                  <p className="text-xs text-muted-foreground">Win or lose — in the app.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 6 — Ready */}
        {step === 6 && (
          <div className="space-y-6 text-center">
            <span className="text-6xl block">🥊</span>
            <div>
              <h2 className="text-2xl font-heading font-bold">
                Ready to fight, {name}?
              </h2>
              <p className="text-muted-foreground mt-2">
                3 days free. No credit card. Just show up and win.
              </p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 mt-8">
          {step > 1 && (
            <button
              onClick={prev}
              className="px-4 py-2.5 rounded-lg border border-border text-sm hover:bg-accent transition-colors"
            >
              Back
            </button>
          )}
          <button
            onClick={step === STEPS ? handleFinish : next}
            disabled={!canNext()}
            className="flex-1 px-4 py-2.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 disabled:opacity-30 text-sm font-medium transition-colors"
          >
            {step === STEPS ? "Start winning →" : "Next →"}
          </button>
        </div>
      </div>
    </div>
  );
}
