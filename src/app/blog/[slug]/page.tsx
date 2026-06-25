import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Reveal } from "@/components/ui/Reveal";
import { CTAButton } from "@/components/ui/CTAButton";
import { ArticleBody } from "@/components/blog/ArticleBody";
import { getAllArticles, getArticle } from "@/lib/blog";
import { absoluteUrl, SITE_NAME } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  const path = `/blog/${article.slug}`;
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      title: `${article.title} | ${SITE_NAME}`,
      description: article.excerpt,
      url: path,
      publishedTime: article.date,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const path = `/blog/${article.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    dateModified: article.date,
    articleSection: article.category,
    inLanguage: "it-IT",
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(path) },
    author: { "@type": "Organization", name: SITE_NAME, url: absoluteUrl("/") },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/logo-dgf-trasparente.png"),
      },
    },
  };

  return (
    <>
      <Nav />
      <main id="main" tabIndex={-1}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <article>
          <header data-nav-theme="light" className="relative overflow-hidden bg-canvas-soft pb-12 pt-28 sm:pt-36">
            <div className="relative mx-auto max-w-[760px] px-6">
              <Breadcrumbs
                items={[
                  { name: "Home", path: "/" },
                  { name: "Blog", path: "/blog" },
                  { name: article.category },
                ]}
              />
              <Reveal>
                <div className="flex flex-wrap items-center gap-3 font-mono text-[12px] uppercase tracking-[0.2em] text-brand-blue">
                  <span>{article.category}</span>
                  <span aria-hidden className="text-hairline">·</span>
                  <time dateTime={article.date} className="text-body">
                    {article.dateLabel}
                  </time>
                  <span aria-hidden className="text-hairline">·</span>
                  <span className="text-body">{article.readingTime} di lettura</span>
                </div>
                <h1 className="heading-lg mt-5 text-ink">
                  {article.title}
                </h1>
                <p className="mt-5 text-[18px] leading-[1.6] text-body">{article.excerpt}</p>
              </Reveal>
            </div>
          </header>

          <div className="bg-canvas py-14 sm:py-20">
            <div className="mx-auto max-w-[760px] px-6">
              <Reveal>
                <ArticleBody blocks={article.body} />
              </Reveal>

              <Reveal className="mt-16 flex flex-col items-start gap-5 rounded-[1.75rem] bg-canvas-soft p-8 ring-1 ring-brand-blue/10 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="heading-md text-ink">
                    Hai un progetto in mente?
                  </h2>
                  <p className="mt-2 text-[15px] leading-[1.6] text-body">
                    Ti rispondiamo noi, di persona, entro 24 ore.
                  </p>
                </div>
                <CTAButton href="/#contatti">Parliamone</CTAButton>
              </Reveal>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
