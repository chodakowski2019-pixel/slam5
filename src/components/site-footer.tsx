import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-10 sm:flex-row">
        <Link href="/" className="flex items-center gap-2 font-heading text-lg font-light tracking-tight">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/lokra-mark.png" alt="" className="h-7 w-auto" />
          Lokra
        </Link>
        <div className="flex flex-col items-center gap-3 sm:items-end">
          <nav className="flex gap-5 text-xs text-muted-foreground">
            <Link href="/regulamin" className="hover:text-foreground">
              Regulamin
            </Link>
            <Link
              href="/polityka-prywatnosci"
              className="hover:text-foreground"
            >
              Polityka prywatności
            </Link>
          </nav>
          <p className="text-xs text-muted-foreground">
            © 2020 Lokra. Wszystkie prawa zastrzeżone.
          </p>
        </div>
      </div>
    </footer>
  );
}
