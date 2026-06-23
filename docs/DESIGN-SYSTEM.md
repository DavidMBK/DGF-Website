# Design System — DGF Tech Solutions

Riferimento dei pattern di design del sito. Ogni componente segue un pattern **studiato e verificato**, non improvvisato. Le regole vincolanti derivano da fonti primarie: W3C ARIA Authoring Practices (APG), W3C WCAG 2.2, Nielsen Norman Group (NN/g), IBM Carbon, US Web Design System (USWDS), Refactoring UI.

## 1. Fondamenta (token)

I token vivono in `src/app/globals.css` (`@theme`) e in `src/lib/seo.ts`. Principio (USWDS / W3C Design Tokens): **palette curata e limitata**, mai valori ad-hoc.

**Colore (brand + neutri):**
- `--color-brand-navy #054b77` · `--color-brand-blue #1575a4` · `--color-brand-cyan #3d9cc7`
- `--color-ink #0a1f33` · `--color-ink-soft #1f3a55` · `--color-body #5a6b7d`
- `--color-hairline #d6dde5` · `--color-canvas-soft #f4f7fa` · `--color-canvas #ffffff`

**Spaziatura — scala 4/8pt** (Carbon + USWDS, verificato 3-0): si usa la scala Tailwind (base 4px) con step su multipli di 4/8 (`gap-6`=24, `py-16`=64, `py-24`=96, `py-28`=112…). Niente valori arbitrari di spaziatura fuori scala.

**Tipografia — scala modulare** (Refactoring UI, verificato): display `font-display` (Space Grotesk) con `clamp()` per le headline; body 16–20px con `line-height` 1.5–1.7 (WCAG 1.4.12). Gerarchia costruita su **peso + contrasto + de-enfasi**, non solo dimensione (NN/g, verificato 3-0). Max ~3–4 livelli.

**Easing/motion token:** `--ease-expo: cubic-bezier(0.22,1,0.36,1)`. Motion solo `transform`/`opacity`, sempre con `purposeful restraint` (NN/g): mai decorativo, rispetta `prefers-reduced-motion`.

## 2. Pattern per componente

| Componente | Pattern | Regole chiave (verificate) | Accessibilità |
|---|---|---|---|
| **Servizi** | **Tabs** | Tabs = poche sezioni lunghe (NN/g). 6 servizi con contenuto ricco → tabs corretto. | `role=tablist/tab/tabpanel`, `aria-selected`, `aria-controls`, `aria-labelledby`, roving `tabindex`, frecce + Home/End con wrap (W3C APG). |
| **FAQ** | **Accordion** | Accordion = molte voci brevi (NN/g). Intera domanda cliccabile; **mai** auto-chiusura. | `<details>/<summary>` nativi (button + stato expanded impliciti). |
| **Breadcrumb** | Lista ordinata di link ai genitori, prima del contenuto | (W3C APG, NN/g) | `<nav><ol>`, ultimo elemento `aria-current="page"` + JSON-LD BreadcrumbList. |
| **Card** (case study, valori, articoli) | Double-bezel (guscio + core), griglia 1→2/3 col | Niente 3 card uguali rigide → 2 col / bento / zig-zag | Link/area cliccabile ampia; hover su `transform`. |
| **Hero** | Value prop + sub-headline <20 parole + CTA primaria/secondaria + prova vicino | Outcome-first, no buzzword (ricerca agenzie) | h1 unico, contrasto AA. |
| **Galleria/Portfolio** | Griglia + lightbox | — | Lightbox `role=dialog` + focus-trap + ripristino focus; equivalente da tastiera al ventaglio 3D. |
| **Metriche/Numeri** | Banda a 3 celle, numeri grandi | Solo dati **reali** (dati falsi minano la credibilità) | `<dl>` dove semantico. |
| **Tecnologie/Stack** | Gruppi etichettati di chip | Onesto, raggruppato per area | lista. |
| **Navigazione** | Nav fissa, link reali (`next/link`) | Ancore `/#…` cross-pagina | `role=banner`, focus visibile, target ≥24px. |
| **Footer** | Colonne (Esplora/Servizi/Studio) + brand | Link reali | nav landmark per gruppo. |
| **Form contatto** | Label sopra l'input, validazione client | Web3Forms (static export) | label associate, stati error. |

## 3. Stati interattivi

Ogni elemento interattivo definisce: **default · hover · focus-visible · active · (loading/empty dove serve)**.
- `:focus-visible` globale ad alto contrasto (`globals.css`), cyan su fondi scuri.
- `active`: `scale-[0.98]` / `-translate-y-[1px]` (feedback tattile).
- CTA: micro-fisica button-in-button.

## 4. WCAG 2.2 (AA) — vincoli trasversali

- **2.5.8 Target Size**: target puntatore ≥ **24×24px**.
- **2.4.11 Focus Not Obscured**: il focus da tastiera non deve finire sotto la nav fissa (`scroll-padding-top` impostato).
- Contrasto testo ≥ 4.5:1 (verificato su footer, form, tagline).

## 5. Cosa NON adottare (sfatato dalla ricerca)

- FAQ: controllo "Espandi tutto" **non** obbligatorio; nessun requisito di fallback senza-JavaScript.
- Niente metriche/loghi/testimonianze inventate.
- Niente caroselli hero rotanti; niente motion decorativo su ogni hover/scroll.

## 6. Limiti della ricerca (onestà)

Le fonti primarie coprono con certezza: ARIA dei pattern, WCAG 2.2, token, scala 4/8pt, scala tipografica, gerarchia. Le **regole di layout visivo specifiche** per hero/card/gallery/metriche/ecc. non hanno fonti primarie verificate: lì si applicano gli standard di design premium (coerenza, whitespace, double-bezel) come scelta motivata, non come legge.
