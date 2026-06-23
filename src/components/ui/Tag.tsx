import type { ReactNode } from "react";

/** Chip/etichetta (categorie, stack tecnologico, tag articolo). */
export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-brand-blue/[0.08] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-brand-blue ring-1 ring-brand-blue/15">
      {children}
    </span>
  );
}
