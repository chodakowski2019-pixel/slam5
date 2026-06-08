import Link from "next/link";

export function SiteNav({ homeLink = false }: { homeLink?: boolean }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/lokra-mark.png" alt="Lokra" className="h-9 w-auto" />
        </Link>

        <Link
          href={homeLink ? "/" : "/#cennik"}
          className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          {homeLink ? "Strona główna" : "Zaczynamy"}
        </Link>
      </nav>
    </header>
  );
}
