"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ListingCard } from "@/components/listing-card";
import { SAMPLE_LISTINGS, type Listing } from "@/lib/listings";

const DEFAULT_IMG =
  "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=1200&q=80";

type DbProperty = {
  id: string;
  title: string;
  city: string;
  district: string | null;
  rooms: number | null;
  area: number | null;
  price: number | null;
  available_from: string | null;
  image_url: string | null;
  has_tour: boolean | null;
};

function toListing(p: DbProperty): Listing {
  return {
    id: p.id,
    title: p.title,
    city: p.city,
    district: p.district ?? "",
    rooms: p.rooms ?? 0,
    area: p.area ?? 0,
    price: p.price ?? 0,
    availableFrom: p.available_from ?? "Od zaraz",
    image: p.image_url || DEFAULT_IMG,
    tags: p.has_tour ? ["Spacer 360°"] : [],
    matchScore: 0,
    hasTour: !!p.has_tour,
  };
}

export function ListingsFeed() {
  const [listings, setListings] = useState<Listing[]>(SAMPLE_LISTINGS);
  const [isSample, setIsSample] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("properties")
        .select(
          "id,title,city,district,rooms,area,price,available_from,image_url,has_tour"
        )
        .eq("status", "aktywne")
        .order("created_at", { ascending: false });
      if (!error && data && data.length > 0) {
        setListings((data as DbProperty[]).map(toListing));
        setIsSample(false);
      }
    })();
  }, []);

  return (
    <section className="mx-auto max-w-3xl px-5 py-12">
      <div className="mb-6 flex items-end justify-between">
        <h2 className="font-heading text-2xl font-bold tracking-tight">
          Dostępne mieszkania
        </h2>
        <span className="text-sm text-muted-foreground">
          {listings.length} {listings.length === 1 ? "oferta" : "ofert"}
        </span>
      </div>

      <div className="flex flex-col gap-5">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>

      {isSample && (
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Przykładowe oferty. Wkrótce prawdziwe mieszkania od wynajmujących.
        </p>
      )}
    </section>
  );
}
