import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-10 sm:flex-row">
        <Link href="/" className="font-heading text-lg font-extrabold tracking-tight">
          Slam<span className="text-brand">5</span>
        </Link>
        <div className="flex gap-6 text-sm text-muted-foreground">
          <Link href="/wynajmujacy" className="hover:text-foreground">
            Dla wynajmujących
          </Link>
          <Link href="/najemca" className="hover:text-foreground">
            Dla najemców
          </Link>
          <Link href="/login" className="hover:text-foreground">
            Zaloguj
          </Link>
        </div>
        <p className="text-xs text-muted-foreground">
          © 2026 Slam5. Wszystkie prawa zastrzeżone.
        </p>
      </div>
    </footer>
  );
}
