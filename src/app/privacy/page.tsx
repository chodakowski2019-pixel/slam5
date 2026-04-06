import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — Slam5",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#0a0a0a]/70 backdrop-blur-2xl">
        <div className="max-w-3xl mx-auto flex items-center justify-between px-6 h-14">
          <Link href="/" className="text-lg font-bold tracking-tight">
            Slam<span className="bg-gradient-to-r from-[#34d399] to-[#2dd4bf] bg-clip-text text-transparent">5</span>
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 pt-28 pb-20">
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-neutral-500 text-sm mb-12">Last updated: April 6, 2025</p>

        <div className="prose prose-invert prose-sm max-w-none space-y-8 text-neutral-300 leading-relaxed">

          <section>
            <h2 className="text-white text-lg font-semibold mb-3">1. Who we are</h2>
            <p>
              Slam5 (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is a productivity app available at slam5.com.
              We are operated by Jakub Chodakowski. If you have any questions about this policy, contact us at{" "}
              <a href="mailto:kuba@slam5.com" className="text-emerald-400 hover:text-emerald-300">kuba@slam5.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold mb-3">2. What data we collect</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-white">Email address</strong> — when you take our quiz or create an account.</li>
              <li><strong className="text-white">Quiz responses</strong> — your answers and blocker type result (stored anonymously).</li>
              <li><strong className="text-white">Usage data</strong> — pages visited, session duration, general device info (via analytics).</li>
              <li><strong className="text-white">Payment data</strong> — processed by Stripe. We never store your card details.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold mb-3">3. How we use your data</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>To send you your quiz result and follow-up emails you consented to.</li>
              <li>To provide and improve the Slam5 app.</li>
              <li>To process your subscription via Stripe.</li>
              <li>To send product updates and tips (you can unsubscribe anytime).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold mb-3">4. Email communications</h2>
            <p>
              By submitting your email through our quiz, you consent to receive a series of emails
              related to your blocker type and Slam5. You can unsubscribe at any time by clicking
              the unsubscribe link in any email we send.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold mb-3">5. Third-party services</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-white">Brevo</strong> — email delivery and contact management.</li>
              <li><strong className="text-white">Stripe</strong> — payment processing.</li>
              <li><strong className="text-white">Supabase</strong> — user authentication and data storage.</li>
              <li><strong className="text-white">Vercel</strong> — app hosting.</li>
            </ul>
            <p className="mt-3">Each of these services has their own privacy policy governing their data use.</p>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold mb-3">6. Data retention</h2>
            <p>
              We retain your data as long as your account is active. You can request deletion of your
              data at any time by emailing{" "}
              <a href="mailto:kuba@slam5.com" className="text-emerald-400 hover:text-emerald-300">kuba@slam5.com</a>.
              We will process your request within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold mb-3">7. Your rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Access the personal data we hold about you.</li>
              <li>Request correction or deletion of your data.</li>
              <li>Withdraw consent for email communications at any time.</li>
              <li>Lodge a complaint with a data protection authority.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold mb-3">8. Cookies</h2>
            <p>
              We use only essential cookies required for authentication and app functionality.
              We do not use tracking or advertising cookies.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold mb-3">9. Changes to this policy</h2>
            <p>
              We may update this policy from time to time. If we make significant changes, we will
              notify you by email or by posting a notice on our website.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold mb-3">10. Contact</h2>
            <p>
              Questions about this policy?{" "}
              <a href="mailto:kuba@slam5.com" className="text-emerald-400 hover:text-emerald-300">kuba@slam5.com</a>
            </p>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-white/[0.06]">
          <Link href="/" className="text-xs text-neutral-600 hover:text-neutral-400 transition-colors">
            ← Back to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
