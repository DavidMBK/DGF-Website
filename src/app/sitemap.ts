import type { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/seo";
import { getAllCaseStudies } from "@/lib/case-studies";
import { getAllArticles } from "@/lib/blog";

// Richiesto da output: "export" — genera il file in modo statico a build time.
export const dynamic = "force-static";

// Gli URL hanno lo slash finale per combaciare con trailingSlash:true e con i
// canonical generati da Next.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE_URL}/portfolio/`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/chi-siamo/`, lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    { url: `${BASE_URL}/blog/`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
  ];

  for (const c of getAllCaseStudies()) {
    entries.push({
      url: `${BASE_URL}/portfolio/${c.slug}/`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.6,
    });
  }

  for (const a of getAllArticles()) {
    entries.push({
      url: `${BASE_URL}/blog/${a.slug}/`,
      lastModified: new Date(a.date),
      changeFrequency: "yearly",
      priority: 0.6,
    });
  }

  return entries;
}
