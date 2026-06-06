# Slam5 — Page Templates

**Standard:** `master-layout.html` — wzorzec dla WSZYSTKICH stron LP Slam5.

Źródło: design handoff z Claude Design (2026-05-19), wariant A "2026 modern", zatwierdzony przez USER_001 2026-05-20.

## Zasady

- Każda nowa strona LP = duplikat `master-layout.html`, podmienione tylko treści
- BEZ zmian w strukturze, tokenach kolorów, typografii, spacing
- BEZ italic w nagłówkach (h1/h2/h3) — akcent przez bold/kolor
- BEZ em-dashy w treści

## Design tokens (z `:root`)

- `--ink: #0a0a0c` — główny czarny
- `--ink-2: #1d1d1f` — secondary czarny
- `--mute: #86868b` — szary tekst
- `--bg: #ffffff` — białe tło
- `--bg-2: #f6f6f8` — soft sekcje
- `--accent: #1f8a5b` — leśna zieleń (zatwierdzona 2026-05-20, NIE niebieski)
- `--accent-soft: #e8f3ed`
- `--radius-card: 24px`
- `--radius-pill: 980px`

## Typografia

- Stack: SF Pro Display / SF Pro Text (Apple system fonts)
- h1 hero: 64px desktop / 38px mobile
- h2: 48px desktop / 32px mobile
- letter-spacing: -0.025em na nagłówkach, -0.011em na body

## Struktura sekcji (kolejność z master layout)

1. **Nav** — sticky, blurred, logo + menu + CTA pill
2. **Hero** — eyebrow + h1 + lead + form newsletter + mockup po prawej (lekko obrócony, prostuje się na hover)
3. **Stats strip** — 4 metryki z thin separators
4. **Bento "Co znajdziesz"** — 6 kart w nieregularnej siatce, 1 duża dark z monospace code blockiem
5. **Issues "Ostatnie wydania"** — 3 karty z numerami, hover-arrow
6. **Problem "Dla kogo"** — center head + grid problem cards
7. **Author** — Jakub w gradient kółku + 2 paragrafy bio (sekcja `soft`)
8. **FAQ** — accordion plus → x animation
9. **Final CTA** — ciemna karta z radial glow, zaokrąglona, na białym tle
10. **Footer**

## Sekcje do podmiany per strona

- **Hero h1 + lead** — value prop dla danego produktu
- **Newsletter form action** — endpoint Mailchimp/Brevo/ConvertKit
- **Stats** — realne liczby (czytelnicy, wydania, czas, open rate)
- **Bento copy** — 6 kart z featurami
- **Issues** — 3 ostatnie wydania (tytuły + daty)
- **Problem list** — pain pointy ICP
- **Author bio** — Jakub Chodakowski (zostaje stały dla wszystkich Slam5)
- **FAQ** — pytania per strona
- **Final CTA copy**

## Animacje (zachować, nie wycinać)

- `pulse` na `.eyebrow .dot` — 2s ease-out infinite
- Hero mockup rotate / hover prostuje się i unosi
- FAQ accordion ikona plus → x
- Issues card hover arrow translate

## Mobile

- Breakpoint główny: 900px (grid → kolumna)
- Breakpoint mały: 600px (mniejsza typografia)
- Hero mockup ukrywa się lub idzie pod tekst na mobile
