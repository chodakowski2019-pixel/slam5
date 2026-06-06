import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { TenantLeadForm } from "@/components/tenant-lead-form";

const STEPS = [
  {
    n: "1",
    title: "Mówisz czego szukasz",
    desc: "Miasto, budżet, dzielnica, liczba pokoi, od kiedy. Im więcej kryteriów, tym lepsze dopasowanie.",
  },
  {
    n: "2",
    title: "Dopasowujemy mieszkania",
    desc: "Nasz system pokazuje oferty z dopasowaniem procentowym do Twoich potrzeb.",
  },
  {
    n: "3",
    title: "Oglądasz online",
    desc: "Spacer 360° prosto z kanapy. Nie musisz jeździć po mieście ani brać wolnego w pracy.",
  },
  {
    n: "4",
    title: "Wynajmujesz",
    desc: "Wybierasz mieszkanie i podpisujesz umowę. Szybko, bez chodzenia po pokazach.",
  },
];

const BENEFITS = [
  {
    title: "Oglądanie bez wychodzenia z domu",
    desc: "Idealne, gdy szukasz mieszkania w innym mieście lub z zagranicy.",
  },
  {
    title: "Dopasowanie do Twoich kryteriów",
    desc: "Nie przekopujesz setek ogłoszeń. Pokazujemy tylko to, co naprawdę pasuje.",
  },
  {
    title: "Sprawdzeni wynajmujący",
    desc: "Mieszkania z realnymi zdjęciami i spacerem, bez ściemy i podstawionych ofert.",
  },
];

export default function NajemcaPage() {
  return (
    <>
      <SiteNav />
      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-4xl px-5 pb-12 pt-16 text-center sm:pt-24">
          <span className="inline-block rounded-full bg-brand-soft px-4 py-1.5 text-sm font-medium text-brand">
            Dla najemców
          </span>
          <h1 className="mx-auto mt-6 max-w-2xl font-heading text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
            Znajdź mieszkanie bez wychodzenia z domu
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
            Powiedz nam czego szukasz, a my dopasujemy mieszkania pod Ciebie.
            Obejrzysz je online, zanim podejmiesz decyzję.
          </p>
          <Link
            href="/login?mode=signup"
            className="mt-9 inline-block rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Szukam mieszkania
          </Link>
        </section>

        {/* Korzysci */}
        <section className="mx-auto max-w-5xl px-5 py-12">
          <div className="grid gap-5 sm:grid-cols-3">
            {BENEFITS.map((b) => (
              <div
                key={b.title}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <h3 className="font-heading text-lg font-semibold">{b.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{b.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Jak to dziala */}
        <section className="mx-auto max-w-5xl px-5 py-12">
          <h2 className="mb-10 text-center font-heading text-2xl font-bold tracking-tight">
            Jak to działa
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <div
                key={s.n}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
                  {s.n}
                </div>
                <h3 className="mt-4 font-heading text-lg font-semibold">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Lead form */}
        <section className="mx-auto max-w-2xl px-5 py-12">
          <TenantLeadForm />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
