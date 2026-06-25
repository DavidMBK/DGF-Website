import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { CaseStudy } from "@/lib/case-studies";

/**
 * Card progetto (double-bezel) usata nell'hub portfolio e nei "correlati".
 * `featured` rende la card più grande (immagine a sinistra, testo a destra).
 */
export function CaseStudyCard({ study, featured = false }: { study: CaseStudy; featured?: boolean }) {
  return (
    <Link
      href={`/portfolio/${study.slug}`}
      className={[
        "group block rounded-[1.75rem] bg-white/60 p-1.5 ring-1 ring-brand-blue/10",
        "shadow-[0_30px_70px_-45px_rgba(10,40,80,0.4)] transition-all duration-500 ease-out-soft",
        "hover:-translate-y-1 hover:ring-brand-blue/25",
        featured ? "sm:col-span-2" : "",
      ].join(" ")}
    >
      <article
        className={[
          "grid overflow-hidden rounded-[1.375rem] bg-white",
          featured ? "sm:grid-cols-2" : "grid-cols-1",
        ].join(" ")}
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-canvas-soft">
          <Image
            src={study.image}
            alt={`Anteprima del progetto ${study.client}`}
            width={1000}
            height={625}
            className="h-full w-full object-cover transition-transform duration-700 ease-out-soft group-hover:scale-[1.04]"
          />
        </div>
        <div className="flex flex-col p-6 sm:p-8">
          <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-brand-blue">
            <span>{study.category}</span>
            <span aria-hidden className="text-hairline">·</span>
            <span className="text-body">{study.year}</span>
          </div>
          <h3 className="mt-3 font-display text-[20px] font-semibold leading-[1.2] tracking-[-0.02em] text-ink sm:text-[23px]">
            {study.title}
          </h3>
          <p className="mt-3 line-clamp-3 text-[15px] leading-[1.6] text-body">{study.summary}</p>
          <div className="mt-auto flex items-center gap-2 pt-6 text-sm font-semibold text-brand-navy">
            Vedi il caso
            <ArrowUpRight
              size={15}
              strokeWidth={2}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </div>
        </div>
      </article>
    </Link>
  );
}
