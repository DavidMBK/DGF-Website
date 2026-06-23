import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { CTAButton } from "@/components/ui/CTAButton";
import { CaseStudyCard } from "@/components/portfolio/CaseStudyCard";
import { getAllCaseStudies } from "@/lib/case-studies";

export const metadata: Metadata = {
  title: "Portfolio — progetti e case study",
  description:
    "Una selezione di progetti DGF Tech Solutions: e-commerce, gestionali su misura, siti web e portali. Problema, approccio e risultati concreti.",
  alternates: { canonical: "/portfolio" },
  openGraph: {
    title: "Portfolio — progetti e case study | DGF Tech Solutions",
    description:
      "Una selezione di progetti: e-commerce, gestionali, siti web e portali. Problema, approccio e risultati concreti.",
    url: "/portfolio",
  },
};

export default function PortfolioPage() {
  const studies = getAllCaseStudies();

  return (
    <>
      <Nav />
      <main id="main" tabIndex={-1}>
        <PageHeader
          eyebrow="Portfolio"
          title="Progetti che hanno fatto la differenza"
          intro="Ogni progetto parte da un problema concreto e si misura su risultati concreti: più vendite, meno lavoro manuale, un'esperienza più veloce. Qui trovi una selezione di lavori che raccontano, caso per caso, come trasformiamo un'esigenza in un prodotto digitale che funziona."
          breadcrumbs={[{ name: "Home", path: "/" }, { name: "Portfolio" }]}
        />

        <section
          data-nav-theme="light"
          className="relative bg-canvas py-16 sm:py-24"
          aria-label="Elenco progetti"
        >
          <div className="mx-auto max-w-[1180px] px-6">
            <Reveal className="mb-12 grid grid-cols-1 gap-px overflow-hidden rounded-[1.5rem] bg-hairline/60 ring-1 ring-brand-blue/10 sm:mb-16 sm:grid-cols-3">
              {[
                { n: "01", t: "Il problema", d: "Partiamo dall'obiettivo di business, non dalla tecnologia. Capiamo cosa frena il cliente prima di scrivere una riga." },
                { n: "02", t: "L'approccio", d: "Scelte tecniche motivate, cicli brevi e aggiornamenti continui. Vedi il progetto crescere passo dopo passo." },
                { n: "03", t: "I risultati", d: "Numeri concreti dopo il lancio: più conversioni, meno lavoro manuale, tempi di caricamento dimezzati." },
              ].map((s) => (
                <div key={s.n} className="bg-canvas px-7 py-8">
                  <span className="font-mono text-[13px] font-semibold text-brand-blue/70">{s.n}</span>
                  <h2 className="mt-3 font-display text-[19px] font-semibold tracking-[-0.01em] text-ink">{s.t}</h2>
                  <p className="mt-2 text-[14.5px] leading-[1.6] text-body">{s.d}</p>
                </div>
              ))}
            </Reveal>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {studies.map((study, i) => (
                <Reveal key={study.slug} delay={i * 0.06} className={study.featured ? "sm:col-span-2" : ""}>
                  <CaseStudyCard study={study} featured={study.featured} />
                </Reveal>
              ))}
            </div>

            <Reveal className="mt-16 flex flex-col items-start gap-5 rounded-[1.75rem] bg-canvas-soft p-8 ring-1 ring-brand-blue/10 sm:flex-row sm:items-center sm:justify-between sm:p-10">
              <div>
                <h2 className="font-display text-[clamp(1.5rem,3vw,2.1rem)] font-semibold tracking-[-0.02em] text-ink">
                  Il prossimo caso potrebbe essere il tuo
                </h2>
                <p className="mt-2 max-w-[52ch] text-[15px] leading-[1.6] text-body">
                  Raccontaci il progetto in due righe: ti rispondiamo noi, di persona.
                </p>
              </div>
              <CTAButton href="/#contatti">Parliamone</CTAButton>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
