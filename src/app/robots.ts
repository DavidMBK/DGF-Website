import type { MetadataRoute } from "next";

// Richiesto da output: "export" — genera il file in modo statico a build time.
export const dynamic = "force-static";

// Genera /robots.txt durante la build.
// Nessun blocco: tutti i crawler — inclusi quelli delle AI (GPTBot/ChatGPT,
// PerplexityBot, ClaudeBot, Google-Extended per Gemini & AI Overview, Bingbot
// per Copilot) — sono autorizzati a leggere e quindi a CITARE il sito.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: "https://dgftechsolutions.com/sitemap.xml",
  };
}
