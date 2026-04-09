import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Fixed Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#0a0a0a]/70 backdrop-blur-2xl">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-6 h-14">
          <span className="text-lg font-heading font-bold tracking-tight">
            Slam<span className="bg-gradient-to-r from-[#34d399] to-[#2dd4bf] bg-clip-text text-transparent">5</span>
          </span>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-xs text-neutral-300 hover:text-white transition-colors duration-300">
              Log in
            </Link>
            <Link href="/login?mode=signup" className="text-xs px-5 py-2 rounded-full bg-gradient-to-r from-[#10b981] to-[#14b8a6] text-white font-medium transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] shadow-lg shadow-emerald-500/20">
              Start free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center px-6 pt-14 relative overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] animate-[glow_4s_ease-in-out_infinite]" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-teal-500/[0.08] rounded-full blur-[100px] animate-[glow_5s_ease-in-out_infinite_1s]" />

        <div className="max-w-3xl mx-auto text-center relative">
          {/* Social proof pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] mb-8">
            <div className="flex -space-x-1.5">
              {[10,20,32,44,56].map((n, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={`https://i.pravatar.cc/40?img=${n}`} alt="user" className="w-6 h-6 rounded-full border border-emerald-500/30 object-cover" />
              ))}
            </div>
            <span className="text-xs text-neutral-300">1,247 people won this month</span>
          </div>

          <p className="text-sm text-neutral-500 mb-3 tracking-wide uppercase">
            for brains that work differently
          </p>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-5 bg-gradient-to-b from-white via-white to-neutral-400 bg-clip-text text-transparent">
            You know what to do
          </h1>
          <p className="text-3xl md:text-5xl font-bold tracking-tighter mb-6 bg-gradient-to-r from-[#34d399] to-[#2dd4bf] bg-clip-text text-transparent">
            You just can&apos;t start
          </p>
          <p className="text-neutral-400 max-w-lg mx-auto mb-10 leading-relaxed text-base">
            Pick 5 tasks. Do them. Win the day. That&apos;s it.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/login?mode=signup" className="inline-block px-7 py-3.5 rounded-full bg-gradient-to-r from-[#10b981] to-[#14b8a6] text-white text-sm font-medium transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] shadow-lg shadow-emerald-500/20">
              Try it free, 3 days trial
            </Link>
          </div>
          <p className="text-xs text-neutral-500 mt-4">
            Then $9.99/mo. Cancel anytime.
          </p>
        </div>
      </section>

      {/* Pain */}
      <section className="py-12 px-6">
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
              <div key={i} className="flex items-center gap-3 p-4 rounded-xl border border-white/[0.06] bg-white/[0.015]">
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

      {/* Benefits */}
      <section className="py-12 px-6 bg-white/[0.015]">
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
              { icon: "🐸", title: "Start with the hardest thing", desc: "Tackle your scariest task first. Before your brain has time to say no." },
              { icon: "⏱", title: "Know when you'll be done", desc: "Set a timer per task. Watch it count down. The end is always visible." },
              { icon: "🅿️", title: "Never lose a thought mid-focus", desc: "Random idea? Park it in one click. Come back after you're done." },
              { icon: "🏆", title: "Win or lose. Every day.", desc: "5 done = you won. Less than 5 = you lost. No in-between." },
              { icon: "🔥", title: "Build a streak you fear breaking", desc: "Stack wins daily. Your streak becomes your identity." },
              { icon: "🎵", title: "Zone in with one click", desc: "Brown noise, rain, lo-fi. Built right in. No ads, no searching." },
              { icon: "👥", title: "Win against your friends", desc: "Invite your crew. See who's winning today. Accountability without shame." },
              { icon: "📱", title: "We remind you so you don't forget", desc: "Morning text: your 5 tasks. Evening text: your score." },
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

      {/* How it works */}
      <section className="py-12 px-6 relative">
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
              { step: "01", title: "Pick 5 tasks", desc: "Pick the 5 tasks that matter most today." },
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

      {/* Social proof */}
      <section className="py-12 px-6 bg-white/[0.015]">
        <div className="max-w-3xl mx-auto text-center">
          <div className="grid grid-cols-3 gap-4 mb-16">
            <div className="p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              <span className="text-3xl font-heading font-bold bg-gradient-to-r from-[#34d399] to-[#2dd4bf] bg-clip-text text-transparent block">1,247</span>
              <span className="text-xs text-neutral-500">people won this month</span>
            </div>
            <div className="p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              <span className="text-3xl font-heading font-bold bg-gradient-to-r from-[#34d399] to-[#2dd4bf] bg-clip-text text-transparent block">83%</span>
              <span className="text-xs text-neutral-500">win rate after week 2</span>
            </div>
            <div className="p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              <span className="text-3xl font-heading font-bold bg-gradient-to-r from-[#34d399] to-[#2dd4bf] bg-clip-text text-transparent block">4.8★</span>
              <span className="text-xs text-neutral-500">average rating</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              { text: "I've tried every productivity app. This is the only one I actually use every day. The win/lose thing is addictive.", name: "Marcus T.", tag: "ADHD diagnosed" },
              { text: "Week 3 streak. I haven't felt this in control in years. My therapist noticed the difference.", name: "Sarah K.", tag: "Anxiety + burnout" },
              { text: "It's stupid simple. That's why it works. My brain can't argue with 5 tasks.", name: "James R.", tag: "Entrepreneur" },
            ].map((t, i) => (
              <div key={i} className="p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] text-left">
                <p className="text-sm text-neutral-300 leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <p className="text-xs font-medium text-white">{t.name}</p>
                  <p className="text-xs text-emerald-400/70">{t.tag}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quiz CTA */}
      <section id="lead" className="py-12 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="p-8 rounded-3xl border border-emerald-500/20 bg-emerald-500/[0.04] text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-[80px]" />
            <div className="relative">
              <span className="text-4xl mb-4 block">🧠</span>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
                What&apos;s your ADHD blocker type?
              </h2>
              <p className="text-neutral-400 mb-6 max-w-md mx-auto text-sm leading-relaxed">
                Take the free 2-minute quiz. Find out why you can&apos;t start — and what to do about it.
              </p>
              <Link href="/quiz" className="inline-block px-7 py-3.5 rounded-full bg-gradient-to-r from-[#10b981] to-[#14b8a6] text-white text-sm font-medium transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] shadow-lg shadow-emerald-500/20">
                Take the free quiz
              </Link>
              <p className="text-xs text-neutral-500 mt-3">Free. No email required to start.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 px-6 bg-white/[0.015]">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-10">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-neutral-800" />
            <span className="text-sm font-mono text-neutral-500 uppercase tracking-widest font-medium">FAQ</span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-neutral-800" />
          </div>
          <div className="space-y-4">
            {[
              { q: "Is this for people with ADHD?", a: "Yes. But you don't need a diagnosis. If you struggle to start, stay focused, or feel like you're never doing enough, this is for you." },
              { q: "What if I only do 4 out of 5 tasks?", a: "You lose the day. No partial credit. It sounds harsh, but that's the point. The binary win/lose is what makes your brain take it seriously." },
              { q: "How is this different from a regular to-do app?", a: "Regular to-do apps let you add 47 tasks and feel busy doing nothing. Slam5 forces you to pick 5, gives you a timer, and tells you at midnight if you won or lost. It's a game, not a list." },
              { q: "Do I need a credit card to try it?", a: "Yes. But you won't be charged for 3 days. Cancel before then and you pay nothing. After that it's $9.99/month." },
              { q: "What if I miss a day?", a: "Your streak resets. That's it. No punishment, no lecture. Just start again tomorrow. The app won't guilt-trip you." },
            ].map((item, i) => (
              <div key={i} className="p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
                <h3 className="font-medium text-neutral-200 mb-2">{item.q}</h3>
                <p className="text-sm text-neutral-400 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-6 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/[0.06] rounded-full blur-[150px]" />
        <div className="max-w-3xl mx-auto relative">
          <p className="text-sm text-emerald-400 uppercase tracking-widest font-mono mb-4">Your streak starts today</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6 bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-transparent">
            Stop thinking<br />Start winning
          </h2>
          <p className="text-neutral-400 mb-10 max-w-md mx-auto">
            3 days free. Card required, no charge yet. If it doesn&apos;t work in 3 days, you lost nothing.
          </p>
          <Link href="/login?mode=signup" className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-[#10b981] to-[#14b8a6] text-white font-medium transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] shadow-lg shadow-emerald-500/20 text-base">
            Start winning today, it&apos;s free
          </Link>
          <p className="text-xs text-neutral-500 mt-4">Then $9.99/mo. Cancel anytime.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-8 text-center text-xs text-neutral-500">
        <p>&copy; {new Date().getFullYear()} Slam5. All rights reserved.</p>
      </footer>
    </div>
  );
}
