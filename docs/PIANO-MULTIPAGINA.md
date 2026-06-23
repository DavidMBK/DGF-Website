# Piano: da one-page a sito multipagina premium

> Metodo per DGF Tech Solutions. Stack: Next.js 15 App Router, `output: "export"` (statico, GitHub Pages + dominio custom), Tailwind v4, framer-motion. Brand navy `#054b77` / blue `#1575a4` / cyan `#3d9cc7`. Ricerca tecnica verificata su fonti primarie (Next.js docs, Google Search Central).

## 1. Architettura informativa

Con l'App Router le cartelle definiscono gli URL. Mappa delle rotte:

```
/                      Home (one-page esistente)
/portfolio             Hub progetti
/portfolio/[slug]      Dettaglio case study   (statica via generateStaticParams)
/chi-siamo             Studio, valori, team
/blog                  Hub articoli
/blog/[slug]           Articolo               (statica via generateStaticParams)
```

URL: minuscole + trattini, mai underscore (GitHub Pages è case-sensitive). Pagine entro 3-4 click dalla home. Niente soglie di lunghezza URL o pillar-cluster (miti smentiti dalla ricerca).

## 2. Vincoli static export (governano tutto)

`output: "export"` disabilita: ISR, Server Actions, Route Handler con Request, cookies, redirects/headers, middleware, image optimization on-the-fly. Quindi:
- Form contatto → client-side (Web3Forms, già conforme).
- Rotte dinamiche → `generateStaticParams()` enumera tutti gli slug a build time + `export const dynamicParams = false`.
- Next 15: `params` è una `Promise` → `await params`.
- Immagini → pre-ottimizzate WebP (pipeline sharp già in repo); `next/image` resta utile per CLS + lazy-load anche con `images.unoptimized`.

## 3. Content layer

- **Portfolio/Case study**: dati TypeScript tipizzati (`src/lib/case-studies.ts`), come `SERVICES`/`MOCKUPS`. Type-safe, zero dipendenze.
- **Blog**: contenuto strutturato tipizzato (`src/lib/blog.ts`) con blocchi (paragrafi, heading, liste, quote). MDX è un upgrade opzionale futuro (`@next/mdx` + `gray-matter`).

## 4. SEO per-pagina

- `metadata` statico sulle pagine semplici, `generateMetadata` async sulle dinamiche (title/description/openGraph/canonical unici, cotti nell'HTML).
- `alternates.canonical` (richiede `metadataBase`, già presente).
- JSON-LD: `BreadcrumbList` (≥2 item) su tutte le dinamiche, `CreativeWork` sui case study, `BlogPosting` sugli articoli, `Organization` globale.
- Sitemap multi-URL via `app/sitemap.ts`. Internal linking hub→dettaglio + correlati.

## 5. Design system premium (evoluzione del brand)

- Token semantici in `globals.css @theme`; tipografia Space Grotesk display + scala fluida `clamp()`; spacing `py-24→py-40`.
- Componenti condivisi: `SectionHeading` (eyebrow + h2), `Card` double-bezel, `CTAButton` button-in-button, `Breadcrumbs`, `PageHeader`, `Tag`, `MetricStat`, `ArticleCard`, `CaseStudyCard`, `TeamCard`.
- Layout asimmetrici/bento (no 3 card uguali). Motion solo `transform`/`opacity`, reveal `whileInView`.
- Performance: `next/font` self-hosted, immagini WebP pre-ottimizzate, niente animazioni di layout.

## 6. Roadmap a fasi

- **Fase 0** — Fondamenta: token, componenti condivisi, helper SEO, Nav multipagina.
- **Fase 1** — Portfolio: dati + hub + dettaglio + metadata + JSON-LD.
- **Fase 2** — Chi siamo / Team.
- **Fase 3** — Blog: dati + hub + articolo + BlogPosting.
- **Fase 4** — Sitemap multi-URL, breadcrumb, internal linking, footer, audit.

## Note

Struttura interna delle case study (problema-soluzione-risultato-metriche) = best practice di settore, non verificata su fonti primarie. Il core tecnico è invece da documentazione ufficiale (Next.js, Google).
