import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Fixed Nav with blur */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#0a0a0a]/70 backdrop-blur-2xl">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-6 h-14">
          <span className="text-lg font-heading font-bold tracking-tight">
            Slam<span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">5</span>
          </span>
          <div className="flex items-center gap-6">
            <Link
              href="/login"
              className="text-xs text-neutral-300 hover:text-white transition-colors duration-300"
            >
              Log in
            </Link>
            <Link
              href="/login"
              className="text-xs px-5 py-2 rounded-full bg-gradient-to-r from-[#10b981] to-[#14b8a6] text-white font-medium transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30"
            >
              Start free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center px-6 pt-14 relative overflow-hidden">
        {/* Glow blobs */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] animate-[glow_4s_ease-in-out_infinite]" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-teal-500/[0.08] rounded-full blur-[100px] animate-[glow_5s_ease-in-out_infinite_1s]" />

        <div className="max-w-3xl mx-auto text-center relative">
          <p className="text-sm text-neutral-500 mb-3 tracking-wide uppercase">
            for brains that work differently
          </p>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-5 bg-gradient-to-b from-white via-white to-neutral-400 bg-clip-text text-transparent">
            You know what to do
          </h1>
          <p className="text-3xl md:text-5xl font-bold tracking-tighter mb-6 bg-gradient-to-r from-[#34d399] to-[#2dd4bf] bg-clip-text text-transparent">
            You just can&apos;t start
          </p>
          <p className="text-neutral-400 max-w-lg mx-auto mb-12 leading-relaxed text-base">
            Pick 5 tasks. Do them. Win the day. That&apos;s it.
            No complicated system. Just you vs. your list.
          </p>
          <Link
            href="/login"
            className="inline-block px-7 py-3.5 rounded-full bg-gradient-to-r from-[#10b981] to-[#14b8a6] text-white text-sm font-medium transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30"
          >
            Try it free — 3 days, no card
          </Link>
          <p className="text-xs text-neutral-500 mt-4">
            Then $9.99/mo. Cancel anytime.
          </p>
        </div>
      </section>

      {/* Benefits — FIRST */}
      <section className="py-20 px-6 bg-white/[0.015]">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-emerald-900/30" />
            <span className="text-sm font-mono text-emerald-400/70 uppercase tracking-widest font-medium">Benefits</span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-emerald-900/30" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-10">
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
              <div key={i} className="flex items-start gap-4 p-5 rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.03] hover:bg-emerald-500/[0.06] transition-colors duration-300">
                <span className="text-2xl">{f.icon}</span>
                <div>
                  <h3 className="font-medium text-neutral-200 mb-1">{f.title}</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works — SECOND */}
      <section className="py-20 px-6 relative">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-neutral-800" />
            <span className="text-sm font-mono text-neutral-500 uppercase tracking-widest font-medium">How it works</span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-neutral-800" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-10 text-center">
            Dead simple
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: "01", title: "Pick 5 tasks", desc: "Body. Mind. Money. Pick what matters today." },
              { step: "02", title: "Slam them", desc: "Set a timer. Focus. Get it done. One by one." },
              { step: "03", title: "Win or lose", desc: "All 5 done = you won. Miss one = you lost. Simple." },
            ].map((item) => (
              <div key={item.step} className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-colors duration-300">
                <span className="text-xs font-mono text-emerald-400 mb-4 block">{item.step}</span>
                <h3 className="font-heading font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-neutral-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pain points */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-4">
            You&apos;re not lazy
          </h2>
          <p className="text-center text-neutral-400 mb-12">
            Your brain just needs a different system.
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
                className="flex items-center gap-3 p-4 rounded-xl border border-white/[0.06] bg-white/[0.015]"
              >
                <span className="text-red-400 text-xs">&#10005;</span>
                <span className="text-sm text-neutral-300">{pain}</span>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <p className="text-lg font-heading font-bold bg-gradient-to-r from-[#34d399] to-[#2dd4bf] bg-clip-text text-transparent">
              Slam5 turns it into a game you can win
            </p>
          </div>
        </div>
      </section>

      {/* Science */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
            Why it works
          </h2>
          <p className="text-neutral-400 mb-10 max-w-xl mx-auto leading-relaxed">
            Based on real psychology. Small wins build confidence.
            Confidence builds momentum. Momentum changes your life.
          </p>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              <span className="text-3xl font-heading font-bold bg-gradient-to-r from-[#34d399] to-[#2dd4bf] bg-clip-text text-transparent block">5</span>
              <span className="text-xs text-neutral-500">tasks per day</span>
            </div>
            <div className="p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              <span className="text-3xl font-heading font-bold bg-gradient-to-r from-[#34d399] to-[#2dd4bf] bg-clip-text text-transparent block">30</span>
              <span className="text-xs text-neutral-500">to win the week</span>
            </div>
            <div className="p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              <span className="text-3xl font-heading font-bold bg-gradient-to-r from-[#34d399] to-[#2dd4bf] bg-clip-text text-transparent block">3/4</span>
              <span className="text-xs text-neutral-500">weeks to win the month</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/[0.06] rounded-full blur-[150px]" />
        <div className="max-w-3xl mx-auto relative">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6 bg-gradient-to-r from-[#34d399] to-[#2dd4bf] bg-clip-text text-transparent">
            Stop thinking. Start doing.
          </h2>
          <p className="text-lg text-neutral-400 mb-10">
            3 days free. No card. Just you and 5 tasks.
          </p>
          <Link
            href="/login"
            className="inline-block px-7 py-3.5 rounded-full bg-gradient-to-r from-[#10b981] to-[#14b8a6] text-white text-sm font-medium transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30"
          >
            Start winning today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-8 text-center text-xs text-neutral-500">
        <p>&copy; {new Date().getFullYear()} Slam5. All rights reserved.</p>
      </footer>
    </div>
  );
}
