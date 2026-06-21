import type { MetadataRoute } from "next";

// Richiesto da output: "export" — genera il file in modo statico a build time.
export const dynamic = "force-static";

// Genera /sitemap.xml durante la build. Il sito è una one-page, quindi c'è
// un solo URL canonico (l'apex, senza www).
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://dgftechsolutions.com/",
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
