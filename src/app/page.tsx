import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

export default function HomePage() {
  return (
    <>
      <SiteNav />

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-5 pb-10 pt-16 text-center sm:pt-24">
          <h1 className="mx-auto max-w-3xl font-heading text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
            Mieszkania
            <br />
            <span className="text-brand">Kraków</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
            Zadbaj o bezpieczeństwo i wynajmij mieszkanie.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/wynajmujacy"
              className="w-full rounded-full bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground shadow-sm shadow-brand/20 transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-brand/30 sm:w-auto"
            >
              Wynajmij mieszkanie
            </Link>
            <Link
              href="/najemca"
              className="w-full rounded-full border border-border bg-card px-8 py-4 text-sm font-semibold shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md sm:w-auto"
            >
              Szukam mieszkania
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
