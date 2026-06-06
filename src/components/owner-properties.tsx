"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { formatPrice } from "@/lib/listings";

type Property = {
  id: string;
  title: string;
  city: string;
  district: string | null;
  rooms: number | null;
  area: number | null;
  price: number | null;
  available_from: string | null;
  status: string;
};

const EMPTY = {
  title: "",
  city: "",
  district: "",
  rooms: "",
  area: "",
  price: "",
  available_from: "",
  description: "",
};

export function OwnerProperties() {
  const { user } = useAuth();
  const [items, setItems] = useState<Property[]>([]);
  const [form, setForm] = useState({ ...EMPTY });
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("properties")
      .select("id,title,city,district,rooms,area,price,available_from,status")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false });
    if (!error && data) setItems(data as Property[]);
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setError(null);
    const { error } = await supabase.from("properties").insert({
      owner_id: user.id,
      title: form.title.trim(),
      city: form.city.trim(),
      district: form.district.trim() || null,
      rooms: form.rooms ? Number(form.rooms) : null,
      area: form.area ? Number(form.area) : null,
      price: form.price ? Number(form.price) : null,
      available_from: form.available_from.trim() || null,
      description: form.description.trim() || null,
    });
    setSaving(false);
    if (error) {
      setError(error.message);
      return;
    }
    setForm({ ...EMPTY });
    setShowForm(false);
    load();
  };

  const inputCls =
    "w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-brand";

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-xl font-bold">Twoje mieszkania</h2>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          {showForm ? "Zamknij" : "+ Dodaj mieszkanie"}
        </button>
      </div>

      {/* Formularz */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-5 grid gap-3 rounded-2xl border border-border bg-card p-5 sm:grid-cols-2"
        >
          <input className={inputCls + " sm:col-span-2"} placeholder="Tytuł (np. Jasne 2 pokoje z balkonem)" value={form.title} onChange={(e) => set("title", e.target.value)} required />
          <input className={inputCls} placeholder="Miasto" value={form.city} onChange={(e) => set("city", e.target.value)} required />
          <input className={inputCls} placeholder="Dzielnica" value={form.district} onChange={(e) => set("district", e.target.value)} />
          <input className={inputCls} type="number" placeholder="Liczba pokoi" value={form.rooms} onChange={(e) => set("rooms", e.target.value)} />
          <input className={inputCls} type="number" placeholder="Metraż (m²)" value={form.area} onChange={(e) => set("area", e.target.value)} />
          <input className={inputCls} type="number" placeholder="Czynsz (zł/mc)" value={form.price} onChange={(e) => set("price", e.target.value)} />
          <input className={inputCls} placeholder="Dostępne od (np. Od zaraz)" value={form.available_from} onChange={(e) => set("available_from", e.target.value)} />
          <textarea className={inputCls + " sm:col-span-2"} placeholder="Opis (opcjonalnie)" rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} />
          {error && <p className="text-sm text-red-500 sm:col-span-2">{error}</p>}
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50 sm:col-span-2"
          >
            {saving ? "Zapisuję..." : "Zapisz mieszkanie"}
          </button>
        </form>
      )}

      {/* Lista */}
      <div className="mt-5">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
            Nie masz jeszcze dodanych mieszkań. Kliknij „+ Dodaj mieszkanie".
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {items.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-2xl border border-border bg-card p-4"
              >
                <div>
                  <h3 className="font-heading font-semibold">{p.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {p.city}
                    {p.district ? `, ${p.district}` : ""} ·{" "}
                    {p.rooms ? `${p.rooms} pok · ` : ""}
                    {p.area ? `${p.area} m² · ` : ""}
                    {p.price ? formatPrice(p.price) : "cena do ustalenia"}
                  </p>
                </div>
                <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-medium text-brand">
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
