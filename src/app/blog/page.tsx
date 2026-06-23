import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { getAllArticles } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — guide e idee su web, software e AI",
  description:
    "Guide pratiche e riflessioni su siti web, e-commerce, software su misura e intelligenza artificiale, dal team di DGF Tech Solutions.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog | DGF Tech Solutions",
    description:
      "Guide pratiche e riflessioni su siti web, e-commerce, software su misura e AI.",
    url: "/blog",
  },
};

export default function BlogPage() {
  const articles = getAllArticles();

  return (
    <>
      <Nav />
      <main id="main" tabIndex={-1}>
        <PageHeader
          eyebrow="Blog"
          title="Idee chiare su web, software e AI"
          intro="Niente fuffa e niente termini oscuri: guide pratiche e riflessioni scritte per chi deve prendere decisioni sul proprio progetto digitale. Spieghiamo costi, scelte e trappole comuni con parole semplici, così arrivi preparato al confronto — anche se non sei del settore."
          breadcrumbs={[{ name: "Home", path: "/" }, { name: "Blog" }]}
        />

        <section className="bg-canvas py-16 sm:py-24" aria-label="Articoli">
          <div className="mx-auto max-w-[1180px] px-6">
            <Reveal className="mb-14 grid grid-cols-1 gap-6 border-b border-hairline pb-14 sm:grid-cols-3">
              {[
                {
                  t: "Guide pratiche",
                  d: "Cosa costa davvero un progetto, quanto tempo serve, come scegliere tra le opzioni: risposte chiare alle domande che ci fanno più spesso.",
                },
                {
                  t: "Strategia digitale",
                  d: "Quando serve un e-commerce e quando basta una vetrina, come farsi trovare su Google, dove conviene investire per primo.",
                },
                {
                  t: "Tecnologia spiegata semplice",
                  d: "Cos'è l'AI utile per la tua attività, perché la velocità di un sito conta, come riconoscere il software fatto bene.",
                },
              ].map((c) => (
                <div key={c.t}>
                  <h2 className="font-display text-[18px] font-semibold tracking-[-0.01em] text-ink">
                    {c.t}
                  </h2>
                  <p className="mt-2.5 text-[14.5px] leading-[1.6] text-body">{c.d}</p>
                </div>
              ))}
            </Reveal>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {articles.map((article, i) => (
                <Reveal key={article.slug} delay={i * 0.06}>
                  <ArticleCard article={article} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
