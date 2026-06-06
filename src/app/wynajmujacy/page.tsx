import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

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
    stat: "100%",
    label: "właścicieli boi się, że trafi na niepłacącego najemcę",
  },
  {
    stat: "3 mies.",
    label: "tyle średnio szukasz najemcy, gdy robisz to sam",
  },
  {
    stat: "9 000 zł",
    label: "średnia strata na jednym problematycznym najemcy",
  },
];

const STEPS = [
  {
    n: "1",
    title: "Dodajesz mieszkanie",
    desc: "Wrzucasz zdjęcia i podstawowe dane. Aplikacja prowadzi Cię krok po kroku, zajmuje to kilka minut.",
  },
  {
    n: "2",
    title: "My szukamy i sprawdzamy",
    desc: "Dopasowujemy najemcę dokładnie pod Twoje kryteria i weryfikujemy go, zanim do Ciebie trafi.",
  },
  {
    n: "3",
    title: "Najemca ogląda online",
    desc: "Bez umawiania pokazów i czekania na nikogo. Zainteresowani oglądają mieszkanie zdalnie.",
  },
  {
    n: "4",
    title: "Podpisujesz umowę",
    desc: "Łączymy Cię z gotowym, sprawdzonym najemcą. Nie znajdziemy w terminie? Zwracamy 100% opłaty.",
  },
];

const PLANS = [
  {
    name: "Basic",
    price: "2000 zł",
    term: "Gwarancja 90 dni albo zwrot",
    features: [
      "Wystawienie i dopasowanie najemców z bazy",
      "Oglądanie online (nagrywasz telefonem)",
      "Wzór umowy najmu",
    ],
    featured: false,
  },
  {
    name: "Standard",
    price: "4000 zł",
    term: "Gwarancja 60 dni albo zwrot",
    features: [
      "Wszystko z Basic",
      "Weryfikacja najemcy (wypłacalność, historia)",
      "Szybszy gwarantowany termin",
    ],
    featured: true,
  },
  {
    name: "Premium",
    price: "6000 zł",
    term: "Gwarancja 30 dni albo zwrot",
    features: [
      "Wszystko ze Standard",
      "Pełna obsługa do podpisania umowy",
      "Dedykowany opiekun",
      "3 miesiące zarządzania najmem gratis",
    ],
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
    a: "Płacisz z góry jeden pakiet, przy wystawieniu mieszkania. Jeśli nie znajdziemy najemcy w gwarantowanym terminie, oddajemy całą kwotę.",
  },
  {
    q: "Co jeśli nie znajdziecie najemcy?",
    a: "Dostajesz zwrot 100%. Gwarancja obowiązuje przy cenie rynkowej i jeśli nie odrzucasz dopasowanych najemców.",
  },
  {
    q: "Czy muszę robić pokazy mieszkania?",
    a: "Nie. Najemcy oglądają mieszkanie online, ze spacerem 360°. Ograniczamy fizyczne pokazy do minimum, oszczędzasz czas i dojazdy.",
  },
  {
    q: "Pierwszy raz wynajmuję, dam radę?",
    a: "Tak. Prowadzimy Cię za rękę: dodanie mieszkania, oglądanie online, dopasowanie najemcy. Najem to nasza robota, Ty masz mieć spokój.",
  },
];

export default function WynajmujacyPage() {
  return (
    <>
      <SiteNav />
      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-4xl px-5 pb-12 pt-16 text-center sm:pt-24">
          <span className="inline-block rounded-full bg-brand-soft px-4 py-1.5 text-sm font-medium text-brand">
            Dla wynajmujących
          </span>
          <h1 className="mx-auto mt-6 max-w-2xl font-heading text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
            Znajdziemy Ci sprawdzonego najemcę. Albo zwracamy pieniądze.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
            Ty wystawiasz, my szukamy i weryfikujemy najemcę dopasowanego do
            Twoich wymagań. Bez pokazów, bez stresu, bez straconego czasu.
          </p>
          <Link
            href="/login?mode=signup"
            className="mt-9 inline-block rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Wystaw mieszkanie
          </Link>

          {/* Social proof (PLACEHOLDER) */}
          <div className="mt-10 flex justify-center">
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
                1 247 mieszkań wynajętych w tym miesiącu
              </span>
            </div>
          </div>

          {/* Odznaki zaufania */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {TRUST.map((t) => (
              <span
                key={t}
                className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
              >
                <svg
                  className="h-4 w-4 text-brand"
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
                {t}
              </span>
            ))}
          </div>
        </section>

        {/* Problem / bol */}
        <section className="mx-auto max-w-5xl px-5 py-12">
          <h2 className="mx-auto mb-3 max-w-2xl text-center font-heading text-2xl font-bold tracking-tight">
            Wynajem sam z siebie to ryzyko i stracony czas
          </h2>
          <p className="mx-auto mb-10 max-w-xl text-center text-muted-foreground">
            Dlatego zdejmujemy to z Ciebie i bierzemy ryzyko na siebie.
          </p>
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

        {/* Co sprawdzamy */}
        <section className="mx-auto max-w-3xl px-5 py-12">
          <div className="rounded-3xl border border-border bg-card p-8 text-center sm:p-10">
            <h2 className="font-heading text-2xl font-bold tracking-tight">
              Każdego najemcę sprawdzamy zanim do Ciebie trafi
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
              Koniec z wybieraniem na oko. Dostajesz osobę z konkretami, nie
              obietnicami.
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
        <section className="mx-auto max-w-5xl px-5 py-12">
          <h2 className="mx-auto mb-3 max-w-2xl text-center font-heading text-2xl font-bold tracking-tight">
            Wybierz pakiet
          </h2>
          <p className="mx-auto mb-10 max-w-xl text-center text-muted-foreground">
            Płacisz z góry. Nie znajdziemy najemcy w terminie? Oddajemy 100%.
          </p>
          <div className="grid items-start gap-5 sm:grid-cols-3">
            {PLANS.map((p) => (
              <div
                key={p.name}
                className={`relative flex flex-col rounded-2xl border bg-card p-7 ${
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
                <h3 className="font-heading text-lg font-semibold">{p.name}</h3>
                <div className="mt-2 font-heading text-3xl font-extrabold">
                  {p.price}
                </div>
                <div className="mt-1 text-xs font-medium text-brand">
                  {p.term}
                </div>
                <ul className="mt-5 flex flex-1 flex-col gap-2.5">
                  {p.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <svg
                        className="mt-0.5 h-4 w-4 shrink-0 text-brand"
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
                <Link
                  href="/login?mode=signup"
                  className={`mt-7 inline-block rounded-full px-6 py-3 text-center text-sm font-semibold transition-opacity hover:opacity-90 ${
                    p.featured
                      ? "bg-primary text-primary-foreground"
                      : "bg-brand-soft text-brand"
                  }`}
                >
                  Wybieram {p.name}
                </Link>
              </div>
            ))}
          </div>

          {/* Dodatek 360 */}
          <div className="mx-auto mt-6 flex max-w-2xl flex-col items-center gap-2 rounded-2xl border border-dashed border-border bg-card px-6 py-5 text-center sm:flex-row sm:justify-between sm:text-left">
            <div>
              <div className="font-heading text-sm font-semibold">
                Profesjonalny spacer 360°
              </div>
              <p className="text-sm text-muted-foreground">
                Przyjeżdżamy i robimy wirtualny spacer za Ciebie. Dodatek do
                dowolnego pakietu.
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-brand-soft px-4 py-2 text-sm font-semibold text-brand">
              +1000 zł
            </span>
          </div>
        </section>

        {/* Gwarancja */}
        <section className="mx-auto max-w-3xl px-5 py-12">
          <div className="rounded-3xl border border-brand/20 bg-brand-soft p-8 text-center sm:p-12">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-brand">
              Gwarancja zwrotu
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
              Jeśli nie znajdziemy najemcy w ustalonym terminie, oddajemy 100%
              opłaty. Zero ryzyka po Twojej stronie.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-2xl px-5 py-12">
          <h2 className="mb-8 text-center font-heading text-2xl font-bold tracking-tight">
            Najczęstsze pytania
          </h2>
          <div className="flex flex-col gap-4">
            {FAQ.map((f) => (
              <div
                key={f.q}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <h3 className="font-heading font-semibold">{f.q}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/login?mode=signup"
              className="inline-block rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Zacznij teraz
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
