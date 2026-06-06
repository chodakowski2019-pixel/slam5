# Slam5 — Co musi robić audyt AI

**Status:** WIP (work in progress). Brainstorm rozpoczęty 2026-05-20.

## Funkcje audytu (5 punktów, 2 ustalone)

### 1. Zmapować procesy
[USER_001 do rozpisania: jaki zakres mapy? które działy? wywiad z founderem czy z zespołem? format outputu?]

### 2. Pokazać gdzie będzie jaki zwrot
[USER_001 do rozpisania: scoring ROI per proces? oszacowanie godzin/PLN/% oszczędności? horyzont 30/90/180 dni? jak prezentowane w raporcie?]

### 3. Wdrożenie agentów AI

Klient dostaje **zestaw agentów** (każdy klient ma kilku, nie jednego):

- **Agent „Pomysły"** — zbiera i porządkuje pomysły założyciela/zespołu (capture + struktura)
- **Agent Marketing** — content, kampanie, copy, analizy
- **Agent Sprzedaż** — leady, follow-upy, scripts, pipeline
- **Agent Produkt** — feedback klientów, roadmap, feature priorytety

[USER_001 do rozpisania:
- czy każdy klient dostaje wszystkie 4, czy wybiera?
- gotowe template'y per agent czy custom per klient?
- kto buduje (my czy partner techniczny)?
- czas wdrożenia całego zestawu?
- handover do klienta czy maintenance miesięczny?
- czy są kolejne agenty poza tymi 4 (support, finanse, ops)?]

### 4. [TODO — wymyślić]

### 5. [TODO — wymyślić]

---

## Cena
**$287 za jeden projekt** (set 2026-05-20)

## Cel sprzedażowy
**$287 × 50 = $14,350** (set 2026-05-20)

## Bezpieczeństwo danych (set 2026-05-20)

**Slam5 NIE zbiera danych klienta.**

- Dane są jedynie **przetwarzane** przez Anthropic (Claude API)
- Dane są **anonimizowane** przed wysłaniem
- Dane są **zabezpieczone na kilka sposobów** (do rozpisania: jakie warstwy konkretnie)

**Po co to:** firmy boją się że "AI ukradnie nasze dane". To główny blocker przy decyzji o wdrożeniu AI. Slam5 zdejmuje ten lęk od pierwszej rozmowy.

[USER_001 do rozpisania:
- jakie konkretnie warstwy zabezpieczeń (encryption in transit, encryption at rest, brak logów, no-training agreement z Anthropic, DPA)?
- jak działa anonimizacja (przed wysłaniem do API czy w warstwie pośredniej)?
- czy klient dostaje umowę / klauzulę pisemną?
- czy używamy Anthropic enterprise tier (zero data retention) czy standardowy API?]

## Notatki / pytania do siebie
- Czy audyt = software (agent AI sam robi) czy service (human + AI tool)?
- Co dokładnie dostaje klient za $287 (PDF, dashboard, live session, wdrożenie agenta)?
- Sprzedajemy audyt jako standalone czy jako lejek do większego wdrożenia?
- Próg rentowności: ile projektów/miesiąc daje sensowny revenue?

**Ostatnia edycja:** 2026-05-20
