import type { Listing } from "@/lib/listings";
import { formatPrice } from "@/lib/listings";

export function ListingCard({
  listing,
  showMatch = false,
}: {
  listing: Listing;
  showMatch?: boolean;
}) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.18)] sm:flex-row">
      {/* Zdjecie */}
      <div className="relative h-52 w-full shrink-0 overflow-hidden bg-muted sm:h-auto sm:w-72">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={listing.image}
          alt={`${listing.title}, ${listing.city}`}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {listing.hasTour && (
          <span className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-xs font-medium text-foreground backdrop-blur">
            Spacer 360°
          </span>
        )}
        {showMatch && (
          <span className="absolute right-3 top-3 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white">
            Dopasowanie {listing.matchScore}%
          </span>
        )}
      </div>

      {/* Tresc */}
      <div className="flex flex-1 flex-col justify-between gap-4 p-5">
        <div>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-heading text-lg font-semibold leading-tight">
                {listing.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {listing.city}, {listing.district}
              </p>
            </div>
            <p className="whitespace-nowrap font-heading text-lg font-bold text-brand">
              {formatPrice(listing.price)}
            </p>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {listing.tags.map((t) => (
              <span
                key={t}
                className="rounded-full bg-brand-soft px-3 py-1 text-xs font-medium text-brand"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border pt-4 text-sm text-muted-foreground">
          <span>
            {listing.rooms} {listing.rooms === 1 ? "pokój" : "pokoje"} · {listing.area} m² · {listing.availableFrom}
          </span>
          <span className="font-medium text-foreground transition-colors group-hover:text-brand">
            Zobacz →
          </span>
        </div>
      </div>
    </article>
  );
}
