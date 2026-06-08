import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="bg-neutral-900 text-neutral-100">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-5 py-10 sm:flex-row sm:justify-between">
        <Link
          href="/"
          className="font-heading text-xl font-light tracking-tight text-white"
        >
          Lokra
        </Link>
        <nav className="flex items-center gap-6 text-sm text-neutral-300">
          <Link href="/regulamin" className="transition-colors hover:text-white">
            Regulamin
          </Link>
          <Link
            href="/polityka-prywatnosci"
            className="transition-colors hover:text-white"
          >
            Polityka prywatności
          </Link>
        </nav>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-5 py-5 text-center text-xs text-neutral-400 sm:text-left">
          © 2020 Lokra. Wszystkie prawa zastrzeżone.
        </p>
      </div>
    </footer>
  );
}
