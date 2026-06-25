import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Article } from "@/lib/blog";

/** Card articolo per l'hub del blog e i correlati. */
export function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group flex h-full flex-col rounded-[1.5rem] bg-white p-7 ring-1 ring-brand-blue/10 transition-all duration-500 ease-out-soft hover:-translate-y-1 hover:ring-brand-blue/25 sm:p-8"
    >
      <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-brand-blue">
        <span>{article.category}</span>
        <span aria-hidden className="text-hairline">·</span>
        <time dateTime={article.date} className="text-body">
          {article.dateLabel}
        </time>
      </div>
      <h3 className="mt-4 font-display text-[21px] font-semibold leading-[1.2] tracking-[-0.02em] text-ink">
        {article.title}
      </h3>
      <p className="mt-3 line-clamp-3 text-[15px] leading-[1.6] text-body">{article.excerpt}</p>
      <div className="mt-auto flex items-center justify-between pt-6">
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-brand-navy">
          Leggi
          <ArrowUpRight
            size={15}
            strokeWidth={2}
            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </span>
        <span className="text-[12.5px] text-body">{article.readingTime}</span>
      </div>
    </Link>
  );
}
