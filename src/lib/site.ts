// Link di navigazione principali (usati da Nav). Le ancore "/#..." puntano a
// sezioni della home (funzionano sia da home che da altre pagine via next/link);
// i path "/..." sono pagine vere. I metadati del sito (nome, url, descrizione)
// vivono in src/app/layout.tsx, unica fonte.
export const navLinks = [
  { label: "Servizi", href: "/#servizi" },
  { label: "Come lavoriamo", href: "/#processo" },
  { label: "Chi siamo", href: "/chi-siamo" },
] as const;
