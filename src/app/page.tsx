import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-5xl mx-auto">
        <span className="text-xl font-heading font-bold tracking-tight">
          Slam<span className="text-indigo-400">5</span>
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
            className="text-sm px-5 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 transition-all duration-200 font-medium hover:scale-[1.02] active:scale-[0.98]"
          >
            Start free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-3xl mx-auto text-center px-6 pt-28 pb-20">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 text-xs font-medium mb-8">
          Built for brains that work differently
        </div>
        <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tight leading-[1.1] mb-6">
          You know what to do.
          <br />
          <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            You just can&apos;t start.
          </span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
          Pick 5 tasks. Do them. Win the day. That&apos;s it.
          No complicated system. Just you vs. your list.
        </p>
        <Link
          href="/login"
          className="inline-block px-8 py-4 rounded-2xl bg-indigo-500 hover:bg-indigo-400 transition-all duration-200 text-lg font-medium hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-indigo-500/20"
        >
          Try it free — 3 days, no card
        </Link>
        <p className="text-xs text-muted-foreground mt-4">
          Then $9.99/mo. Cancel anytime.
        </p>
      </section>

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-heading font-bold text-center mb-16">
          Dead simple.
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { step: "01", title: "Pick 5 tasks", desc: "Body. Mind. Money. Pick what matters today." },
            { step: "02", title: "Slam them", desc: "Set a timer. Focus. Get it done. One by one." },
            { step: "03", title: "Win or lose", desc: "All 5 done = you won. Miss one = you lost. Simple." },
          ].map((item) => (
            <div key={item.step} className="p-6 rounded-2xl border border-border bg-card/50 hover:bg-card transition-colors duration-300">
              <span className="text-xs font-mono text-indigo-400 mb-4 block">{item.step}</span>
              <h3 className="font-heading font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pain points */}
      <section className="max-w-3xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-heading font-bold text-center mb-4">
          This you?
        </h2>
        <p className="text-center text-muted-foreground mb-12">
          You&apos;re not lazy. Your brain just needs a different system.
        </p>
        <div className="grid md:grid-cols-2 gap-3">
          {[
            "I open my laptop and 3 hours disappear",
            "I have 47 tabs open and can't pick one",
            "I make plans but never do them",
            "I know what to do but I can't start",
            "I feel busy all day but nothing gets done",
            "I beat myself up every night",
          ].map((pain, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card/50"
            >
              <span className="text-red-400 text-xs">&#10005;</span>
              <span className="text-sm">{pain}</span>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <p className="text-lg font-heading font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            Slam5 turns it into a game you can win.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-heading font-bold text-center mb-16">
          Everything you need. Nothing you don&apos;t.
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { icon: "🐸", title: "Eat the Frog", desc: "Hardest task goes first. Before your brain says no." },
            { icon: "⏱", title: "Focus Timer", desc: "Set a timer per task. See the progress. Stay locked in." },
            { icon: "🅿️", title: "Parking Lot", desc: "Random thought? Park it. Come back later. Don't break focus." },
            { icon: "🏆", title: "Win or Lose", desc: "Every day at midnight: did you win or not? No gray area." },
            { icon: "🔥", title: "Streaks", desc: "Stack wins. Build streaks. Watch your score grow." },
            { icon: "🎵", title: "Focus Sounds", desc: "Brown noise, rain, lo-fi. One click. Zone in." },
            { icon: "👥", title: "Leaderboard", desc: "Invite friends. See who won today. Competition helps." },
            { icon: "📱", title: "SMS Reminders", desc: "We text you. Morning: your tasks. Evening: your score." },
          ].map((f, i) => (
            <div key={i} className="flex items-start gap-4 p-5 rounded-2xl border border-border bg-card/50 hover:bg-card transition-colors duration-300">
              <span className="text-2xl">{f.icon}</span>
              <div>
                <h3 className="font-medium mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Science */}
      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-heading font-bold mb-6">
          Why it works
        </h2>
        <p className="text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed">
          Based on real psychology. Small wins build confidence.
          Confidence builds momentum. Momentum changes your life.
        </p>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-5 rounded-2xl border border-border bg-card/50">
            <span className="text-3xl font-heading font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent block">5</span>
            <span className="text-xs text-muted-foreground">tasks per day</span>
          </div>
          <div className="p-5 rounded-2xl border border-border bg-card/50">
            <span className="text-3xl font-heading font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent block">30</span>
            <span className="text-xs text-muted-foreground">to win the week</span>
          </div>
          <div className="p-5 rounded-2xl border border-border bg-card/50">
            <span className="text-3xl font-heading font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent block">3/4</span>
            <span className="text-xs text-muted-foreground">weeks to win the month</span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
          Stop thinking. Start doing.
        </h2>
        <p className="text-lg text-muted-foreground mb-10">
          3 days free. No card. Just you and 5 tasks.
        </p>
        <Link
          href="/login"
          className="inline-block px-8 py-4 rounded-2xl bg-indigo-500 hover:bg-indigo-400 transition-all duration-200 text-lg font-medium hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-indigo-500/20"
        >
          Start winning today
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Slam5. All rights reserved.</p>
      </footer>
    </div>
  );
}
