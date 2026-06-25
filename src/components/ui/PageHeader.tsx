import type { ReactNode } from "react";
import { Breadcrumbs } from "./Breadcrumbs";
import { Reveal } from "./Reveal";
import type { Crumb } from "@/lib/seo";

interface Props {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  breadcrumbs?: Crumb[];
  children?: ReactNode;
}

/**
 * Header coerente per le pagine interne: padding che libera la navbar fissa,
 * sfondo chiaro con alone brand, breadcrumb + h1 + intro.
 */
export function PageHeader({ eyebrow, title, intro, breadcrumbs, children }: Props) {
  return (
    <header
      data-nav-theme="light"
      className="relative overflow-hidden bg-canvas-soft pb-14 pt-28 sm:pb-20 sm:pt-36"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-[-10%] h-[520px] w-[520px] rounded-full opacity-60"
        style={{
          background:
            "radial-gradient(circle at center, rgba(61,156,199,0.18) 0%, rgba(61,156,199,0) 62%)",
          filter: "blur(30px)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand-cyan/25 to-transparent"
      />
      <div className="relative mx-auto max-w-[1180px] px-6">
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
        <Reveal>
          {eyebrow && (
            <span className="eyebrow inline-flex items-center gap-3">
              <span className="h-px w-10 bg-gradient-to-r from-transparent to-brand-blue/60" />
              {eyebrow}
            </span>
          )}
          <h1 className="display-xl mt-5 max-w-[20ch] text-ink">
            {title}
          </h1>
          {intro && (
            <p className="mt-6 max-w-[58ch] text-[17px] leading-[1.65] text-body">{intro}</p>
          )}
          {children && <div className="mt-8">{children}</div>}
        </Reveal>
      </div>
    </header>
  );
}
