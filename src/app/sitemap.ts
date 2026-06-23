import type { MetadataRoute } from "next";

// Richiesto da output: "export" — genera il file in modo statico a build time.
export const dynamic = "force-static";

// Genera /sitemap.xml durante la build. Il sito è una one-page, quindi c'è
// un solo URL canonico (l'apex, senza www).
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://dgftechsolutions.com/",
      // lastmod = data di build (ogni deploy aggiorna il segnale di freschezza,
      // l'unico campo che i crawler usano davvero; priority/changefreq sono
      // in gran parte ignorati da Google).
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
