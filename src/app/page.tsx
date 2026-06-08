import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { FaqAccordion } from "@/components/faq-accordion";

// PLACEHOLDER — zdjecia stockowe, podmienic na realne po pierwszych najmach
const AVATARS = [
  "/avatars/u1.jpg",
  "/avatars/u2.jpg",
  "/avatars/u3.jpg",
  "/avatars/u4.jpg",
  "/avatars/u5.jpg",
];

const TRUST = [
  "Gwarancja zwrotu",
  "Weryfikacja w bazach dłużników",
  "Bezpieczne płatności Stripe",
  "Umowa przygotowana przez prawnika",
];

const PAIN_STATS = [
  {
    stat: "3 msc.",
    label: "Tyle zajmuje znalezienie najemcy",
  },
  {
    stat: "12",
    label: "tyle pokazów, zanim podpiszesz umowę",
  },
  {
    stat: "9 000 zł",
    label: "strata na 1 problematycznym najemcy",
  },
];

const AGITATE = [
  {
    title: "Nie płaci czynszu",
    desc: "A Ty dalej spłacasz kredyt i czynsz do spółdzielni z własnej kieszeni.",
  },
  {
    title: "Niszczy mieszkanie",
    desc: "Kaucja nie pokrywa szkód, remont idzie w tysiące.",
  },
  {
    title: "Nie chce się wyprowadzić",
    desc: "Eksmisja w Polsce ciągnie się miesiącami: sąd, komornik, nerwy.",
  },
];

const STEPS = [
  {
    n: "1",
    title: "Powiedz kogo chcesz",
    desc: "Wypełnij ankietę, powiedz nam jaki jest Twój wymarzony najemca.",
  },
  {
    n: "2",
    title: "Szukamy najemcy",
    desc: "Dopasowujemy najemcę dokładnie pod Twoje kryteria i weryfikujemy go.",
  },
  {
    n: "3",
    title: "Podpisujesz umowę",
    desc: "Łączymy Cię z Twoim wymarzonym najemcą.",
  },
];

// Te same rzeczy w KAZDYM wariancie. Rozni sie tylko gwarantowany termin.
const INCLUDED = [
  "Wymarzonego najemcę",
  "Weryfikacja najemcy",
  "Wzór umowy najmu",
  "Gwarancja zwrotu 100%",
  "Dedykowany opiekun",
  "Wsparcie po podpisaniu umowy (30 dni)",
];

const PLANS = [
  {
    name: "Premium I",
    price: "2000 zł",
    href: "https://buy.stripe.com/6oU7sKfLiaxS1k99Icebu09",
    term: "Najemca do 90 dni",
    cta: "To coś dla mnie",
    featured: false,
  },
  {
    name: "Premium II",
    price: "4000 zł",
    href: "https://buy.stripe.com/14AaEWbv20XiaUJ9Icebu08",
    term: "Najemca do 60 dni",
    cta: "Chcę tego najemcę!",
    featured: true,
  },
  {
    name: "Premium III",
    price: "6000 zł",
    href: "https://buy.stripe.com/6oU7sKaqYbBWd2RaMgebu05",
    term: "Najemca do 30 dni",
    cta: "Zaczynamy!",
    featured: false,
  },
];

const CHECKS = [
  "Tożsamość",
  "Dochody",
  "Bazy dłużników",
  "Referencje",
  "Stabilność",
];

const FAQ = [
  {
    q: "Jak sprawdzacie najemcę?",
    a: "Weryfikujemy tożsamość, dochody, obecność w bazach dłużników, referencje i stabilność sytuacji. Do Ciebie trafia tylko dopasowany i sprawdzony kandydat, nie ktoś z przypadku.",
  },
  {
    q: "Kiedy i ile płacę?",
    a: "Płatność dokonywana jest teraz, po jej dokonaniu zaczynamy szukać najemcy.",
  },
  {
    q: "Co jeśli nie znajdziecie najemcy?",
    a: "Otrzymasz zwrot 100% w przeciągu 5 dni roboczych.",
  },
];

export default function HomePage() {
  return (
    <>
      <SiteNav />
      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-4xl px-5 pb-12 pt-16 text-center sm:pt-24">
          <h1 className="mx-auto max-w-2xl font-heading text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
            Znajdziemy Ci najemcę,
            <br />
            albo zwrócimy pieniądze
          </h1>

          {/* Social proof (PLACEHOLDER) — pod naglowkiem */}
          <div className="mt-6 flex justify-center">
            <div className="inline-flex items-center gap-3 rounded-full border border-border bg-card px-4 py-2 shadow-sm">
              <div className="flex -space-x-2.5">
                {AVATARS.map((src) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={src}
                    src={src}
                    alt=""
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-card"
                  />
                ))}
              </div>
              <span className="pr-1 text-sm font-medium">
                + 1 247 wynajętych mieszkań
              </span>
            </div>
          </div>

          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
            Opisz nam wymarzonego klienta.
          </p>
          <a
            href="#cennik"
            className="mt-9 inline-block rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Chcę bezpiecznego najemcę!
          </a>

          {/* Odznaki zaufania — 4 kafelki */}
          <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
            {TRUST.map((t) => (
              <div
                key={t}
                className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card px-4 py-6 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-soft">
                  <svg
                    className="h-5 w-5 text-brand"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 011.4-1.4l3.3 3.3 6.8-6.8a1 1 0 011.4 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {t}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Problem / bol */}
        <section className="mx-auto max-w-5xl px-5 py-12">
          <h2 className="mx-auto mb-10 max-w-2xl text-center font-heading text-2xl font-bold tracking-tight">
            Nie podejmuj ryzyka i nie trać czasu
          </h2>
          <div className="grid gap-5 sm:grid-cols-3">
            {PAIN_STATS.map((p) => (
              <div
                key={p.stat}
                className="rounded-2xl border border-border bg-card p-7 text-center"
              >
                <div className="font-heading text-3xl font-extrabold text-brand">
                  {p.stat}
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{p.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Poglebienie problemu / agitacja */}
        <section className="mx-auto max-w-5xl px-5 py-12">
          <h2 className="mx-auto max-w-2xl text-center font-heading text-2xl font-bold tracking-tight">
            Potem może być tylko gorzej
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">
            Zły najemca to dopiero początek.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {AGITATE.map((a) => (
              <div
                key={a.title}
                className="rounded-2xl border border-border bg-card p-7"
              >
                <h3 className="font-heading text-lg font-semibold text-red-500">
                  {a.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{a.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Jak to dziala */}
        <section className="mx-auto max-w-5xl px-5 py-12">
          <h2 className="mb-10 text-center font-heading text-2xl font-bold tracking-tight">
            Jak zarobisz na wynajmie?
          </h2>
          <div className="grid gap-5 sm:grid-cols-3">
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

        {/* Co sprawdzamy */}
        <section className="mx-auto max-w-3xl px-5 py-12">
          <div className="rounded-3xl border border-border bg-card p-8 text-center sm:p-10">
            <h2 className="font-heading text-2xl font-bold tracking-tight">
              Koniec z przypadkowymi najemcami
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
              Sprawdzamy...
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              {CHECKS.map((c) => (
                <span
                  key={c}
                  className="rounded-full bg-brand-soft px-4 py-2 text-sm font-medium text-brand"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Cennik */}
        <section id="cennik" className="mx-auto max-w-5xl px-5 py-12 scroll-mt-20">
          <h2 className="mx-auto mb-3 max-w-2xl text-center font-heading text-2xl font-bold tracking-tight">
            Wynajmij bezpiecznie mieszkanie
          </h2>
          <p className="mx-auto mb-10 max-w-xl text-center text-muted-foreground">
            Nie znajdziemy Twojego wymarzonego najemcy? 100% zwrotu.
          </p>

          {/* W kazdym wariancie dostajesz to samo */}
          <div className="mx-auto mb-8 max-w-3xl rounded-3xl border border-border bg-card p-7 sm:p-9">
            <h3 className="text-center font-heading text-lg font-semibold">
              Otrzymasz od nas
            </h3>
            <ul className="mx-auto mt-6 grid max-w-xl gap-3 sm:grid-cols-2">
              {INCLUDED.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2.5 text-sm font-medium text-foreground"
                >
                  <svg
                    className="mt-0.5 h-5 w-5 shrink-0 text-brand"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 011.4-1.4l3.3 3.3 6.8-6.8a1 1 0 011.4 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* 3 warianty cenowe — rozni sie tylko termin */}
          <h3 className="mb-10 mt-20 text-center font-heading text-2xl font-bold tracking-tight">
            Jak szybko chcesz wynająć mieszkanie?
          </h3>
          <div className="grid items-stretch gap-5 sm:grid-cols-3">
            {PLANS.map((p) => (
              <div
                key={p.name}
                className={`relative flex flex-col items-center rounded-2xl border bg-card p-7 text-center ${
                  p.featured
                    ? "border-brand shadow-lg shadow-brand/10 sm:-mt-3 sm:pb-9"
                    : "border-border"
                }`}
              >
                {p.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white">
                    Najczęściej wybierany
                  </span>
                )}
                <div className="font-heading text-3xl font-extrabold">
                  {p.price}
                </div>
                <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">
                  {p.term}
                </div>
                <a
                  href={p.href}
                  className={`mt-7 inline-block w-full rounded-full px-6 py-3 text-center text-sm font-semibold transition-opacity hover:opacity-90 ${
                    p.featured
                      ? "bg-primary text-primary-foreground"
                      : "bg-brand-soft text-brand"
                  }`}
                >
                  {p.cta}
                </a>
              </div>
            ))}
          </div>

        </section>

        {/* Gwarancja */}
        <section className="mx-auto max-w-3xl px-5 py-12">
          <div className="rounded-3xl border border-brand/20 bg-brand-soft p-8 text-center sm:p-12">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-brand">
              Gwarancja zwrotu 100%
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
              Jeśli nie znajdziemy najemcy w ustalonym terminie, oddajemy 100%
              opłaty.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-2xl px-5 py-12">
          <h2 className="mb-8 text-center font-heading text-2xl font-bold tracking-tight">
            Najczęstsze pytania
          </h2>
          <FaqAccordion items={FAQ} />
          <div className="mt-10 text-center">
            <Link
              href="/login?mode=signup"
              className="inline-block rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Ok! Zaczynamy!
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
