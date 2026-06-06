"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { SiteNav } from "@/components/site-nav";
import { ListingCard } from "@/components/listing-card";
import { OwnerProperties } from "@/components/owner-properties";
import { SAMPLE_LISTINGS } from "@/lib/listings";

type Role = "wynajmujacy" | "najemca" | null;

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const [role, setRole] = useState<Role>(null);

  useEffect(() => {
    if (!loading && !user && typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }, [loading, user]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        Ładowanie...
      </div>
    );
  }

  return (
    <>
      <SiteNav />
      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold tracking-tight">
              Twój panel
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
          </div>
          <button
            onClick={signOut}
            className="rounded-full border border-border px-4 py-2 text-sm transition-colors hover:bg-accent"
          >
            Wyloguj
          </button>
        </div>

        {/* Wybor roli */}
        {role === null && (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <button
              onClick={() => setRole("wynajmujacy")}
              className="rounded-2xl border border-border bg-card p-6 text-left transition-shadow hover:shadow-md"
            >
              <h2 className="font-heading text-lg font-semibold">
                Wynajmuję mieszkanie
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Dodaj swoje mieszkania i znajdź najemcę.
              </p>
              <span className="mt-4 inline-block text-sm font-medium text-brand">
                Przejdź →
              </span>
            </button>
            <button
              onClick={() => setRole("najemca")}
              className="rounded-2xl border border-border bg-card p-6 text-left transition-shadow hover:shadow-md"
            >
              <h2 className="font-heading text-lg font-semibold">
                Szukam mieszkania
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Zapisz ulubione i zobacz dopasowanie do Twoich kryteriów.
              </p>
              <span className="mt-4 inline-block text-sm font-medium text-brand">
                Przejdź →
              </span>
            </button>
          </div>
        )}

        {/* Wynajmujacy: dodawanie mieszkan */}
        {role === "wynajmujacy" && (
          <div className="mt-8">
            <BackButton onBack={() => setRole(null)} />
            <div className="mt-4">
              <OwnerProperties />
            </div>
          </div>
        )}

        {/* Najemca: ulubione + scoring */}
        {role === "najemca" && (
          <div className="mt-8">
            <BackButton onBack={() => setRole(null)} />
            <h2 className="mt-4 font-heading text-xl font-bold">
              Dopasowane dla Ciebie
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Procent pokazuje, jak mocno mieszkanie pasuje do Twoich kryteriów.
            </p>
            <div className="mt-5 flex flex-col gap-5">
              {SAMPLE_LISTINGS.map((listing) => (
                <ListingCard key={listing.id} listing={listing} showMatch />
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  );
}

function BackButton({ onBack }: { onBack: () => void }) {
  return (
    <button
      onClick={onBack}
      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      ← Wróć
    </button>
  );
}
