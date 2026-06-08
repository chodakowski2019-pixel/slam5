"use client";

import { useEffect, useState } from "react";

// Web3Forms — darmowy klucz publiczny (web3forms.com).
// Stworz klucz na adres chodakowski2019@gmail.com, wklej tutaj:
const ACCESS_KEY = "9e5b5116-b976-4684-b47b-2ca4590fef65";

type Status = "idle" | "sending" | "ok" | "error";

export function ContactModal() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

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
      <button
        onClick={() => {
          setOpen(true);
          setStatus("idle");
        }}
        className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        Kontakt
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto p-4"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-10 my-auto max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl border border-border bg-card p-6 shadow-xl sm:p-8">
            <button
              onClick={() => setOpen(false)}
              aria-label="Zamknij"
              className="absolute right-5 top-5 text-2xl leading-none text-muted-foreground transition-colors hover:text-foreground"
            >
              &times;
            </button>

            {status === "ok" ? (
              <div className="py-6 text-center">
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
                <h2 className="font-heading text-xl font-bold tracking-tight">
                  Dzięki! Odezwiemy się wkrótce.
                </h2>
                <button
                  onClick={() => setOpen(false)}
                  className="mt-6 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Zamknij
                </button>
              </div>
            ) : (
              <>
                <h2 className="font-heading text-xl font-bold tracking-tight">
                  Napisz do nas
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Zostaw kontakt, odezwiemy się i znajdziemy Ci najemcę.
                </p>
                <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3">
                  <input
                    name="name"
                    required
                    placeholder="Imię *"
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-brand"
                  />
                  <input
                    name="phone"
                    type="tel"
                    required
                    placeholder="Numer telefonu *"
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-brand"
                  />
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="Email *"
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-brand"
                  />
                  <textarea
                    name="message"
                    required
                    rows={4}
                    placeholder="Twoje pytanie *"
                    className="w-full resize-none rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-brand"
                  />
                  {status === "error" && (
                    <p className="text-sm text-red-500">
                      Coś poszło nie tak. Spróbuj jeszcze raz.
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="mt-1 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
                  >
                    {status === "sending" ? "Wysyłanie..." : "Wyślij"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
