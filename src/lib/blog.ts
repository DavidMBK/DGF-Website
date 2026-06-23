// Articoli del blog. Contenuto strutturato in blocchi tipizzati: niente CMS/MDX
// (100% compatibile con l'export statico), facile da estendere. MDX è un upgrade
// opzionale futuro. I contenuti sono redazionali e orientati alla SEO.

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "quote"; text: string };

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  /** ISO date (per <time> e datefield JSON-LD). */
  date: string;
  /** Etichetta leggibile in italiano. */
  dateLabel: string;
  readingTime: string;
  category: string;
  author: string;
  body: Block[];
}

export const ARTICLES: readonly Article[] = [
  {
    slug: "quanto-costa-un-sito-web-professionale",
    title: "Quanto costa davvero un sito web professionale nel 2026",
    excerpt:
      "Dalla vetrina di una pagina all'e-commerce su misura: cosa determina il prezzo di un sito e come capire se un preventivo è onesto.",
    date: "2026-05-12",
    dateLabel: "12 maggio 2026",
    readingTime: "6 min",
    category: "Guide",
    author: "DGF Tech Solutions",
    body: [
      {
        type: "p",
        text: "“Quanto costa un sito?” è la domanda che ci sentiamo fare più spesso. La risposta onesta è: dipende — ma non è una scappatoia. Il prezzo riflette scelte precise, e capire quali ti permette di leggere qualsiasi preventivo con occhi diversi.",
      },
      { type: "h2", text: "Cosa determina il prezzo" },
      {
        type: "p",
        text: "Un sito non è un prodotto a scaffale: è un progetto. Tre fattori spostano il costo più di ogni altro.",
      },
      {
        type: "ul",
        items: [
          "La complessità funzionale: una vetrina informativa è una cosa, un e-commerce con pagamenti e magazzino è un'altra.",
          "I contenuti: testi, foto e struttura. Averli pronti accorcia i tempi; produrli da zero è lavoro aggiuntivo.",
          "Il livello di personalizzazione del design: un tema preconfezionato costa meno di un'identità costruita su misura.",
        ],
      },
      { type: "h2", text: "Le fasce realistiche" },
      {
        type: "p",
        text: "Un sito vetrina curato parte da poche migliaia di euro; un e-commerce o un gestionale su misura cresce con le funzionalità. Diffida sia dei prezzi stracciati (di solito sono temi rivenduti senza assistenza) sia di quelli gonfiati senza una motivazione chiara.",
      },
      {
        type: "quote",
        text: "Un buon preventivo non ti dice solo quanto, ma soprattutto perché. Se non riesci a capire cosa stai pagando, manca trasparenza.",
      },
      { type: "h2", text: "Le domande da fare prima di firmare" },
      {
        type: "ul",
        items: [
          "Il sito sarà mio, codice e dominio inclusi?",
          "Posso aggiornare i contenuti da solo o dipendo da voi per ogni modifica?",
          "Cosa succede dopo il lancio: c'è assistenza, e a quali condizioni?",
        ],
      },
      {
        type: "p",
        text: "Noi mettiamo tempi, costi e scelte tecniche nero su bianco prima di iniziare. Se hai un progetto in mente, scrivici: ti diamo una stima chiara senza impegno.",
      },
    ],
  },
  {
    slug: "sito-vetrina-o-ecommerce-come-scegliere",
    title: "Sito vetrina o e-commerce: come scegliere senza sbagliare",
    excerpt:
      "Vendere online non è sempre la scelta giusta da subito. Una guida pratica per capire da dove partire in base al tuo business.",
    date: "2026-03-04",
    dateLabel: "4 marzo 2026",
    readingTime: "5 min",
    category: "Strategia",
    author: "DGF Tech Solutions",
    body: [
      {
        type: "p",
        text: "Molte attività ci chiedono direttamente un e-commerce, convinte che “vendere online” sia sempre il passo giusto. A volte lo è. Spesso, però, conviene partire da una vetrina solida e costruire le vendite per gradi.",
      },
      { type: "h2", text: "Quando basta una vetrina" },
      {
        type: "p",
        text: "Se il tuo obiettivo è farti trovare, comunicare chi sei e raccogliere contatti o prenotazioni, un sito vetrina ben fatto fa esattamente questo — con costi e gestione molto più leggeri di un negozio online.",
      },
      {
        type: "ul",
        items: [
          "Servizi su misura o consulenze, dove il preventivo nasce dal contatto.",
          "Ristoranti, studi, attività locali che puntano su prenotazioni e visibilità.",
          "Brand che devono prima costruire fiducia e pubblico.",
        ],
      },
      { type: "h2", text: "Quando serve l'e-commerce" },
      {
        type: "ul",
        items: [
          "Hai un catalogo di prodotti standardizzati pronti alla spedizione.",
          "Vuoi vendere 24/7 senza passare dal contatto diretto.",
          "Hai (o stai costruendo) un pubblico che cerca attivamente di acquistare.",
        ],
      },
      {
        type: "quote",
        text: "La domanda giusta non è “vetrina o e-commerce”, ma “qual è il prossimo passo che porta più valore al mio business, adesso”.",
      },
      { type: "h2", text: "La strada intelligente: partire scalabili" },
      {
        type: "p",
        text: "Il bello è che non devi rifare tutto da capo quando crescerai. Costruendo il sito su basi solide, aggiungere il carrello in un secondo momento diventa un'estensione, non una ripartenza. È così che lavoriamo: prima il passo che conta oggi, ma con un occhio a domani.",
      },
    ],
  },
];

export function getAllArticles(): readonly Article[] {
  // Ordine cronologico inverso (più recenti prima).
  return [...ARTICLES].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}
