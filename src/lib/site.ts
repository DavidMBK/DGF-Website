export const site = {
  name: "DGF Tech Solutions",
  shortName: "DGF",
  tagline:
    "Software house a Messina. Sviluppo, design e AI, dall'idea al lancio.",
  description:
    "Software house a Messina, attiva in tutta Italia: siti web, e-commerce, app, software su misura e soluzioni AI, con chi scrive il codice al tuo fianco.",
  url: "https://dgftechsolutions.com",
} as const;

export const navLinks = [
  { label: "Servizi", href: "#servizi" },
  { label: "Processo", href: "#processo" },
] as const;

export const subNavLinks = [
  { label: "AI", cardId: "svc-ai" },
  { label: "Software", cardId: "svc-software" },
  { label: "E-commerce", cardId: "svc-ecommerce" },
  { label: "UI / UX", cardId: "svc-uiux" },
  { label: "Consulenza", cardId: "svc-consulenza" },
] as const;
