import Link from "next/link";
import { breadcrumbJsonLd, type Crumb } from "@/lib/seo";

/** Breadcrumb accessibile + dati strutturati BreadcrumbList (Schema.org). */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Percorso" className="mb-7">
      <ol className="flex flex-wrap items-center gap-2 font-mono text-[11.5px] uppercase tracking-[0.18em] text-body">
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${c.name}-${i}`} className="flex items-center gap-2">
              {c.path && !last ? (
                <Link href={c.path} className="transition-colors hover:text-brand-blue">
                  {c.name}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className="text-ink-soft">
                  {c.name}
                </span>
              )}
              {!last && (
                <span aria-hidden className="text-hairline">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(items)) }}
      />
    </nav>
  );
}
