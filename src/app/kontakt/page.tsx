"use client";

import { useState } from "react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

// Web3Forms — klucz publiczny, maile leca na chodakowski2019@gmail.com
const ACCESS_KEY = "9e5b5116-b976-4684-b47b-2ca4590fef65";

type Status = "idle" | "sending" | "ok" | "error";

export default function KontaktPage() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const fd = new FormData(form);
    fd.append("access_key", ACCESS_KEY);
    fd.append("subject", "Nowe zapytanie z Lokra");
    fd.append("from_name", "Lokra — formularz kontaktowy");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: fd,
      });
      const json = await res.json();
      if (json.success) {
        setStatus("ok");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <SiteNav />
      <main className="flex-1">
        <section className="mx-auto max-w-md px-5 py-16 sm:py-24">
          {status === "ok" ? (
            <div className="rounded-3xl border border-border bg-card p-8 text-center sm:p-10">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft">
                <svg
                  className="h-6 w-6 text-brand"
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
              </div>
              <h1 className="font-heading text-2xl font-bold tracking-tight">
                Dzięki! Odezwiemy się wkrótce.
              </h1>
              <p className="mt-3 text-sm text-muted-foreground">
                Twoje zgłoszenie do nas dotarło. Skontaktujemy się z Tobą jak
                najszybciej.
              </p>
            </div>
          ) : (
            <>
              <h1 className="font-heading text-3xl font-extrabold tracking-tight">
                Napisz do nas
              </h1>
              <p className="mt-2 text-muted-foreground">
                Zostaw kontakt, odezwiemy się i znajdziemy Ci najemcę.
              </p>
              <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3">
                <input
                  name="name"
                  required
                  placeholder="Imię *"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-brand"
                />
                <input
                  name="phone"
                  type="tel"
                  required
                  placeholder="Numer telefonu *"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-brand"
                />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="Email *"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-brand"
                />
                <textarea
                  name="message"
                  required
                  rows={5}
                  placeholder="Twoje pytanie *"
                  className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-brand"
                />
                {status === "error" && (
                  <p className="text-sm text-red-500">
                    Coś poszło nie tak. Spróbuj jeszcze raz.
                  </p>
                )}
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="mt-1 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
                >
                  {status === "sending" ? "Wysyłanie..." : "Wyślij"}
                </button>
              </form>
            </>
          )}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
