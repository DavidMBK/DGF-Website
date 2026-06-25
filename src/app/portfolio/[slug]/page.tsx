import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Reveal } from "@/components/ui/Reveal";
import { Tag } from "@/components/ui/Tag";
import { CTAButton } from "@/components/ui/CTAButton";
import { CaseStudyCard } from "@/components/portfolio/CaseStudyCard";
import { getAllCaseStudies, getCaseStudy, getRelatedCaseStudies } from "@/lib/case-studies";
import { absoluteUrl } from "@/lib/seo";

// Export statico: tutte le rotte vengono prerese a build time da questi slug.
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllCaseStudies().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  const path = `/portfolio/${study.slug}`;
  return {
    title: `${study.title} — Case study`,
    description: study.summary,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      title: `${study.title} | DGF Tech Solutions`,
      description: study.summary,
      url: path,
      images: [{ url: study.imageFull, width: 1920, height: 1200, alt: `Progetto ${study.client}` }],
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  const related = getRelatedCaseStudies(slug, 2);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: study.title,
    headline: study.title,
    abstract: study.summary,
    about: study.category,
    dateCreated: study.year,
    image: absoluteUrl(study.imageFull),
    url: absoluteUrl(`/portfolio/${study.slug}`),
    creator: {
      "@type": "Organization",
      name: "DGF Tech Solutions",
      url: absoluteUrl("/"),
    },
    keywords: [...study.services, ...study.stack].join(", "),
  };

  return (
    <>
      <Nav />
      <main id="main" tabIndex={-1}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Hero */}
        <header data-nav-theme="light" className="relative overflow-hidden bg-canvas-soft pb-12 pt-28 sm:pt-36">
          <div className="relative mx-auto max-w-[1180px] px-6">
            <Breadcrumbs
              items={[
                { name: "Home", path: "/" },
                { name: "Portfolio", path: "/portfolio" },
                { name: study.client },
              ]}
            />
            <Reveal>
              <div className="flex flex-wrap items-center gap-3 font-mono text-[12px] uppercase tracking-[0.2em] text-brand-blue">
                <span>{study.category}</span>
                <span aria-hidden className="text-hairline">·</span>
                <span className="text-body">{study.year}</span>
                <span aria-hidden className="text-hairline">·</span>
                <span className="text-body">{study.siteLabel}</span>
              </div>
              <h1 className="display-xl mt-5 max-w-[20ch] text-ink">
                {study.title}
              </h1>
              <p className="mt-6 max-w-[58ch] text-[17px] leading-[1.65] text-body">{study.summary}</p>
              <div className="mt-7 flex flex-wrap gap-2">
                {study.services.map((s) => (
                  <Tag key={s}>{s}</Tag>
                ))}
              </div>
            </Reveal>
          </div>
        </header>

        {/* Immagine */}
        <div className="relative bg-gradient-to-b from-canvas-soft to-canvas">
          <div className="mx-auto max-w-[1180px] px-6">
            <Reveal className="overflow-hidden rounded-[1.75rem] bg-white p-1.5 ring-1 ring-brand-blue/10 shadow-[0_40px_90px_-50px_rgba(10,40,80,0.45)]">
              <Image
                src={study.imageFull}
                alt={`Schermata del progetto ${study.client}`}
                width={1920}
                height={1200}
                className="w-full rounded-[1.375rem]"
                priority
              />
            </Reveal>
          </div>
        </div>

        {/* Metriche */}
        <section className="bg-canvas py-14 sm:py-20" aria-label="Risultati">
          <div className="mx-auto max-w-[1180px] px-6">
            <Reveal>
              <div className="grid grid-cols-1 divide-y divide-hairline rounded-[1.5rem] bg-canvas-soft ring-1 ring-brand-blue/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                {study.metrics.map((m) => (
                  <div key={m.label} className="px-8 py-9 text-center">
                    <div className="font-display text-[clamp(2.2rem,5vw,3.2rem)] font-semibold tracking-[-0.02em] text-brand-navy">
                      {m.value}
                    </div>
                    <div className="mt-2 text-[13.5px] leading-snug text-body">{m.label}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* Narrazione */}
        <section className="bg-canvas pb-8" aria-label="Il progetto">
          <div className="mx-auto grid max-w-[1180px] grid-cols-1 gap-12 px-6 lg:grid-cols-[1fr_0.9fr] lg:gap-20">
            <div className="space-y-12">
              <Reveal as="section">
                <h2 className="font-mono text-[12px] uppercase tracking-[0.28em] text-brand-blue">La sfida</h2>
                <p className="mt-4 text-[17px] leading-[1.7] text-ink-soft">{study.challenge}</p>
              </Reveal>
              <Reveal as="section">
                <h2 className="font-mono text-[12px] uppercase tracking-[0.28em] text-brand-blue">L&apos;approccio</h2>
                <ul className="mt-5 space-y-4">
                  {study.approach.map((step, i) => (
                    <li key={i} className="flex gap-4">
                      <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-brand-blue/10 font-mono text-[12px] font-semibold text-brand-blue">
                        {i + 1}
                      </span>
                      <span className="text-[16px] leading-[1.6] text-body">{step}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal as="section">
                <h2 className="font-mono text-[12px] uppercase tracking-[0.28em] text-brand-blue">La soluzione</h2>
                <p className="mt-4 text-[17px] leading-[1.7] text-ink-soft">{study.solution}</p>
              </Reveal>
            </div>

            {/* Aside: stack */}
            <Reveal as="aside" className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-[1.5rem] bg-canvas-soft p-7 ring-1 ring-brand-blue/10">
                <h2 className="font-mono text-[12px] uppercase tracking-[0.28em] text-brand-blue">Stack &amp; competenze</h2>
                <div className="mt-5 flex flex-wrap gap-2">
                  {study.stack.map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </div>
                <div className="mt-6 border-t border-hairline pt-6">
                  <div className="font-mono text-[12px] uppercase tracking-[0.28em] text-brand-blue">Servizi</div>
                  <ul className="mt-3 space-y-1.5 text-[15px] text-body">
                    {study.services.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Quote */}
        {study.quote && (
          <section className="bg-canvas py-16 sm:py-20" aria-label="Testimonianza">
            <div className="mx-auto max-w-[920px] px-6">
              <Reveal>
                <figure className="rounded-[1.75rem] border-l-2 border-brand-blue/40 bg-canvas-soft px-8 py-10 sm:px-12">
                  <blockquote className="font-display text-[clamp(1.4rem,3vw,2rem)] font-medium leading-[1.4] tracking-[-0.01em] text-ink">
                    “{study.quote.text}”
                  </blockquote>
                  <figcaption className="mt-6 text-[14px] text-body">
                    <span className="font-semibold text-ink-soft">{study.quote.author}</span>
                    {" — "}
                    {study.quote.role}
                  </figcaption>
                </figure>
              </Reveal>
            </div>
          </section>
        )}

        {/* Correlati */}
        {related.length > 0 && (
          <section data-nav-theme="light" className="bg-canvas-soft py-16 sm:py-24" aria-label="Progetti correlati">
            <div className="mx-auto max-w-[1180px] px-6">
              <h2 className="heading-md text-ink">
                Altri progetti
              </h2>
              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
                {related.map((r, i) => (
                  <Reveal key={r.slug} delay={i * 0.06}>
                    <CaseStudyCard study={r} />
                  </Reveal>
                ))}
              </div>
              <div className="mt-12">
                <CTAButton href="/#contatti">Hai un progetto simile? Parliamone</CTAButton>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
