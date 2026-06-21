import type { MetadataRoute } from "next";

// Richiesto da output: "export" — genera /robots.txt in modo statico a build time.
export const dynamic = "force-static";

// Tutti i crawler (inclusi quelli delle AI: GPTBot/ChatGPT, ClaudeBot,
// PerplexityBot, Google-Extended per Gemini & AI Overview, Bingbot per Copilot)
// possono leggere e CITARE il sito. Bloccato solo Bytespider, scraper aggressivo
// che non porta visibilità.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: "Bytespider", disallow: "/" },
    ],
    sitemap: "https://dgftechsolutions.com/sitemap.xml",
  };
}
