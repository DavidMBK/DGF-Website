// Helper SEO centralizzati. metadataBase è definito in layout.tsx; qui teniamo
// la sorgente unica dell'URL/brand e i costruttori di dati strutturati.
export const BASE_URL = "https://dgftechsolutions.com";
export const SITE_NAME = "DGF Tech Solutions";

/** Trasforma un path relativo in URL assoluto (per JSON-LD e openGraph). */
export function absoluteUrl(path: string): string {
  return new URL(path, BASE_URL).toString();
}

export interface Crumb {
  name: string;
  /** path relativo (es. "/portfolio"); assente sull'ultimo elemento (pagina corrente). */
  path?: string;
}

/** BreadcrumbList Schema.org (>= 2 item, con position/name; item richiesto tranne l'ultimo). */
export function breadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      ...(c.path ? { item: absoluteUrl(c.path) } : {}),
    })),
  };
}
