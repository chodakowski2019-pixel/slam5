"use client";

import { useState } from "react";
import Link from "next/link";

const QUESTIONS = [
  {
    id: 1,
    text: "You have 3 tasks today. What happens first?",
    options: [
      { label: "I spend 20 minutes deciding which one to start", type: "A" },
      { label: "I look at the list and feel instantly drained", type: "B" },
      { label: "I start planning how to do them perfectly", type: "C" },
      { label: "I think 'I\u2019ll do all 3' \u2014 and end up doing none", type: "D" },
    ],
  },
  {
    id: 2,
    text: "It's 10am. You need to start working. You:",
    options: [
      { label: "Open 5 tabs, close them, open them again", type: "A" },
      { label: "Just... sit there. Can't explain why", type: "B" },
      { label: "Reorganize your desk or workspace first", type: "C" },
      { label: "Start mentally listing everything else you also need to do", type: "D" },
    ],
  },
  {
    id: 3,
    text: "Someone interrupts you mid-task. After they leave:",
    options: [
      { label: "You spend 15 min figuring out where you were", type: "A" },
      { label: "You check your phone and lose an hour", type: "B" },
      { label: "You restart from the beginning to 'do it right'", type: "C" },
      { label: "You switch to a completely different task", type: "D" },
    ],
  },
  {
    id: 4,
    text: "Which deadline type are you?",
    options: [
      { label: "Miss them because you couldn't pick where to start", type: "A" },
      { label: "Only work under last-minute pressure — and hate that", type: "B" },
      { label: "Miss them because it 'wasn\u2019t ready yet'", type: "C" },
      { label: "Set 10 alarms and still get surprised when it arrives", type: "D" },
    ],
  },
  {
    id: 5,
    text: "Your biggest lie to yourself:",
    options: [
      { label: "\"I just need to figure out the right approach first\"", type: "A" },
      { label: "\"I'll do it when I feel like it\"", type: "B" },
      { label: "\"I'll do it when I have enough time to do it properly\"", type: "C" },
      { label: "\"I'll do ALL of it tomorrow\"", type: "D" },
    ],
  },
  {
    id: 6,
    text: "End of a bad day. You feel:",
    options: [
      { label: "Confused — you were busy all day but nothing got done", type: "A" },
      { label: "Guilty — you had energy but it went nowhere", type: "B" },
      { label: "Frustrated — you worked but nothing met your standards", type: "C" },
      { label: "Anxious — the list is bigger now than when you started", type: "D" },
    ],
  },
];

const RESULTS = {
  A: {
    title: "The Overthinker",
    emoji: "🌀",
    tagline: "Your brain is a Ferrari with no GPS.",
    description:
      "The problem isn't effort — it's that you can never decide which road to take. You'll think your way out of starting every single time. Analysis paralysis is your default mode.",
    fix: "Remove the choice. When the next task is already picked for you, you execute. Slam5 decides what's next — you just show up and go.",
    color: "from-violet-500 to-purple-600",
    glow: "bg-violet-500/10",
  },
  B: {
    title: "The Low-Starter",
    emoji: "🔋",
    tagline: "Your engine takes longer to warm up.",
    description:
      "You're not lazy — you're waiting for a signal your brain isn't sending on its own. Willpower doesn't fix this. Waiting for motivation doesn't either. External activation does.",
    fix: "A trigger. A timer. Something that says NOW. Slam5's 25-minute sessions are designed exactly for brains that need a kickstart, not a pep talk.",
    color: "from-amber-500 to-orange-500",
    glow: "bg-amber-500/10",
  },
  C: {
    title: "The Perfectionist",
    emoji: "🎯",
    tagline: "You don't have a productivity problem. You have a standards problem.",
    description:
      "'Good enough to start' doesn\u2019t exist in your vocabulary \u2014 which means you rarely start at all. The bar keeps moving and the task never begins.",
    fix: "Time-boxing kills perfectionism. When you only have 25 minutes, 'perfect' isn\u2019t an option. Slam5 forces you to ship something imperfect \u2014 and that\u2019s the whole point.",
    color: "from-rose-500 to-pink-600",
    glow: "bg-rose-500/10",
  },
  D: {
    title: "The Overwhelmed",
    emoji: "🌊",
    tagline: "You see the full mountain before you take step one.",
    description:
      "Your brain treats a 30-minute task like a 3-month project — and responds accordingly: shutdown. The bigger the list, the harder the freeze.",
    fix: "One task. One timer. No list visible. Slam5 hides the mountain and shows you only the next step.",
    color: "from-[#34d399] to-[#2dd4bf]",
    glow: "bg-emerald-500/10",
  },
};

type ResultKey = keyof typeof RESULTS;

function getResult(answers: string[]): ResultKey {
  const counts: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 };
  answers.forEach((a) => { counts[a] = (counts[a] || 0) + 1; });
  return (Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]) as ResultKey;
}

export default function QuizPage() {
  const [step, setStep] = useState<"intro" | "quiz" | "email" | "result">("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<ResultKey | null>(null);

  function handleAnswer(type: string) {
    setSelected(type);
    setTimeout(() => {
      const newAnswers = [...answers, type];
      setAnswers(newAnswers);
      setSelected(null);
      if (current + 1 < QUESTIONS.length) {
        setCurrent(current + 1);
      } else {
        setResult(getResult(newAnswers));
        setStep("email");
      }
    }, 400);
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    await fetch("/api/quiz-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, result }),
    });
    setSubmitting(false);
    setStep("result");
  }

  const progress = ((current) / QUESTIONS.length) * 100;

  // ─── INTRO ───────────────────────────────────────────────────────────────────
  if (step === "intro") {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-6">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-emerald-500/8 rounded-full blur-[120px]" />
        <div className="max-w-lg mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] mb-8 text-xs text-neutral-400">
            Takes 90 seconds · Free
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-heading tracking-tight mb-4 bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-transparent">
            Why can&apos;t you start?
          </h1>
          <p className="text-neutral-400 mb-3 leading-relaxed">
            It&apos;s not laziness. It&apos;s not a lack of motivation.
          </p>
          <p className="text-neutral-300 mb-10 leading-relaxed">
            Your brain has a <span className="text-white font-medium">specific blocker type</span> — and once you know it, you can fix it.
          </p>
          <button
            onClick={() => setStep("quiz")}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#10b981] to-[#14b8a6] text-white font-semibold text-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-emerald-500/20"
          >
            Find my blocker type →
          </button>
          <p className="mt-4 text-xs text-neutral-600">6 questions. No signup yet.</p>
        </div>
      </div>
    );
  }

  // ─── QUIZ ────────────────────────────────────────────────────────────────────
  if (step === "quiz") {
    const q = QUESTIONS[current];
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col px-6 py-10">
        {/* Progress */}
        <div className="max-w-lg mx-auto w-full mb-10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-neutral-500">Question {current + 1} of {QUESTIONS.length}</span>
            <span className="text-xs text-neutral-500">{Math.round(progress)}%</span>
          </div>
          <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#10b981] to-[#14b8a6] rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="max-w-lg mx-auto w-full flex-1 flex flex-col justify-center">
          <h2 className="text-2xl md:text-3xl font-bold font-heading tracking-tight mb-8 text-white">
            {q.text}
          </h2>
          <div className="flex flex-col gap-3">
            {q.options.map((opt) => (
              <button
                key={opt.type}
                onClick={() => handleAnswer(opt.type)}
                disabled={selected !== null}
                className={`w-full text-left px-5 py-4 rounded-2xl border transition-all duration-300 text-sm leading-relaxed
                  ${selected === opt.type
                    ? "border-emerald-500/60 bg-emerald-500/10 text-white scale-[0.99]"
                    : "border-white/[0.08] bg-white/[0.03] text-neutral-300 hover:border-white/20 hover:bg-white/[0.06] hover:text-white active:scale-[0.98]"
                  }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── EMAIL CAPTURE ────────────────────────────────────────────────────────────
  if (step === "email") {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-6">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-emerald-500/8 rounded-full blur-[120px]" />
        <div className="max-w-md mx-auto text-center relative">
          <div className="text-5xl mb-6">🔍</div>
          <h2 className="text-3xl font-bold font-heading tracking-tight mb-3">
            Your result is ready.
          </h2>
          <p className="text-neutral-400 mb-8 leading-relaxed">
            Where should we send your blocker type + the exact fix that works for it?
          </p>
          <form onSubmit={handleEmailSubmit} className="flex flex-col gap-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-5 py-4 rounded-2xl bg-white/[0.05] border border-white/[0.1] text-white placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/50 transition-colors text-sm"
            />
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#10b981] to-[#14b8a6] text-white font-semibold text-base transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-emerald-500/20 disabled:opacity-60 disabled:scale-100"
            >
              {submitting ? "Loading..." : "Show my result →"}
            </button>
          </form>
          <p className="mt-4 text-xs text-neutral-600">No spam. Unsubscribe anytime.</p>
        </div>
      </div>
    );
  }

  // ─── RESULT ───────────────────────────────────────────────────────────────────
  if (step === "result" && result) {
    const r = RESULTS[result];
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center px-6 py-16">
        <div className={`absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 ${r.glow} rounded-full blur-[120px]`} />

        <div className="max-w-lg mx-auto text-center relative">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] mb-6 text-xs text-neutral-400">
            Your blocker type
          </div>

          <div className="text-6xl mb-4">{r.emoji}</div>

          <h1 className={`text-4xl md:text-5xl font-bold font-heading tracking-tight mb-3 bg-gradient-to-r ${r.color} bg-clip-text text-transparent`}>
            {r.title}
          </h1>

          <p className="text-neutral-300 text-lg mb-6 font-medium">{r.tagline}</p>

          <div className="text-left bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 mb-6">
            <p className="text-neutral-300 leading-relaxed mb-4">{r.description}</p>
            <div className="border-t border-white/[0.06] pt-4">
              <p className="text-xs text-neutral-500 uppercase tracking-wider mb-2">What actually fixes this</p>
              <p className="text-white leading-relaxed text-sm">{r.fix}</p>
            </div>
          </div>

          {/* CTA */}
          <Link
            href="/"
            className="block w-full py-4 rounded-2xl bg-gradient-to-r from-[#10b981] to-[#14b8a6] text-white font-semibold text-base transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-emerald-500/20 mb-4"
          >
            Try Slam5 free — 3 days, no card
          </Link>

          <Link href="/" className="text-xs text-neutral-600 hover:text-neutral-400 transition-colors">
            ← Back to homepage
          </Link>
        </div>
      </div>
    );
  }

  return null;
}
