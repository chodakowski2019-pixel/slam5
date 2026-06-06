import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

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
    desc: "Wrzucasz zdjęcia i podstawowe dane. Aplikacja prowadzi Cię krok po kroku do spaceru 360°.",
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
