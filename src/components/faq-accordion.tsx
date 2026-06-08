"use client";

import { useState } from "react";

type Item = {
  q: string;
  a: string;
  link?: { label: string; href: string };
};

export function FaqAccordion({ items }: { items: Item[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-4">
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <div
            key={f.q}
            className="rounded-2xl border border-border bg-card"
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 p-6 text-left"
            >
              <h3 className="font-heading font-semibold">{f.q}</h3>
              <svg
                className={`h-5 w-5 shrink-0 text-brand transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.3 7.3a1 1 0 011.4 0L10 10.6l3.3-3.3a1 1 0 111.4 1.4l-4 4a1 1 0 01-1.4 0l-4-4a1 1 0 010-1.4z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {isOpen && (
              <p className="px-6 pb-6 text-sm text-muted-foreground">
                {f.a}
                {f.link && (
                  <a
                    href={f.link.href}
                    className="font-semibold text-brand underline underline-offset-2"
                  >
                    {f.link.label}
                  </a>
                )}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
