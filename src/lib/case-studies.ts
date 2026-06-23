// Case study del portfolio. Dati tipizzati (niente CMS/MDX): type-safe e 100%
// compatibili con l'export statico. I visual riusano i mockup WebP già in
// /public/mockups. Contenuti placeholder realistici dove non ci sono dati reali.

export interface CaseStudyMetric {
  value: string;
  label: string;
}

export interface CaseStudy {
  slug: string;
  client: string;
  /** Titolo orientato al risultato (usato in pagina e nei meta). */
  title: string;
  category: string;
  year: string;
  /** Riassunto per card hub + meta description. */
  summary: string;
  /** demo/url mostrato come riferimento (fittizio). */
  siteLabel: string;
  image: string; // anteprima ~1000px
  imageFull: string; // alta risoluzione per l'hero del dettaglio
  services: string[];
  stack: string[];
  metrics: CaseStudyMetric[];
  challenge: string;
  approach: string[];
  solution: string;
  quote?: { text: string; author: string; role: string };
  featured?: boolean;
}

// NB: contenuti dimostrativi. Sostituire con dati di progetti reali quando disponibili.
export const CASE_STUDIES: readonly CaseStudy[] = [
  {
    slug: "erba-ecommerce-botanico",
    client: "Erba",
    title: "Un e-commerce botanico che converte la passione in vendite",
    category: "E-commerce",
    year: "2025",
    summary:
      "Negozio online per un vivaio urbano: catalogo curato, checkout in tre passi e schede prodotto che raccontano ogni pianta.",
    siteLabel: "erba.it",
    image: "/mockups/ecommerce.webp",
    imageFull: "/mockups/ecommerce-full.webp",
    services: ["E-commerce", "UI/UX Design", "Sviluppo"],
    stack: ["Next.js", "Stripe", "Sanity", "Tailwind CSS"],
    metrics: [
      { value: "+38%", label: "Tasso di conversione" },
      { value: "1,9 s", label: "Largest Contentful Paint" },
      { value: "−27%", label: "Carrelli abbandonati" },
    ],
    challenge:
      "Il vivaio vendeva solo in negozio e su un marketplace generico, con margini erosi dalle commissioni e nessun controllo sul brand. Serviva un canale diretto, veloce e riconoscibile.",
    approach: [
      "Analisi del catalogo e raggruppamento per esigenza (luce, cura, spazio) invece che per categoria botanica.",
      "Schede prodotto con guida alla cura e foto reali, per ridurre i resi.",
      "Checkout in tre passi con pagamento Stripe e spedizione calcolata in tempo reale.",
    ],
    solution:
      "Un e-commerce headless con catalogo gestito dal cliente in autonomia, pagine prodotto ottimizzate per la ricerca organica e un'esperienza d'acquisto fluida anche da mobile.",
    quote: {
      text: "In due mesi il sito è diventato il nostro primo canale di vendita. E lo aggiorniamo da soli, senza chiamare nessuno.",
      author: "Marta Speranza",
      role: "Titolare, Erba",
    },
    featured: true,
  },
  {
    slug: "saldo-gestionale-pmi",
    client: "Saldo",
    title: "Un gestionale su misura che sostituisce cinque fogli di calcolo",
    category: "Software gestionale",
    year: "2025",
    summary:
      "Piattaforma per la gestione di clienti, fatture e scadenze di una PMI di servizi: un'unica fonte di verità, accessibile ovunque.",
    siteLabel: "saldo.app",
    image: "/mockups/gestionale.webp",
    imageFull: "/mockups/gestionale-full.webp",
    services: ["Software su misura", "UI/UX Design", "Automazione"],
    stack: ["Next.js", "PostgreSQL", "Prisma", "tRPC"],
    metrics: [
      { value: "−6 h", label: "Lavoro manuale a settimana" },
      { value: "100%", label: "Scadenze tracciate" },
      { value: "3", label: "Strumenti dismessi" },
    ],
    challenge:
      "L'amministrazione viveva su fogli di calcolo scollegati: dati duplicati, scadenze perse e nessuna visione d'insieme. Ogni report era un lavoro manuale di ore.",
    approach: [
      "Mappatura dei processi reali insieme al team amministrativo.",
      "Modello dati unico per clienti, preventivi, fatture e pagamenti.",
      "Promemoria automatici sulle scadenze e dashboard di sintesi.",
    ],
    solution:
      "Un gestionale web responsivo con permessi per ruolo, ricerca istantanea e automazioni che eliminano la doppia digitazione. Tutto in un posto, accessibile dal browser.",
    quote: {
      text: "Abbiamo smesso di rincorrere le scadenze. Il lunedì mattina apro la dashboard e so esattamente cosa fare.",
      author: "Giacomo Lo Presti",
      role: "Responsabile amministrativo, Saldo",
    },
  },
  {
    slug: "dimora-portale-immobiliare",
    client: "Dimora",
    title: "Un portale immobiliare che mette in scena ogni proprietà",
    category: "Sito immobiliare",
    year: "2024",
    summary:
      "Vetrina immobiliare di alto profilo con ricerca avanzata, gallerie immersive e richieste di visita qualificate.",
    siteLabel: "dimora.it",
    image: "/mockups/immobiliare.webp",
    imageFull: "/mockups/immobiliare-full.webp",
    services: ["Sito web", "UI/UX Design", "SEO"],
    stack: ["Next.js", "MapLibre", "Tailwind CSS", "Vercel"],
    metrics: [
      { value: "×2,4", label: "Richieste di visita" },
      { value: "+61%", label: "Traffico organico" },
      { value: "4,2", label: "Pagine per sessione" },
    ],
    challenge:
      "Le proprietà di pregio venivano presentate come annunci anonimi su portali affollati, senza valorizzare location e dettagli. Le richieste erano poche e poco qualificate.",
    approach: [
      "Layout editoriale per ogni immobile, con gallerie a tutta pagina e mappa interattiva.",
      "Filtri di ricerca per zona, tipologia e fascia di prezzo.",
      "Form di richiesta visita con qualificazione del contatto.",
    ],
    solution:
      "Un portale veloce e curato, ottimizzato per la ricerca locale, dove ogni proprietà ha la sua pagina dedicata e indicizzabile. Più visite prenotate, contatti più caldi.",
    quote: {
      text: "Finalmente le case si vedono come meritano. I clienti arrivano già informati e davvero interessati.",
      author: "Elisa Currò",
      role: "Agente, Dimora",
    },
  },
  {
    slug: "sale-ristorante-prenotazioni",
    client: "Sale",
    title: "Un sito ristorante con prenotazioni che riempiono le serate",
    category: "Sito + prenotazioni",
    year: "2024",
    summary:
      "Sito per un ristorante d'autore con menù digitale, storytelling della cucina e prenotazione tavolo in pochi tap.",
    siteLabel: "sale-ristorante.it",
    image: "/mockups/ristorazione.webp",
    imageFull: "/mockups/ristorazione-full.webp",
    services: ["Sito web", "UI/UX Design", "Integrazioni"],
    stack: ["Next.js", "Framer Motion", "TheFork API", "Tailwind CSS"],
    metrics: [
      { value: "+44%", label: "Prenotazioni online" },
      { value: "−18%", label: "Telefonate gestite" },
      { value: "92", label: "Punteggio Lighthouse" },
    ],
    challenge:
      "Le prenotazioni passavano tutte dal telefono, spesso negli orari di servizio. Il vecchio sito non comunicava l'identità della cucina e non era usabile da mobile.",
    approach: [
      "Racconto visivo della cucina e dello chef, con fotografia in primo piano.",
      "Menù digitale sempre aggiornato dal ristorante.",
      "Prenotazione tavolo integrata, completabile in meno di un minuto.",
    ],
    solution:
      "Un sito immersivo e veloce che trasmette l'esperienza del ristorante e sposta le prenotazioni online, liberando la sala dalle telefonate nei momenti di punta.",
    quote: {
      text: "Il telefono squilla molto meno e la sala è più piena. Il sito lavora per noi anche quando siamo chiusi.",
      author: "Davide Mancuso",
      role: "Chef patron, Sale",
    },
  },
];

export function getAllCaseStudies(): readonly CaseStudy[] {
  return CASE_STUDIES;
}

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((c) => c.slug === slug);
}

/** Restituisce fino a `n` case study diversi da `slug` (per la sezione "Correlati"). */
export function getRelatedCaseStudies(slug: string, n = 2): CaseStudy[] {
  return CASE_STUDIES.filter((c) => c.slug !== slug).slice(0, n);
}
