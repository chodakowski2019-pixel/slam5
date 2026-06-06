"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

const EMPTY = {
  full_name: "",
  contact: "",
  city: "",
  district: "",
  budget_max: "",
  rooms_min: "",
  move_in: "",
  duration: "",
  notes: "",
};

export function TenantLeadForm() {
  const [form, setForm] = useState({ ...EMPTY });
  const [pets, setPets] = useState(false);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const { error } = await supabase.from("tenant_leads").insert({
      full_name: form.full_name.trim() || null,
      contact: form.contact.trim(),
      city: form.city.trim(),
      district: form.district.trim() || null,
      budget_max: form.budget_max ? Number(form.budget_max) : null,
      rooms_min: form.rooms_min ? Number(form.rooms_min) : null,
      move_in: form.move_in.trim() || null,
      duration: form.duration.trim() || null,
      pets,
      notes: form.notes.trim() || null,
      source: "formularz",
    });
    setSaving(false);
    if (error) {
      setError(error.message);
      return;
    }
    setDone(true);
  };

  const inputCls =
    "w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-brand";

  if (done) {
    return (
      <div className="rounded-3xl border border-brand/20 bg-brand-soft p-8 text-center">
        <h3 className="font-heading text-xl font-bold text-brand">
          Dzięki! Szukamy dla Ciebie mieszkania.
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Odezwiemy się, gdy znajdziemy dopasowane oferty.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-3 rounded-3xl border border-border bg-card p-6 sm:grid-cols-2 sm:p-8"
    >
      <h3 className="font-heading text-xl font-bold sm:col-span-2">
        Powiedz nam, czego szukasz
      </h3>
      <input className={inputCls} placeholder="Imię" value={form.full_name} onChange={(e) => set("full_name", e.target.value)} />
      <input className={inputCls} placeholder="Email lub telefon" value={form.contact} onChange={(e) => set("contact", e.target.value)} required />
      <input className={inputCls} placeholder="Miasto" value={form.city} onChange={(e) => set("city", e.target.value)} required />
      <input className={inputCls} placeholder="Dzielnica (opcjonalnie)" value={form.district} onChange={(e) => set("district", e.target.value)} />
      <input className={inputCls} type="number" placeholder="Budżet maks. (zł/mc)" value={form.budget_max} onChange={(e) => set("budget_max", e.target.value)} />
      <input className={inputCls} type="number" placeholder="Min. liczba pokoi" value={form.rooms_min} onChange={(e) => set("rooms_min", e.target.value)} />
      <input className={inputCls} placeholder="Od kiedy (np. od lipca)" value={form.move_in} onChange={(e) => set("move_in", e.target.value)} />
      <input className={inputCls} placeholder="Na jak długo (np. rok)" value={form.duration} onChange={(e) => set("duration", e.target.value)} />
      <label className="flex items-center gap-2 text-sm text-muted-foreground sm:col-span-2">
        <input type="checkbox" checked={pets} onChange={(e) => setPets(e.target.checked)} className="h-4 w-4 accent-[#06b6d4]" />
        Mam zwierzę
      </label>
      <textarea className={inputCls + " sm:col-span-2"} rows={3} placeholder="Co jest dla Ciebie najważniejsze? (opcjonalnie)" value={form.notes} onChange={(e) => set("notes", e.target.value)} />
      {error && <p className="text-sm text-red-500 sm:col-span-2">{error}</p>}
      <button
        type="submit"
        disabled={saving}
        className="rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50 sm:col-span-2"
      >
        {saving ? "Wysyłam..." : "Szukajcie dla mnie mieszkania"}
      </button>
    </form>
  );
}
