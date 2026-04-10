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

const STEPS = 4;

export function OnboardingView({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [planTime, setPlanTime] = useState<"morning" | "evening">("morning");
  const [planHour, setPlanHour] = useState("08:00");

  const next = () => setStep((s) => Math.min(s + 1, STEPS));
  const prev = () => setStep((s) => Math.max(s - 1, 1));

  const canNext = () => {
    if (step === 1) return name.trim().length > 0;
    return true;
  };

  const handleFinish = () => {
    onComplete({ name: name.trim(), phoneNumber: phoneNumber.trim(), bodyGoal: "", mindGoal: "", moneyGoal: "", planTime, planHour });
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
                i < step ? "bg-emerald-500" : "bg-border"
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
                  placeholder="Phone number with country code e.g. +1 555 000 0000"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && canNext() && next()}
                  className="text-lg py-6 bg-card"
                />
                <p className="text-xs text-muted-foreground mt-2">Optional. We&apos;ll text you reminders. Include country code e.g. +1 for US, +44 for UK, +48 for Poland.</p>
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

        {/* Step 3 — When */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-heading font-bold">When do you plan?</h2>
              <p className="text-sm text-muted-foreground mt-1">
                We&apos;ll text you if you haven&apos;t started by then.
              </p>
            </div>
            <div className="space-y-3">
              <p className="text-sm font-medium">Morning</p>
              <div className="grid grid-cols-4 gap-2">
                {["06:00","07:00","08:00","09:00","10:00","11:00"].map((h) => (
                  <button
                    key={h}
                    onClick={() => { setPlanHour(h); setPlanTime("morning"); }}
                    className={`py-3 rounded-xl text-sm font-medium border transition-all duration-150 ${
                      planHour === h
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : "bg-card border-border text-muted-foreground hover:border-emerald-500/50"
                    }`}
                  >
                    {parseInt(h) === 0 ? "12am" : parseInt(h) < 12 ? `${parseInt(h)}am` : parseInt(h) === 12 ? "12pm" : `${parseInt(h)-12}pm`}
                  </button>
                ))}
              </div>
              <p className="text-sm font-medium pt-1">Evening</p>
              <div className="grid grid-cols-4 gap-2">
                {["19:00","20:00","21:00","22:00","23:00","00:00"].map((h) => (
                  <button
                    key={h}
                    onClick={() => { setPlanHour(h); setPlanTime("evening"); }}
                    className={`py-3 rounded-xl text-sm font-medium border transition-all duration-150 ${
                      planHour === h
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : "bg-card border-border text-muted-foreground hover:border-emerald-500/50"
                    }`}
                  >
                    {parseInt(h) === 0 ? "12am" : parseInt(h) < 12 ? `${parseInt(h)}am` : parseInt(h) === 12 ? "12pm" : `${parseInt(h)-12}pm`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 4 — Ready */}
        {step === 4 && (
          <div className="space-y-6 text-center">
            <span className="text-7xl block">🥊</span>
            <div>
              <h2 className="text-3xl font-heading font-bold">
                Ready, {name}?
              </h2>
              <p className="text-muted-foreground mt-3">
                3 days free. No charge yet. Just show up and win.
              </p>
            </div>
          </div>
        )}

        {/* Nav */}
        <div className={`flex gap-3 mt-10 ${step === STEPS ? "justify-center" : "justify-end"}`}>
          {step > 1 && step < STEPS && (
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
            className="px-10 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-30 text-sm font-medium transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
          >
            {step === STEPS ? "Let's go" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
