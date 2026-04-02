import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <span className="text-xl font-heading font-bold tracking-tight">
          Slam<span className="text-indigo-500">5</span>
        </span>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/login"
            className="text-sm px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 transition-colors font-medium"
          >
            Start free →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto text-center px-6 pt-24 pb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-medium mb-6">
          🧠 For brains that work differently
        </div>
        <h1 className="text-5xl md:text-6xl font-heading font-bold tracking-tight leading-tight mb-6">
          You know what to do.<br />
          <span className="text-indigo-500">You just can&apos;t start.</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Slam5 turns your day into a game. 5 tasks. Win or lose. No excuses.
          Built for ADHD brains, procrastinators, and overthinkers who are done being stuck.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/login"
            className="px-8 py-3.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 transition-colors text-lg font-medium"
          >
            Start for free — 3 days, no card 🥊
          </Link>
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          Then $9.99/month. Cancel anytime.
        </p>
      </section>

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-heading font-bold text-center mb-12">
          How it works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <span className="text-4xl block mb-4">🥊</span>
            <h3 className="font-heading font-bold text-lg mb-2">1. Pick your 5</h3>
            <p className="text-sm text-muted-foreground">
              Every morning, write 5 tasks that will actually move your life forward. Body. Mind. Money.
            </p>
          </div>
          <div className="text-center">
            <span className="text-4xl block mb-4">⏱</span>
            <h3 className="font-heading font-bold text-lg mb-2">2. Slam them</h3>
            <p className="text-sm text-muted-foreground">
              Set a timer. Focus. Eat the frog first. Park random thoughts. Get it done.
            </p>
          </div>
          <div className="text-center">
            <span className="text-4xl block mb-4">🏆</span>
            <h3 className="font-heading font-bold text-lg mb-2">3. Win or lose</h3>
            <p className="text-sm text-muted-foreground">
              All 5 done? You won the day. Miss one? You lost. Stack wins. Build streaks. Level up.
            </p>
          </div>
        </div>
      </section>

      {/* Pain points */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-heading font-bold text-center mb-4">
          Sound familiar?
        </h2>
        <p className="text-center text-muted-foreground mb-12">
          You&apos;re not lazy. Your brain just works differently.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            "I open my laptop and 3 hours disappear",
            "I have 47 tabs open and can't focus on one",
            "I make great plans but never follow through",
            "I know exactly what I need to do but I can't start",
            "I feel busy all day but nothing gets done",
            "I beat myself up every night for wasting the day",
          ].map((pain, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card"
            >
              <span className="text-red-400">✗</span>
              <span className="text-sm">{pain}</span>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <p className="text-lg font-heading font-bold text-indigo-400">
            Slam5 fixes this. Not with willpower. With a game.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-heading font-bold text-center mb-12">
          Built for your brain
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { emoji: "🐸", title: "Eat the Frog", desc: "Your hardest task goes first. Before your brain can say no." },
            { emoji: "⏱", title: "Focus Timer", desc: "Custom Pomodoro per task. Visual progress. No distractions." },
            { emoji: "🅿️", title: "Parking Lot", desc: "Random thought? Park it. Don't lose focus. Come back later." },
            { emoji: "🏆", title: "Win/Lose Verdict", desc: "Every day at midnight: did you win or lose? No middle ground." },
            { emoji: "🔥", title: "Streaks & Points", desc: "Stack wins. Build streaks. Watch your score go up." },
            { emoji: "🎵", title: "Focus Sounds", desc: "Brown noise, rain, lo-fi. Built in. One click. Zone in." },
            { emoji: "👥", title: "Friends & Leaderboard", desc: "Invite friends. See who won today. Competition fuels action." },
            { emoji: "📱", title: "SMS Reminders", desc: "We text you. Morning: your tasks. Evening: your verdict." },
          ].map((f, i) => (
            <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-border bg-card">
              <span className="text-2xl">{f.emoji}</span>
              <div>
                <h3 className="font-medium mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Science */}
      <section className="max-w-3xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-heading font-bold mb-6">
          The science behind it
        </h2>
        <p className="text-muted-foreground mb-6">
          Based on Albert Bandura&apos;s <strong className="text-foreground">Self-Efficacy Theory</strong> and
          Andy Frisella&apos;s <strong className="text-foreground">Power List</strong> method.
        </p>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-xl border border-border bg-card">
            <span className="text-2xl font-heading font-bold text-indigo-400 block">5</span>
            <span className="text-xs text-muted-foreground">tasks per day</span>
          </div>
          <div className="p-4 rounded-xl border border-border bg-card">
            <span className="text-2xl font-heading font-bold text-indigo-400 block">30/35</span>
            <span className="text-xs text-muted-foreground">to win the week</span>
          </div>
          <div className="p-4 rounded-xl border border-border bg-card">
            <span className="text-2xl font-heading font-bold text-indigo-400 block">3/4</span>
            <span className="text-xs text-muted-foreground">weeks to win the month</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-6">
          Small wins → confidence → bigger wins → unstoppable.
        </p>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-4xl font-heading font-bold mb-4">
          Stop planning. Start slamming.
        </h2>
        <p className="text-xl text-muted-foreground mb-8">
          Your first 3 days are free. No credit card. Just you and your 5 tasks.
        </p>
        <Link
          href="/login"
          className="inline-block px-8 py-3.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 transition-colors text-lg font-medium"
        >
          Start winning today →
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        <p>Slam5 — Slam your 5. Win the day. Every day.</p>
        <p className="mt-1">© {new Date().getFullYear()} Slam5. All rights reserved.</p>
      </footer>
    </div>
  );
}
