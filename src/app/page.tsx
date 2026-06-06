import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { ListingsFeed } from "@/components/listings-feed";
import { SiteFooter } from "@/components/site-footer";

export default function HomePage() {
  return (
    <>
      <SiteNav />

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-5 pb-10 pt-16 text-center sm:pt-24">
          <span className="inline-block rounded-full bg-brand-soft px-4 py-1.5 text-sm font-medium text-brand">
            Najem mieszkań nowej generacji
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl font-heading text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
            Znajdziemy Ci najemcę.
            <br />
            <span className="text-brand">Albo zwracamy pieniądze.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
            Wystaw mieszkanie, a my dopasujemy najemcę dokładnie pod Twoje
            kryteria. Najemca obejrzy je online, bez wychodzenia z domu.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/wynajmujacy"
              className="w-full rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 sm:w-auto"
            >
              Wystaw mieszkanie
            </Link>
            <Link
              href="/najemca"
              className="w-full rounded-full border border-border bg-card px-7 py-3.5 text-sm font-semibold transition-colors hover:bg-accent sm:w-auto"
            >
              Szukam mieszkania
            </Link>
          </div>
        </section>

        {/* Lista mieszkan (z bazy, fallback: przyklady) */}
        <ListingsFeed />
      </main>

      <SiteFooter />
    </>
  );
}
