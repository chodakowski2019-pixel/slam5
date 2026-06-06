# Slam5 — Email Templates

**Standard:** `master-template.html` — wzorzec dla WSZYSTKICH maili Slam5.

## Zasady
- Każdy nowy mail = duplikat `master-template.html`, podmienione tylko treści
- BEZ zmian w strukturze (header, footer, divider, CTA button style)
- Kolory: czarny `#1d1d1f`, szary `#86868b`, niebieski link `#0066cc`, tło `#f5f5f7`
- Fonty: SF Pro Display / SF Pro Text (Apple system stack)
- Mobile-first responsive (media query @ 600px)

## Sekcje do podmiany per mail
1. **Preheader** (hidden) — 1 linia preview
2. **Top bar** — `Wydanie #XXX · DD miesiąca YYYY`
3. **Hero** — eyebrow + h1 + lead + CTA
4. **Hero image placeholder** — opcjonalnie podmienić na `<img src>`
5. **3 artykuły** — kategoria + h3 + lead + link
6. **Pull quote** — cytat tygodnia
7. **Bonus CTA** — sekcja audytu / oferty
8. **Footer** — bez zmian (brand block fix)
